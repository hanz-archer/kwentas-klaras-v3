export interface ProjectForm {
  name: string
  implementingUnit: string
  location: string
  appropriation: number
  year: string
  startDate: string
  endDate: string
  services: string
  remarks: string
  code: string
}

export interface RequiredField {
  key: string
  value: () => string | number | boolean
}
