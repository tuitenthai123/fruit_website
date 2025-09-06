import { db } from "~/lib/prisma"
import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
  const {user_id,newpassword} = await readBody(event)
  const password_hash = await bcrypt.hash(`${newpassword}`, 10)
  try {
    const status_update_password = await db.users.updateMany({
      where:{
        id:user_id
      },
      data:{
        password:password_hash
      }
    }) 
    if(status_update_password?.count === 0) return false 
    
    return true
  } catch (error) {
    return error
  }
  
})
