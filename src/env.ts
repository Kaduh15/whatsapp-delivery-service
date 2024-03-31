import { z } from 'zod'

export const env = z
  .object({
    MONGODB_URI: z.string().url(),
  })
  .parse(process.env)
