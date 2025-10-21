export interface CartItem {
  id: string
  name: string
  price: string
  imginfo: string
  count_product: number
}


export const useFruitStore = defineStore('websiteStore', {
  state: () => ({
    mainpagedata: [],
    cartproduct: [] as CartItem[],
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
    async addProductToCart(product: CartItem, changecount?: number) {
      const exist = this.cartproduct.find((p) => p.id === product.id)

      const img = (product as any)?.imageInfo?.[1] ?? (product as any)?.imageInfo?.[0] ?? product.imginfo
      const product_fix: CartItem = { ...product, imginfo: img }

      if (exist) {
        if (changecount !== undefined) {
          exist.count_product = changecount
        } else {
          exist.count_product += 1
        }
      } else {
        this.cartproduct.push({
          id: product_fix.id,
          name: product_fix.name,
          price: product_fix.price,
          imginfo: product_fix.imginfo,
          count_product: changecount ?? 1,
        })
      }

      try {
        const response = await $fetch(`/api/product/add_product`, {
          method: "POST",
          body: {
            user_id: (this.userinfo as any)?.id,
            cartproduct: this.cartproduct,
          },
        })
        console.log("✅ Updated cart:", response)
      } catch (err) {
        console.error("❌ Failed to update cart:", err)
      }
    },


    async checkrole(userid: string) {
      const role: any = await $fetch(`/api/users/checkrole`, {
        method: "POST",
        body: {
          userid
        },
      })
      return role
    },

    async fetchDataMainpage() {
      const infos: any = await $fetch(`/api/get-mainpage-data`)
      this.mainpagedata = infos
    },

    async fetchDataUser() {
      const infos_user: any = await $fetch(`/api/users/get-all-user`)
      return infos_user
    },

    async fetchDataProduct(typeProduct: string) {
      const productreponse: any = await $fetch(`/api/get-data-product?type=${typeProduct}`)
      this.productdata = productreponse
    },

    async fetchDataItemProduct(idProduct: string) {
      const productreponse: any = await $fetch(`/api/get-products-item?id_product=${idProduct}`)
      this.productitemdata = productreponse
    },

    async checkLoginData(user_data: string) {
      const response_status_login: any = await $fetch(`/api/login/check-login`, {
        method: "POST",
        body: {
          user_data
        },
        credentials: "include"
      })

      if (response_status_login) {
        this.userinfo = response_status_login
        this.isLogin = true
        const response_cart_product: any = await $fetch(`/api/product/load-data-cart?user_id=${response_status_login?.id}`)
        this.cartproduct = response_cart_product
      } else {
        this.isLogin = false
      }
      return response_status_login
    },

    async logOut() {
      await $fetch(`/api/logout`)
      this.isLogin = false
      this.userinfo = {}
      this.cartproduct = []
    },

    async signUp(payload: Record<string, any>) {
      const response_status_login: any = await $fetch(`/api/sign-up`, {
        method: "POST",
        body: {
          payload
        }
      })
      return response_status_login
    },

    async verifyToken(token: string) {
      const response_status_verify = await $fetch(`/api/login/verify-token`, {
        method: "POST",
        body: { token },
      })
      if (response_status_verify) {
        this.userinfo = response_status_verify
        this.isLogin = true
        const response_cart_product: any = await $fetch(`/api/product/load-data-cart?user_id=${(response_status_verify as any)?.id}`)
        console.log(response_cart_product);
        this.cartproduct = response_cart_product
      }
      return response_status_verify
    },

    async confirmPassword(newpassword: string, user_id?: string) {
      const response_status_verify = await $fetch(`/api/login/confirm-password`, {
        method: "POST",
        body: { newpassword, user_id }
      })
      return response_status_verify
    },

    async checkUserId(user_id?: string) {
      const response_status_checking = await $fetch(`/api/users/checking-user-exist`, {
        method: "POST",
        body: { user_id, type: "fisttime" }
      })
      return response_status_checking
    },

    async addNewUser(payload: any) {
      const response_status_verify = await $fetch(`/api/users/add-new-user`, {
        method: "POST",
        body: { payload }
      })
      return response_status_verify
    },

    async updateUser(payload: any) {
      const response_status_verify = await $fetch(`/api/users/update-user`, {
        method: "POST",
        body: { payload }
      })
      return response_status_verify
    },

    async deleteUser(id: any) {
      const response_status_verify = await $fetch(`/api/users/delete-user`, {
        method: "POST",
        body: { id }
      })
      return response_status_verify
    },

    async renewEmailPassword(email: string) {
      const response_renew_status = await $fetch(`/api/forgotpass/send-email-renew-pass`, {
        method: "POST",
        body: { email }
      })
      return response_renew_status
    },

    async clearExpiredDate(id: string) {
      const response_clear = await $fetch(`/api/forgotpass/clear-expired`, {
        method: "POST",
        body: { id }
      })
      return response_clear
    },

  },
})