import { db } from "~/lib/prisma"
import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password_user_setting = body?.password
  const password_hash = await bcrypt.hash(`${password_user_setting}`, 10)
  const response_update_user_info = await db.users.updateMany({
    where: {
      id: body.id
    },
    data: {
      password:password_hash
    }
  })
  return response_update_user_info
})
