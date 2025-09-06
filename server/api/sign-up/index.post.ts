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

  // ✅ Check phone tồn tại (convert sang BigInt để so sánh với DB)
  if (user_Data.phone) {
    const check_phone_exist = await db.users.findUnique({
      where: {
        phonenumber: BigInt(user_Data.phone),
      },
    })
    if (check_phone_exist) return "phone_exist"
  }

  // ✅ Check email tồn tại
  const check_email_exist = await db.users.findUnique({
    where: {
      email: user_Data.email,
    },
  })
  if (check_email_exist) return "email_exist"

  // ✅ Hash password
  const password_hash = await bcrypt.hash(`${user_Data.password}`, 10)

  // ✅ Insert user
  await db.users.create({
    data: {
      id: `user_${generateRandomId(5)}`,
      name: `${user_Data.hoVaTenDem ?? ""} ${user_Data.ten ?? ""}`.trim(),
      email: user_Data.email!,
      password: password_hash,
      phonenumber: BigInt(user_Data.phone!), // giữ BigInt
      role: "2",
      status: true,
    },
  })

  return true
})
