import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response_update_customer = await db.customer.updateMany({
    where:{
      id:body?.customer_info?.id
    },
    data:{
      customernote:body?.customer_info?.customernote,
      shippingtime:body?.customer_info?.shippingtime
    }
  })
  
  return response_update_customer
})
