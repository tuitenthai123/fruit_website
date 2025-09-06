import { db } from "~/lib/prisma"

interface QueryParams {
  id_product?: string
}

export default defineEventHandler(async (event) => {
  const data_param = getQuery(event) as QueryParams

  const response_data = await db.product.findFirst({
    where: {
      id: data_param.id_product
    }
  })

  return response_data
})