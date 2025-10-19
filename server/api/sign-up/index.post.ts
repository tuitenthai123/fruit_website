import { db } from "~/lib/prisma"
import generateRandomId from "~/lib/randomID"
import bcrypt from "bcrypt"

interface Userdata {
  payload?: {
    hoVaTenDem?: string
    ten?: string
    email?: string
    phone?: string
    password?: string
  }
}

export default defineEventHandler(async (event) => {
const response_data = await readBody(event) as Userdata
if (!response_data?.payload) return false

  const user_Data = response_data.payload

  if (user_Data.phone) {
    const check_phone_exist = await db.users.findUnique({
      where: {
        phonenumber: BigInt(user_Data.phone),
      },
    })
    if (check_phone_exist) return "phone_exist"
  }

  const check_email_exist = await db.users.findUnique({
    where: {
      email: user_Data.email,
    },
  })
  if (check_email_exist) return "email_exist"

  const password_hash = await bcrypt.hash(`${user_Data.password}`, 10)
  const user_id = `user_${generateRandomId(5)}`
  await db.users.create({
    data: {
      id: user_id,
      name: `${user_Data.hoVaTenDem ?? ""} ${user_Data.ten ?? ""}`.trim(),
      email: user_Data.email!,
      password: password_hash,
      phonenumber: BigInt(user_Data.phone!),
      role: "2",
      status: true,
    },
  })

  await db.customer.create({
    data:{
      id:generateRandomId(5),
      id_user:user_id,
      shippingtime:"00:00 - 00:00"
    }
  })

  return true
})
