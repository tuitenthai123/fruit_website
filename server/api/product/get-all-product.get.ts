import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = (query.query as string)?.trim()

  if (!searchTerm) {
    return []
  }

  const response_product = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    take: 15,
    orderBy: {
      name: "asc",
    },
  })

  return response_product
})
