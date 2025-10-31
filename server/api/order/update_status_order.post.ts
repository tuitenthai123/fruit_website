import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.status) {
    const response_status_update_order = await db.order.updateMany({
      where: {
        id: body?.id
      },
      data: {
        approve_status: true
      }
    })
    return response_status_update_order
  } else {
    const response_status_update_order = await db.order.updateMany({
      where: {
        id: body?.id
      },
      data: {
        approve_status: true,
        response_code: "01"
      }
    })
    return response_status_update_order
  }

})
