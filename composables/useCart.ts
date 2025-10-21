import { useFruitStore } from '~/stores/pinia'

export const useCart = () => {
  const store = useFruitStore()
  
  const addToCart = async (product: any) => {
    try {
      if (!store.isLogin) {
        throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      }
      
      if (!product?.id || !product?.name || !product?.price) {
        throw new Error('Thông tin sản phẩm không hợp lệ')
      }

      await store.addProductToCart(product)
      return {
        success: true,
        message: 'Thêm vào giỏ hàng thành công'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng'
      }
    }
  }

  return {
    addToCart
  }
}
