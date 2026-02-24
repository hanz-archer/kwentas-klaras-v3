import type { Project } from '~/types/project/project'
import type { ProjectActivity } from '~/types/project/projectActivity'
import type { TimelineItem } from '~/types/project/timelineItem'
import { TIMELINE_MILESTONE_CONFIGS } from '~/constants/project/timelineMilestones'

export const useProjectTimeline = (project: Ref<Project | null>, activities?: Ref<ProjectActivity[]>) => {

  const timelineProgress = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = today.getTime() - startDate.getTime()

    if (totalDuration <= 0) return 0
    if (elapsed < 0) return 0
    if (elapsed > totalDuration) return 100

    return Math.round((elapsed / totalDuration) * 100)
  })

  const timelineMilestones = computed<TimelineItem[]>(() => {
    if (!project.value?.startDate || !project.value?.endDate) return []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const milestones = TIMELINE_MILESTONE_CONFIGS.map((config, idx) => ({
      label: config.label,
      date: config.getDate(startDate, endDate, today),
      isPast: config.getIsPast(startDate, endDate, today),
      isCurrent: config.getIsCurrent(startDate, endDate, today),
      isLast: config.isLast,
      isActivity: false,
      sameDayOrder: config.isLast ? 2 : 0,
    }))

    const allItems: TimelineItem[] = [...milestones]

    if (activities?.value && activities.value.length > 0) {
      const activityItems: TimelineItem[] = activities.value.map(activity => {
        const activityDate = new Date(activity.createdAt)
        activityDate.setHours(0, 0, 0, 0)
        
        let displayDate = activityDate
        if (activityDate < startDate) {
          displayDate = new Date(startDate)
        } else if (activityDate > endDate) {
          displayDate = new Date(endDate)
        }
        
        const isPast = displayDate < today
        const isCurrent = displayDate.getTime() === today.getTime()

        let label = activity.action || 'Activity'
        if (activity.action) {
          label = activity.action.charAt(0).toUpperCase() + activity.action.slice(1).replace(/_/g, ' ')
        }

        return {
          label,
          date: displayDate,
          isPast,
          isCurrent,
          isLast: false,
          isActivity: true,
          sameDayOrder: 1,
          description: activity.description,
          action: activity.action,
          originalDate: activityDate,
        }
      })

      allItems.push(...activityItems)
    }

    const sorted = allItems.sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime()
      if (dateDiff !== 0) return dateDiff

      const aOrder = (a as TimelineItem & { sameDayOrder?: number }).sameDayOrder ?? 1
      const bOrder = (b as TimelineItem & { sameDayOrder?: number }).sameDayOrder ?? 1
      if (aOrder !== bOrder) return aOrder - bOrder

      if (a.isActivity && b.isActivity && a.originalDate && b.originalDate) {
        const originalDateDiff = a.originalDate.getTime() - b.originalDate.getTime()
        if (originalDateDiff !== 0) return originalDateDiff
      }

      if (a.isActivity && b.isActivity) {
        const actionOrder: Record<string, number> = { created: 0, updated: 1 }
        const aAction = a.action || ''
        const bAction = b.action || ''
        return (actionOrder[aAction] ?? 99) - (actionOrder[bAction] ?? 99)
      }

      return 0
    })
    
    const dateToString = (date: Date): string => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    return sorted.map((item, index) => {
      const prevItem = index > 0 ? sorted[index - 1] : null
      const isNewDay = !prevItem || dateToString(item.date) !== dateToString(prevItem.date)
      
      return {
        ...item,
        isLast: index === sorted.length - 1,
        isNewDay,
      }
    })
  })

  const daysRemaining = computed(() => {
    if (!project.value?.endDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endDate = new Date(project.value.endDate)
    endDate.setHours(0, 0, 0, 0)

    const diff = endDate.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    return days
  })

  return {
    timelineProgress,
    timelineMilestones,
    daysRemaining,
  }
}

