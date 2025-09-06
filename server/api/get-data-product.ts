import { db } from "~/lib/prisma"

interface QueryParams {
  type?: string
}

export default defineEventHandler(async (event) => {
  const data_param = getQuery(event) as QueryParams

  const response_data = await db.product.findMany({
    where: {
      id: {
        startsWith: data_param.type
      }
    }
  })

  return response_data
})