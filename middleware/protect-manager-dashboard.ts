interface UserInfo {
    id: string;
}

export default defineNuxtRouteMiddleware(async (to, from) => {

  const store = useFruitStore();
  const user_id = (store?.userinfo as UserInfo)?.id;

  if (!user_id) {
    return navigateTo('/login');
  }

  const response = await store.checkrole(user_id);
  if (response?.[0]?.role !== "1") {
    throw createError({
      statusCode: 403,
      statusMessage: "Bạn không có quyền truy cập vào trang này.",
      fatal: true,
    });
  }
});
