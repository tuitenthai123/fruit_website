import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user_data = body?.user_info
  const response_update_user_info = await db.users.updateMany({
    where:{
      id: user_data.id
    },
    data:{
      phonenumber:user_data?.phonenumber,
      name:user_data?.name,
      email:user_data?.email
    }
  })
  return response_update_user_info
})
