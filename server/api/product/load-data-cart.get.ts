import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const user_id = query.user_id
  const response = await db?.customer.findMany({
    where:{
      id_user:`${user_id}`
    },
    select:{
      productcart:true
    }
  })
  return response[0]?.productcart
})
