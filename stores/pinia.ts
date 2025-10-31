import Fuse from "fuse.js"

export interface CartItem {
  id: string
  name: string
  price: string
  imginfo: string
  count_product: number
}

interface CustomerInfo {
  id?: string,
  customernote?: string
  shippingtime?: string
}

export const useFruitStore = defineStore('websiteStore', {
  state: () => ({
    mainpagedata: [],
    cartproduct: [] as CartItem[],
    productdata: [],
    allproduct: [],
    productitemdata: {},
    userinfo: {},
    chinhanh: 0,
    isLogin: false,
    customer_info: {} as CustomerInfo,
    searchCache: new Map<string, { data: any[]; time: number }>(),
    searchTTL: 1000 * 60 * 10,
  }),
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },

  actions: {
    _getCache(key: string) {
      const sc: any = (this as any).searchCache
      if (!sc) return undefined
      if (sc instanceof Map) return sc.get(key)
      return sc[key]
    },

    _setCache(key: string, value: { data: any[]; time: number }) {
      const sc: any = (this as any).searchCache
      if (sc instanceof Map) {
        sc.set(key, value)
      } else {
        ; (this as any).searchCache = { ...(sc || {}), [key]: value }
      }
    },

    async searchProductHybrid(keyword: string) {
      if (!keyword || keyword.trim().length < 2) return []

      const now = Date.now()
      const cacheKey = keyword.toLowerCase()
      const cached: any = this._getCache(cacheKey)

      if (cached && now - cached.time < this.searchTTL) {
        this.refreshSearch(keyword)
        return cached.data
      }

      const localResults = this.searchLocal(keyword)

      if (localResults.length > 0) {
        this._setCache(cacheKey, { data: localResults, time: now })
        this.refreshSearch(keyword)
        return localResults
      }

      const fresh = await this.fetchSearchFromApi(keyword)
      this._setCache(cacheKey, { data: fresh, time: now })
      return fresh
    },

    searchLocal(keyword: string) {
      if (!this.allproduct.length) return []
      const fuse = new Fuse(this.allproduct, {
        keys: ["name"],
        threshold: 0.4,
      })
      return fuse.search(keyword).map(r => r.item)
    },

    async refreshSearch(keyword: string) {
      try {
        const fresh = await this.fetchSearchFromApi(keyword)
        this._setCache(keyword.toLowerCase(), {
          data: fresh,
          time: Date.now(),
        })
      } catch (err) {
        console.error("refreshSearch fail:", err)
      }
    },

    async fetchSearchFromApi(keyword: string) {
      const result = await $fetch(`/api/product/get-all-product?query=${encodeURIComponent(keyword)}`)
      return result as any[]
    },
    async fetchAllDataProduct() {
      const response_all_data = await $fetch(`/api/product/get-all-product`)
      this.allproduct = response_all_data as any
    },

    async updateOrderStatus(status: boolean, id: string) {
      const response_data_order = await $fetch(`/api/order/update_status_order`, {
        method: "POST",
        body: {
          id,
          status
        },
      })
      return response_data_order
    },

    async fetchDataOrderDashboard() {
      const response_data_order = await $fetch(`/api/order/load_all_data_order`)
      return response_data_order
    },

    async fetchDataOrder(user_id: string) {
      const response_data_order = await $fetch(`/api/order/load_data_order`, {
        method: "POST",
        body: {
          user_id
        },
      })
      return response_data_order
    },

    async addNewOrder(orderinfo: any) {
      try {
        const response_add_new_order = await $fetch(`/api/checkout/add_new_order`, {
          method: "POST",
          body: { orderinfo },
        })
        if (orderinfo?.payment_method === 'COD') {
          const response_cod_payment = await $fetch(`/api/checkout/add_cod_order`, {
            method: "POST",
            body: { user_id: orderinfo?.id },
          })
          return
        }

        this.cartproduct = []

        const response_payment_url = await $fetch('/api/create_payment_url', {
          method: 'POST',
          body: {
            amount: orderinfo?.payment_details?.total,
            id: orderinfo?.id,
            name: orderinfo?.contact_address?.full_name
          },
        })

        if (response_payment_url) {
          window.location.href = (response_payment_url as any)?.paymentUrl
        }
      } catch (err) {
        console.error(err)
        alert('Lỗi khi gọi API thanh toán')
      }
    },


    async updateCustomerInfo(customer_info: CustomerInfo) {
      await $fetch(`/api/customer/update_customer_info`, {
        method: "POST",
        body: {
          customer_info
        },
      })
      this.customer_info = { ...customer_info, shippingtime: customer_info?.shippingtime }
    },

    async updateProductToCart(product: CartItem, changecount?: number) {
      if (this.isLogin) {
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
          await $fetch(`/api/product/update_product`, {
            method: "POST",
            body: {
              user_id: (this.userinfo as any)?.id,
              cartproduct: this.cartproduct,
            },
          })
        } catch (err) {
          console.error(" Failed to update cart:", err)
        }
      } else {
        alert("Đăng nhập trước khi mua hàng bạn nhé!")
        const router = useRouter()
        router.push('/login')
      }

    },

    async removeFromCart(productId: string) {
      this.cartproduct = this.cartproduct.filter(item => item.id !== productId)
      try {
        const response = await $fetch(`/api/product/update_product`, {
          method: "POST",
          body: {
            user_id: (this.userinfo as any)?.id,
            cartproduct: this.cartproduct,
          },
        })
      } catch (err) {
        throw createError({ statusCode: 500, statusMessage: "error" })
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

      if (response_status_login?.user) {
        this.userinfo = response_status_login?.user
        this.customer_info = response_status_login?.customer_info[0]
        this.isLogin = true
        const response_cart_product: any = await $fetch(`/api/product/load-data-cart?user_id=${response_status_login?.user?.id}`)
        this.cartproduct = response_cart_product
      } else {
        this.isLogin = false
      }
      return response_status_login?.user
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
      const response_status_verify: any = await $fetch(`/api/login/verify-token`, {
        method: "POST",
        body: { token },
      })
      if (response_status_verify) {
        this.userinfo = response_status_verify?.user
        this.isLogin = true
        this.customer_info = response_status_verify?.customer_info[0]
        const response_cart_product: any = await $fetch(`/api/product/load-data-cart?user_id=${response_status_verify?.user?.id}`)
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