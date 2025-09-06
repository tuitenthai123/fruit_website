// /server/api/avatar/[id].ts
export default defineEventHandler(async (event) => {
  const id_img = event.context.params?.id_image
  const googleUrl = `https://lh3.googleusercontent.com/${id_img}`

  const response = await fetch(googleUrl)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: response.statusText,
    })
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  return new Response(buffer, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
    },
  })
})
