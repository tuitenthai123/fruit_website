import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const response_data = await db.product.findMany()
  return response_data
})