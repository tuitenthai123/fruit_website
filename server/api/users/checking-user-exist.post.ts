import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const { user_id, type } = await readBody(event)
  if (type) {
    const user_id_exits = await db.users.findFirst({
      where: { id: user_id },
    })
    return JSON.parse(
      JSON.stringify(user_id_exits, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    )
  } else {
    const user_id_exits = await db.users.findFirst({
      where: { id: user_id },
    })
    return JSON.parse(
      JSON.stringify(user_id_exits, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    )
  }

})