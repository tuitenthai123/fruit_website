import { v2 as cloudinary } from 'cloudinary'
import { db } from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { base64url, user_id } = await readBody(event)
  const config = useRuntimeConfig()
  cloudinary.config({
    cloud_name: config.private.NUXT_CLOUDINARY_CLOUD_NAME,
    api_key: config.private.NUXT_CLOUDINARY_API_KEY,
    api_secret: config.private.NUXT_CLOUDINARY_API_SECRET,
  });
  const uploadResult = await cloudinary.uploader
    .upload(
      base64url, {
      public_id: user_id,
    }
    )
    .catch((error) => {
      console.log(error);
    });

  await db.users.update({
    where:{
      id:user_id
    },
    data:{
      avata:uploadResult?.url
    }
  })
  return uploadResult?.url
})
