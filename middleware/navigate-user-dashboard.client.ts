interface UserInfo {
    id: string;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useFruitStore()
  const user_id = (store?.userinfo as UserInfo).id
  console.log(user_id);
  const response = await store.checkrole(user_id as string)
  console.log(response[0]?.role);

  if (response[0]?.role != "0") {
    throw createError({
      statusCode: 403,
      statusMessage: "Bạn không có quyền truy cập vào trang này.",
      fatal: true, 
    })
  }else{
    return
  }
})
