export const ANIMATION_TIMING = {
  FAST: '0.2s',
  NORMAL: '0.3s',
  SLOW: '0.5s',
  SLOWER: '0.7s',
} as const

export const ANIMATION_EASING = {
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

export const ANIMATION_DELAYS = {
  STAGGER_BASE: 0.1,
  STAGGER_INCREMENT: 0.1,
  STAGGER_MAX: 5,
} as const

export const ANIMATION_CLASSES = {
  PAGE_FADE_IN: 'animate-page-fade-in',
  CARD_FADE_IN: 'animate-card-fade-in',
  SECTION_FADE_IN_UP: 'animate-section-fade-in-up',
  FADE_IN: 'animate-fade-in',
  SLIDE_IN_RIGHT: 'animate-slide-in-right',
  SLIDE_IN_LEFT: 'animate-slide-in-left',
  SCALE_IN: 'animate-scale-in',
  PULSE: 'animate-pulse',
  HOVER_LIFT: 'hover-lift',
  HOVER_SCALE: 'hover-scale',
  HOVER_SHADOW: 'hover-shadow',
  CARD_HOVER: 'card-hover',
  TRANSITION_SMOOTH: 'transition-smooth',
  TRANSITION_FAST: 'transition-fast',
  TRANSITION_SLOW: 'transition-slow',
} as const
