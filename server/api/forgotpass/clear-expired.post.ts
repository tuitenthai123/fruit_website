import { db } from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const {id} = await readBody(event)
  await db.users.update({
    where:{
      id
    },
    data:{
      expiredDate:null
    }
  })
})
