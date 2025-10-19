import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const { userid } = await readBody(event)
  const role = await db.users.findMany({
    where: {
      id: userid
    }, 
    select: {
      role: true
    }
  })

  return role
})
