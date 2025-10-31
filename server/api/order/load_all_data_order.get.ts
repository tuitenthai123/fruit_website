import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const response_data = await db.order.findMany()
  return response_data
})
