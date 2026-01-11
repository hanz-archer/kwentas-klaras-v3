import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository'
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository'
import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { ComputationService } from '../computation/ComputationService'
import type { PrismaClient } from '@prisma/client'
import { prisma } from '../../lib/prisma'

export class GraphsService {
  private disbursementRepo: DisbursementRepository
  private obligationRepo: ObligationRepository
  private projectRepo: ProjectRepository
  private computationService: ComputationService
  private client: PrismaClient

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma
    this.disbursementRepo = new DisbursementRepository(prismaClient)
    this.obligationRepo = new ObligationRepository(prismaClient)
    this.projectRepo = new ProjectRepository(prismaClient)
    this.computationService = new ComputationService(prismaClient)
  }

  async getDailyExpenses(): Promise<Record<string, number>> {
    const disbursements = await this.disbursementRepo.findAll()
    const dailyExpenses: Record<string, number> = {}

    disbursements.forEach(disbursement => {
      if (disbursement.createdAt) {
        const date = new Date(disbursement.createdAt)
        const day = date.toISOString().split('T')[0]

        if (day in dailyExpenses) {
          dailyExpenses[day] += disbursement.amount
        } else {
          dailyExpenses[day] = disbursement.amount
        }
      }
    })

    return dailyExpenses
  }

  async getMonthlyExpenses(): Promise<Record<string, number>> {
    const disbursements = await this.disbursementRepo.findAll()
    const monthlyExpenses: Record<string, number> = {}

    disbursements.forEach(disbursement => {
      if (disbursement.createdAt) {
        const date = new Date(disbursement.createdAt)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (month in monthlyExpenses) {
          monthlyExpenses[month] += disbursement.amount
        } else {
          monthlyExpenses[month] = disbursement.amount
        }
      }
    })

    return monthlyExpenses
  }

  async getMonthlyComparison(): Promise<{
    months: string[]
    totalDisbursements: Record<string, number>
    totalObligations: Record<string, number>
  }> {
    const disbursements = await this.disbursementRepo.findAll()
    const obligations = await this.obligationRepo.findAll()

    const totalDisbursements: Record<string, number> = {}
    const totalObligations: Record<string, number> = {}
    const monthsSet = new Set<string>()

    disbursements.forEach(disbursement => {
      if (disbursement.createdAt) {
        const date = new Date(disbursement.createdAt)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthsSet.add(month)

        if (month in totalDisbursements) {
          totalDisbursements[month] += disbursement.amount
        } else {
          totalDisbursements[month] = disbursement.amount
        }
      }
    })

    obligations.forEach(obligation => {
      if (obligation.createdAt) {
        const date = new Date(obligation.createdAt)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthsSet.add(month)

        if (month in totalObligations) {
          totalObligations[month] += obligation.amount
        } else {
          totalObligations[month] = obligation.amount
        }
      }
    })

    const months = Array.from(monthsSet).sort()

    return {
      months,
      totalDisbursements,
      totalObligations,
    }
  }

  async getDepartmentUtilizationRates(): Promise<Record<string, number>> {
    const projects = await this.projectRepo.findAll()
    const departmentData: Record<string, { totalUtilization: number; count: number }> = {}

    for (const project of projects) {
      if (!project.id || !project.appropriation || !project.implementingUnit) continue

      const department = project.implementingUnit
      const utilizationRate = await this.computationService.calculateUtilizationRate(project.id, project.appropriation)

      if (!departmentData[department]) {
        departmentData[department] = { totalUtilization: 0, count: 0 }
      }

      departmentData[department].totalUtilization += utilizationRate
      departmentData[department].count += 1
    }

    const departmentUtilizationRates: Record<string, number> = {}

    Object.keys(departmentData).forEach(department => {
      const data = departmentData[department]
      if (data.count > 0) {
        departmentUtilizationRates[department] = Number((data.totalUtilization / data.count).toFixed(2))
      }
    })

    return departmentUtilizationRates
  }

  async getAverageUtilizationRate(): Promise<number> {
    const projects = await this.projectRepo.findAll()
    let totalUtilization = 0
    let totalEntries = 0

    for (const project of projects) {
      if (!project.id || !project.appropriation) continue

      const utilizationRate = await this.computationService.calculateUtilizationRate(project.id, project.appropriation)
      totalUtilization += utilizationRate
      totalEntries += 1
    }

    return totalEntries > 0 ? Number((totalUtilization / totalEntries).toFixed(2)) : 0
  }
}
