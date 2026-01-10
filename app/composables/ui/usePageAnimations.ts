import { computed, ref } from 'vue'
import type { StaggeredAnimationOptions } from '~/types/ui/pageAnimations'

export function usePageAnimations() {
  const isPageLoaded = ref(false)

  const pageContainerClasses = computed<string[]>(() => [
    'animate-page-fade-in',
  ])

  const cardClasses = computed<string[]>(() => [
    'animate-card-fade-in',
    'card-hover',
    'will-change-all',
  ])

  const statCardClasses = computed<string[]>(() => [
    'animate-stat-card-fade-in',
    'hover-lift',
    'will-change-all',
  ])

  const sectionClasses = computed<string[]>(() => [
    'animate-section-fade-in-up',
    'transition-smooth',
  ])

  const hoverLiftClasses = computed<string[]>(() => ['hover-lift'])

  const hoverScaleClasses = computed<string[]>(() => ['hover-scale'])

  const hoverShadowClasses = computed<string[]>(() => ['hover-shadow'])

  const cardHoverClasses = computed<string[]>(() => ['card-hover'])

  const transitionSmoothClasses = computed<string[]>(() => [
    'transition-smooth',
  ])

  const transitionFastClasses = computed<string[]>(() => ['transition-fast'])

  const transitionSlowClasses = computed<string[]>(() => ['transition-slow'])

  const getStaggeredDelayClass = (
    index: number,
    options?: StaggeredAnimationOptions
  ): string => {
    const maxItems = options?.maxItems ?? 5

    if (index >= maxItems) {
      return `animate-stagger-${maxItems}`
    }

    return `animate-stagger-${Math.min(index + 1, maxItems)}`
  }

  const getAnimationClass = (type: string): string => {
    const animationMap: Record<string, string> = {
      fadeIn: 'animate-fade-in',
      slideInRight: 'animate-slide-in-right',
      slideInLeft: 'animate-slide-in-left',
      scaleIn: 'animate-scale-in',
      pulse: 'animate-pulse',
      pageFadeIn: 'animate-page-fade-in',
      cardFadeIn: 'animate-card-fade-in',
      sectionFadeInUp: 'animate-section-fade-in-up',
    }

    return animationMap[type] || ''
  }

  const markPageLoaded = () => {
    isPageLoaded.value = true
  }

  return {
    isPageLoaded,
    pageContainerClasses,
    cardClasses,
    statCardClasses,
    sectionClasses,
    hoverLiftClasses,
    hoverScaleClasses,
    hoverShadowClasses,
    cardHoverClasses,
    transitionSmoothClasses,
    transitionFastClasses,
    transitionSlowClasses,
    getStaggeredDelayClass,
    getAnimationClass,
    markPageLoaded,
  }
}
