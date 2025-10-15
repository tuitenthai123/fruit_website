<template>
  <v-container class="py-10" style="max-width: 800px;">

    <!-- Success icon -->
    <div class="text-center mb-4">
      <v-icon color="success" size="64">mdi-check-circle-outline</v-icon>
    </div>

    <!-- Title -->
    <div class="text-center mb-8">
      <h2 class="text-h5 font-weight-medium mb-2">Thank you</h2>
      <p class="text-body-2 text-grey-darken-1">Your order has been received</p>
    </div>

    <!-- Order details -->
    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class="text-subtitle-1 font-weight-medium mb-4">Order details</h3>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Order number:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">86</v-col>

        <v-col cols="6" class="text-body-2">Date:</v-col>
        <v-col cols="6" class="text-right">May 6, 2017</v-col>

        <v-col cols="6" class="text-body-2">Payment method:</v-col>
        <v-col cols="6" class="text-right">Credit card</v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Subtotal:</v-col>
        <v-col cols="6" class="text-right">$69.00</v-col>

        <v-col cols="6" class="text-body-2">Taxes VAT(20%):</v-col>
        <v-col cols="6" class="text-right">$16.00</v-col>

        <v-col cols="6" class="font-weight-medium">Total:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">$87.00</v-col>
      </v-row>
    </v-card>

    <!-- Products -->
    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class="text-subtitle-1 font-weight-medium mb-4">Products</h3>

      <div
        v-for="(product, i) in products"
        :key="i"
        class="d-flex justify-space-between align-start mb-4"
      >
        <div>
          <p class="font-weight-medium mb-1">{{ product.name }}</p>
          <div v-for="(link, j) in product.links" :key="j">
            <a href="#" class="text-blue text-body-2">{{ link }}</a>
          </div>
        </div>
        <p class="font-weight-medium">${{ product.price }}</p>
      </div>
    </v-card>

    <!-- Customer details -->
    <v-card variant="outlined" class="pa-6">
      <h3 class="text-subtitle-1 font-weight-medium mb-4">Customer details</h3>

      <v-row>
        <!-- Contact -->
        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Contact</p>
          <p class="text-body-2">Email: dorin407@gmail.com</p>
          <p class="text-body-2">Phone: 0724260676</p>

          <p class="font-weight-medium mt-4 mb-1">Bank accounts and cards</p>
          <p class="text-body-2">
            Credit card
            <v-icon size="18" color="primary" class="mx-1">mdi-credit-card-outline</v-icon>
            Visa •••• 0987
          </p>
        </v-col>

        <!-- Billing -->
        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Billing address</p>
          <p class="text-body-2">Andrei Dorin</p>
          <p class="text-body-2">Dorin & Asociatii SRLD</p>
          <p class="text-body-2">Str Furtunel, 28, Bucharest sector 6</p>
          <p class="text-body-2">0623145</p>
          <p class="text-body-2">Romania</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
const products = [
  {
    name: "Maker Agency Theme",
    price: 39.0,
    links: ["Download link 1", "Download link 2"],
  },
  {
    name: "Corporate UI Kit",
    price: 12.0,
    links: ["Download link 1", "Download link 2"],
  },
  {
    name: "Dashboard admin panel",
    price: 36.0,
    links: ["Download link 1", "Download link 2"],
  },
];
</script>

<style scoped>
.text-blue {
  color: #1e88e5;
}
</style>
