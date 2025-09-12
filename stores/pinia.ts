export const useFruitStore = defineStore('websiteStore', {
  state: () => ({
    mainpagedata: [],
    productdata: [],
    productitemdata: {},
    userinfo: {},
    chinhanh: 0,
    isLogin: false,
  }),
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },

  actions: {
    async fetchDataMainpage() {
      const config = useRuntimeConfig()
      const infos: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/get-mainpage-data`)
      this.mainpagedata = infos
    },

    async fetchDataUser() {
      const config = useRuntimeConfig()
      const infos_user: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/users/get-all-user`)
      return infos_user
    },

    async fetchDataProduct(typeProduct: string) {
      const config = useRuntimeConfig()
      const productreponse: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/get-data-product?type=${typeProduct}`)
      this.productdata = productreponse
    },

    async fetchDataItemProduct(idProduct: string) {
      const config = useRuntimeConfig()
      const productreponse: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/get-products-item?id_product=${idProduct}`)
      this.productitemdata = productreponse
    },

    async checkLoginData(user_data: string) {
      const config = useRuntimeConfig()
      const response_status_login: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/login/check-login`, {
        method: "POST",
        body: {
          user_data
        },
        credentials: "include"
      })
      if (response_status_login) {
        this.userinfo = response_status_login
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      return response_status_login
    },

    async logOut() {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.NUXT_DOMAIN}/api/logout`)
      this.isLogin = false
      this.userinfo = {}
    },

    async signUp(payload: Record<string, any>) {
      const config = useRuntimeConfig()
      const response_status_login: any = await $fetch(`${config.public.NUXT_DOMAIN}/api/sign-up`, {
        method: "POST",
        body: {
          payload // luôn gửi dạng object
        }
      })
      return response_status_login
    },

    async verifyToken(token: string) {
      const config = useRuntimeConfig()
      const response_status_verify = await $fetch(`${config.public.NUXT_DOMAIN}/api/login/verify-token`, {
        method: "POST",
        body: { token },
      })
      if (response_status_verify) {
        this.userinfo = response_status_verify
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      return response_status_verify
    },

    async confirmPassword(newpassword: string, user_id?: string) {
      const config = useRuntimeConfig()
      const response_status_verify = await $fetch(`${config.public.NUXT_DOMAIN}/api/login/confirm-password`, {
        method: "POST",
        body: { newpassword, user_id }
      })
      return response_status_verify
    },

    async checkUserId(user_id?: string) {
      const config = useRuntimeConfig()
      const response_status_checking = await $fetch(`${config.public.NUXT_DOMAIN}/api/users/checking-user-exist`, {
        method: "POST",
        body: { user_id, type: "fisttime" }
      })
      return response_status_checking
    },

    async addNewUser(payload: any) {
      const config = useRuntimeConfig()
      const response_status_verify = await $fetch(`${config.public.NUXT_DOMAIN}/api/users/add-new-user`, {
        method: "POST",
        body: { payload }
      })
      return response_status_verify
    },

    async updateUser(payload: any) {
      const config = useRuntimeConfig()
      const response_status_verify = await $fetch(`${config.public.NUXT_DOMAIN}/api/users/update-user`, {
        method: "POST",
        body: { payload }
      })
      return response_status_verify
    },

    async deleteUser(id: any) {
      const config = useRuntimeConfig()
      const response_status_verify = await $fetch(`${config.public.NUXT_DOMAIN}/api/users/delete-user`, {
        method: "POST",
        body: { id }
      })
      return response_status_verify
    },

    async renewEmailPassword(email: string) {
      const config = useRuntimeConfig()
      const response_renew_status = await $fetch(`${config.public.NUXT_DOMAIN}/api/forgotpass/send-email-renew-pass`, {
        method: "POST",
        body: { email }
      })
      return response_renew_status
    },

    async clearExpiredDate(id: string) {
      const config = useRuntimeConfig()
      const response_clear = await $fetch(`${config.public.NUXT_DOMAIN}/api/forgotpass/clear-expired`, {
        method: "POST",
        body: { id }
      })
      return response_clear
    },

    async updateAvataUser(user_id: string, base64url: string) {
      const config = useRuntimeConfig()
      try {
        const response_update_avata = await $fetch(`${config.public.NUXT_DOMAIN}/api/setting/update-avata`, {
          method: "POST",
          body: { user_id, base64url }
        })
          ; (this.userinfo as any).avata = response_update_avata
          console.log(this.userinfo)
        return true
      } catch (error) {
        return error
      }
    },

  },
})