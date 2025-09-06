import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const { payload } = await readBody(event)
  await db.users.update({
    where: {
      id: payload?.id
    },
    data: {
      name: payload?.name,
      phonenumber: payload?.phonenumber ? BigInt(payload.phonenumber) : null,
      email: payload?.email,
      status: payload?.status,
      role: payload?.role,
    }
  })
  const response_datauser = await db.users.findFirst({
    where:{
      id:payload?.id
    }
  })
      return JSON.parse(
      JSON.stringify(response_datauser, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )
})
