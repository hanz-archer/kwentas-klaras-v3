import { readFileSync } from 'fs'
import { join } from 'path'
import ExcelJS from 'exceljs'
import { ProjectService } from '../../services/project/ProjectService'
import { ComputationService } from '../../services/computation/ComputationService'
import { withErrorHandler } from '../../utils/errorHandler'
import { categorizeService, getServiceStartRow } from '../../utils/excelServiceCategory'
import type { ProjectExportData } from '../../types/excel/projectExport'
import { EXCEL_SERVICE_CATEGORIES, EXCEL_SERVICE_CATEGORY_LIST } from '../../constants/excel/serviceCategories'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const body = await readBody(event)
    const selectedProjectIds = body.projectIds || []

    if (!Array.isArray(selectedProjectIds) || selectedProjectIds.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Project IDs are required',
      })
    }

    const templatePath = join(process.cwd(), 'server', 'templates', 'template_report.xlsx')
    const templateFile = readFileSync(templatePath)

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(templateFile as any)

    const worksheet = workbook.getWorksheet(1)
    
    if (!worksheet) {
      throw createError({
        statusCode: 500,
        message: 'Template worksheet not found',
      })
    }

    const projectService = new ProjectService()
    const computationService = new ComputationService()

    const projects = await projectService.list()
    const selectedProjects = projects.filter(p => p.id && selectedProjectIds.includes(p.id))

    const projectsWithData: ProjectExportData[] = []

    for (const project of selectedProjects) {
      if (!project.id || !project.appropriation) continue

      const [utilizationRate, totalAddedBudget, totalObligations, totalDisbursements, remainingBalance] = await Promise.all([
        computationService.calculateUtilizationRate(project.id, project.appropriation),
        computationService.calculateTotalAddedBudget(project.id),
        computationService.calculateTotalObligations(project.id),
        computationService.calculateTotalDisbursements(project.id),
        computationService.calculateRemainingBalance(project.id, project.appropriation),
      ])

      const totalBudget = project.appropriation + totalAddedBudget
      const category = categorizeService(project.services || EXCEL_SERVICE_CATEGORIES.GENERAL)

      projectsWithData.push({
        id: project.id,
        name: project.name,
        location: project.location || '',
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        totalBudget,
        totalDisbursements,
        utilizationRate,
        remarks: project.remarks || '',
        category,
      })
    }

    const serviceGroups: Record<string, ProjectExportData[]> = EXCEL_SERVICE_CATEGORY_LIST.reduce((acc, category) => {
      acc[category] = []
      return acc
    }, {} as Record<string, ProjectExportData[]>)

    projectsWithData.forEach(project => {
      serviceGroups[project.category].push(project)
    })

    const lastUsedRows: Record<string, number> = EXCEL_SERVICE_CATEGORY_LIST.reduce((acc, category) => {
      acc[category] = getServiceStartRow(category)
      return acc
    }, {} as Record<string, number>)

    const formatRow = (rowNum: number) => {
      const row = worksheet.getRow(rowNum)
      row.eachCell((cell, colNumber) => {
        if (colNumber !== 10) {
          cell.font = { name: 'Calibri', size: 10 }
          cell.alignment = { horizontal: 'left', vertical: 'middle' }
          cell.border = {
            left: { style: 'thin' },
            right: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
          }
        }
      })
    }

    const setDateCell = (cell: ExcelJS.Cell, date: Date | string | null | undefined) => {
      if (!date) {
        cell.value = null
        return
      }
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) {
        cell.value = null
        return
      }
      cell.value = dateObj
      cell.numFmt = 'mm/dd/yyyy'
    }

    const setCurrencyCell = (cell: ExcelJS.Cell, value: number | null | undefined) => {
      if (value === null || value === undefined) {
        cell.value = 0
        cell.numFmt = '₱#,##0.00'
        return
      }
      cell.value = value
      cell.numFmt = '₱#,##0.00'
    }

    Object.keys(serviceGroups).forEach(category => {
      const projects = serviceGroups[category]
      
      projects.forEach(project => {
        const startRow = lastUsedRows[category]
        
        worksheet.spliceRows(startRow, 0, [])
        
        const row = worksheet.getRow(startRow)
        
        row.getCell('A').value = project.name || ''
        row.getCell('B').value = project.location || ''
        setCurrencyCell(row.getCell('C'), project.totalBudget)
        setDateCell(row.getCell('D'), project.startDate)
        setDateCell(row.getCell('E'), project.endDate)
        row.getCell('F').value = project.utilizationRate ? `${project.utilizationRate.toFixed(2)}%` : '0%'
        setCurrencyCell(row.getCell('G'), project.totalDisbursements)
        row.getCell('I').value = project.remarks || ''
        
        formatRow(startRow)
        
        lastUsedRows[category] = startRow + 1
      })
    })

    const totalsRowNum = 23
    const totalsRow = worksheet.getRow(totalsRowNum)
    
    if (totalsRow) {
      const cellA = totalsRow.getCell('A')
      const cellC = totalsRow.getCell('C')
      const cellG = totalsRow.getCell('G')
      
      if (cellA) {
        cellA.value = 'Total'
      }
      
      if (cellC) {
        cellC.numFmt = '₱#,##0.00'
      }
      
      if (cellG) {
        cellG.numFmt = '₱#,##0.00'
      }
      
      for (let col = 1; col <= 9; col++) {
        const cell = totalsRow.getCell(col)
        cell.font = { name: 'Calibri', size: 10 }
        cell.alignment = { horizontal: 'left', vertical: 'middle' }
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        }
      }
    }

    const excelBuffer = await workbook.xlsx.writeBuffer()

    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', 'attachment; filename="Projects Report.xlsx"')

    return new Uint8Array(excelBuffer as ArrayBuffer)
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to export projects to Excel',
  })
})
