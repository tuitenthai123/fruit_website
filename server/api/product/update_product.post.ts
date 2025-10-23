import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response = await db?.customer?.updateMany({
    where:{
      id_user:body?.user_id
    },
    data:{
      productcart:body?.cartproduct
    }
  })
  return response
})
