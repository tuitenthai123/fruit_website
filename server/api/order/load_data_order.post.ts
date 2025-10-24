import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response = await db.order.findMany({
    where:{
      user_id:body?.user_id
    }
  })
  return response
})
