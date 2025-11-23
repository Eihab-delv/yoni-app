
import { imageRoutes } from './image/routes'
import { notificationRoutes } from './notifications/routes'
import { usersRoutes } from './users/routes'

export * from './health'
export * from './seed'
export * from './users'
export * from './notifications'
export * from './image'
export * from './auth'

export const protectedRoutes = [
  ...imageRoutes,
  ...notificationRoutes,
  ...usersRoutes,
]
