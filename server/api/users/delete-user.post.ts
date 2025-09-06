import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  const response_delete = await db.users.delete({
    where: {
      id
    }
  })

  return {
    ...response_delete,
    phonenumber: response_delete.phonenumber?.toString() ?? null,
  }
})
