import { db } from "~/lib/prisma"
import generateRandomId from "~/lib/randomID"

export default defineEventHandler(async (event) => {
  const { payload } = await readBody(event)
  try {
    const status_add_new_user = await db.users.create({
      data: {
        id: payload?.id,
        email: payload?.email,
        phonenumber: payload?.phonenumber ? Number(payload.phonenumber) : null,
        role: payload?.role,
        status: payload?.status,
        name: payload?.name,
        active: payload?.active,
      },
    })
      await db.customer.create({
        data:{
          id:generateRandomId(5),
          id_user:payload?.id,
          shippingtime:"00:00 - 00:00",
          productcart: [],
        }
      })

    return JSON.parse(
      JSON.stringify(status_add_new_user, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )
  } catch (error) {
    console.error(error)
    return error
  }
})
