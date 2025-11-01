import { OAuth2Client } from "google-auth-library"
import { db } from "~/lib/prisma"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import generateRandomId from "~/lib/randomID"

(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = await readBody(event)
  const client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken: token?.token,
    audience: config?.private?.NUXT_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const email_exist = await db.users.findFirst({
    where: {
      email: payload?.email
    }
  })

  if (email_exist) {
    await db.users.updateMany({
      data: {
        active: true,
      },
      where: {
        email: payload?.email
      }
    })
    const secret = config.private.NUXT_JWT_SECRET
    const token = jwt.sign(
      {
        id: email_exist.id,
        email: email_exist.email,
        role: email_exist.role,
        name: email_exist.name,
        avata: email_exist.avata
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

    const { password, ...safeinfo } = email_exist
    const customer_info = await db.customer.findMany({
      where: {
        id_user: email_exist.id
      },
      select: {
        id: true,
        customernote: true,
        address: true,
      }
    })


    return {
      user: safeinfo,
      customer_info
    }
  } else {
    const user_id = `user_${String(payload?.exp).split('').reverse().join('').slice(0, 5)}`
    const userinfo = {
      id: user_id,
      email: `${payload?.email}`,
      name: `${payload?.family_name} ${payload?.given_name}`,
      role: "2",
      avata: `${payload?.picture}`,
      active: true,
      status: true
    }

    const customer_info = {
      id: generateRandomId(5),
      id_user: user_id,
      shippingtime: "00:00 - 00:00",
      productcart: [],
    }
    await db.users.create({
      data: userinfo
    })
    await db.customer.create({
      data: customer_info
    })

    return {
      user: userinfo,
      customer_info:customer_info
    }
  }
})
