<template>
  <div>
    <v-footer class="footer-custom d-flex flex-column ga-2 py-4">
    <v-divider width="100%"></v-divider>
      <v-container grid-list-xs>
        <v-row justify="space-between" gutters >
          <v-col cols="12" sm="6" class="custom-title">
            <strong style="font-size: 18px;">Về Morning Fruit</strong>
            <v-row class="mt-2">
              <v-row >
                <v-col cols="12" sm="6">
                  <p>Morning Fruit là thương hiệu trái cây tươi chất lượng cao, với đa dạng sản phẩm phục vụ mọi nhu
                    cầu: đặc sản vùng miền, trái cây nhập khẩu, quà tặng trái cây, mâm ngũ quả, nước ép, và trái cây
                    sấy.</p>
                    <img class="mt-3" src="https://theme.hstatic.net/200000377165/1001286359/14/footer_logobct_img.png?v=230" width="150" height="57" alt="">
                </v-col>
                <v-col cols="12" sm="6">
                  <ul style="list-style-type: none;">
                    <li>
                      <strong>Chi nhánh 1:</strong>
                       Lầu 1, 43 Nguyễn Thái Học, phường Cầu Ông Lãnh, quận 1, TP. Hồ Chí Minh.
                    </li>
                    <li>
                      <strong>Chi nhánh 2:</strong>
                       42B Trần Huy Liệu, phường 11, quận Phú Nhuận, TP. Hồ Chí Minh.
                    </li>
                    <li>
                      <strong>Điện thoại:</strong>
                       0865 660 775 - 0327 400 880
                    </li>
                    <li>
                      <strong>Email:</strong>
                       hello@morningfruit.com.vn
                    </li>
                  </ul>
                </v-col>
              </v-row>
              <div>
                <strong>Bản quyền của Công ty TNHH Morning Fruit</strong>
                <p>Giấy chứng nhận Đăng ký Kinh doanh số 0316077880 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp ngày 02/01/2020. Đăng ký thay đổi lần 4 ngày 22/04/2022</p>
                <p>Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm số 3091/2022/BQLATTP-HCM do Ban Quản lý An toàn thực phẩm thành phố Hồ Chí Minh cấp ngày 17/06/2022</p>
              </div>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3" class="">
            <strong style="font-size: 18px;">Hỗ trợ khách hàng</strong>
            <ul class="px-4">
              <li  v-for="(item, index) in supporticon" :key="index">
                {{ item }}
              </li>
            </ul>
          </v-col>

          <v-col cols="12" sm="3">
            <strong style="font-size: 18px;" >Chăm sóc khách hàng</strong>
            <div>
              <div style="display: flex; align-items: center; gap:10px">
                <v-icon size="30">mdi-phone-in-talk-outline</v-icon>
                <div class="d-flex flex-column">
                    <span style="font-size: 24px;">0865660775</span>
                    <u style="font-size: 16px;">hello@morningfruit.com.vn</u>
                </div>
              </div>
            </div>
            <div class="mt-6">
              <strong  style="font-size: 18px;" >Theo dõi tại</strong>
              <div class="d-flex ga-3 mt-3">
                <button class="custom-button" v-for="(item, index) in iconbutton" :key="index">
                  <v-icon >{{item}}</v-icon>
                </button>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-divider width="100%"></v-divider>
      <div style="justify-content: center; font-size: 14px;">
        Copyright © 2025 <a href="#" style="opacity: 0.6; cursor: pointer; text-decoration: none; color:inherit;">Morning Fruit - Trái Cây Chất Lượng Cao</a>
      </div>

    </v-footer>
  </div>
</template>

<script setup>

const supporticon = [
  "Tìm kiếm",
  "Câu chuyện thương hiệu",
  "Chính sách thành viên",
  "Chính sách kiểm hàng",
  "Chính sách bảo hành",
  "Chính sách giao hàng",
  "Chính sách thanh toán",
  "Chính sách bảo mật",
  "Hướng dẫn mua hàng Online",
  "Kiến thức trái cây",
  "Liên hệ",
]
const iconbutton = [
  "mdi-facebook",
  "mdi-twitter",
  "mdi-instagram",
]
</script>

<style scoped>
  .footer-custom {
    font-size: 14.5px;
  }
  .custom-button {
    border: 2px solid black;
    border-radius: 5px;
    padding: 2px;
    min-width: 32px;
    min-height: 32px;
    font-family: 'Quicksand', sans-serif;
  }

</style>