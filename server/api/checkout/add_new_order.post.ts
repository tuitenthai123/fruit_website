import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = body?.orderinfo
  const response_add_new_order = await db.order.create({
    data:{
      id:data?.id,
      user_id:data?.user_id,
      order_details:data?.order_details,
      payment_details:data?.payment_details,
      product:data?.products,
      contact:data?.contact,
      contact_address:data?.contact_address
    }
  })

  return response_add_new_order
})
