export default defineNuxtRouteMiddleware(async (to, from) => {
    const user_id = to.params.id_user_renew_pass
    const store = useFruitStore()
    const check_user_exist = await store.checkUserId(user_id as string)

    if (check_user_exist === null) {
        return navigateTo("/login")
    }

    // Case 1: Nếu password là null và không có expiredDate -> cho phép reset
    if (check_user_exist.password === null && !check_user_exist.expiredDate) {
        return 
    }

    // Case 2: Kiểm tra expired date nếu có
    if (check_user_exist?.expiredDate) {
        const currentTime = new Date().getTime()
        const expiredTime = new Date(check_user_exist.expiredDate).getTime()

        if (currentTime > expiredTime) {
            alert("Link đặt lại mật khẩu đã hết hạn!")
            return navigateTo("/login")
        }
        return 
    }
    return navigateTo("/login")
})
   
