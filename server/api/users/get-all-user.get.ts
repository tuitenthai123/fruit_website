import { db } from "~/lib/prisma"

export default defineEventHandler(async () => {
  const data_user = await db.users.findMany()

  return JSON.parse(
    JSON.stringify(data_user, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
})
