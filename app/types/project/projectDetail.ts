import type { Project } from '~/types/project/project'

export type ProjectWithMetadata = Project & {
  createdAt?: string | Date
}
