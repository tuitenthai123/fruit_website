<script setup>
const amount = 100000;

async function checkout() {
  try {
    const { paymentUrl } = await $fetch('/api/create_payment_url', {
      method: 'POST',
      body: { amount }, // gửi JSON
    });
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      alert('Không nhận được paymentUrl');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi gọi API thanh toán');
  }
}
</script>

<template>
  <button @click="checkout">Thanh toán</button>
</template>
