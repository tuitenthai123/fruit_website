import { db } from "~/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookie from "cookie"

interface Userdata {
  user_data?: {
    email?: string;
    password?: string;
  };
}

function convertBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export default defineEventHandler(async (event) => {
  const data_user = await readBody(event) as Userdata
  const config = useRuntimeConfig()

  const user = await db.users.findFirst({
    where: {
      email: data_user?.user_data?.email
    }
  })

  if (!user) return false

  const password_match = await bcrypt.compare(
    `${data_user?.user_data?.password}`,
    `${user.password}`
  )

  if (!password_match) return false

  const secret = config.private.NUXT_JWT_SECRET
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: "Missing JWT_SECRET in environment" })
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avata: user.avata
    },
    secret,
    { expiresIn: "1h" }
  )

  setHeader(event, "Set-Cookie", cookie.serialize("token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60
  }))

  const { password: _, ...safeUser } = user

  const customer_info = await db.customer.findMany({
    where: {
      id_user: user.id
    },
    select: {
      id: true,
      customernote: true,
      address:true,
    }
  })


  return convertBigInt({
    user: safeUser,
    customer_info
  })

})
