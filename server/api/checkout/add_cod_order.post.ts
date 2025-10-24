import moment from "moment"
import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = body?.user_id
  const date = new Date();
  const orderId = moment(date).format("YYYYMMDDHHmmssSSS");
  const response_add_new_order = await db.order.updateMany({
    where: {
      id: data
    },
    data: {
      order_id: orderId,
      response_code: "00",
      payment_method: "COD"
    }
  })

  return response_add_new_order
})
