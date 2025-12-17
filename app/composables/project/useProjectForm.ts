import { useProjects } from './useProjects'
import { useErrorHandler } from '../error/useErrorHandler'
import { getRequiredFields } from '~/constants/project/requiredFields'
import type { Project } from '~/types/project/project'

const currentYear = new Date().getFullYear()
const defaultStartDate = `${currentYear}-01-01`
const defaultEndDate = `${currentYear}-12-31`

export const useProjectForm = () => {
  const { createProject } = useProjects()

  const form = reactive({
    name: '',
    implementingUnit: '',
    location: '',
    appropriation: 0,
    year: currentYear.toString(),
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    services: '',
    remarks: '',
    code: '',
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const requiredFields = computed(() => getRequiredFields(form))

  const requiredFieldsCount = computed(() => requiredFields.value.length)

  const remainingRequiredFields = computed(() => {
    return requiredFields.value.filter(field => !field.value()).length
  })

  const handleSubmit = async () => {
    error.value = null
    loading.value = true

    await useErrorHandler(async () => {
      const projectData: Project = {
        name: form.name || `${form.implementingUnit} - ${form.year}`,
        implementingUnit: form.implementingUnit,
        location: form.location,
        appropriation: form.appropriation,
        year: Number(form.year),
        services: form.services,
        remarks: form.remarks,
        code: form.code,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      }

      await createProject(projectData)
      await navigateTo('/admin/projects')
    }, {
      defaultMessage: 'Failed to create project',
      onError: (err: Error) => {
        error.value = err.message
        loading.value = false
      }
    })

    loading.value = false
  }

  return {
    form,
    loading,
    error,
    requiredFieldsCount,
    remainingRequiredFields,
    handleSubmit,
  }
}
