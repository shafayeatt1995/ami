<template>
  <div>
    <h3 class="fw-500 text-dark">Orders</h3>
    <div class="d-flex align-items-center justify-content-between mt-4 mb-2">
      <p class="fw-500 text-grey">Showing {{ orderData.length }} results</p>
      <b-dropdown id="strategies" text="Sort" class="m-md-2 footy-dropdown">
        <b-dropdown-item @click="sortName = 'recent'">
          Recent Order
        </b-dropdown-item>
        <b-dropdown-item @click="sortName = 'old'">Old Order</b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="dashboard-data-table order-data-table fw-500">
      <div
        class="dashboard-data-table-title border py-3 text-grey text-uppercase fs-16"
      >
        <p class="pl-3">Order No</p>
        <p>Date</p>
        <p>Country</p>
        <p>Strategy</p>
        <p>Price</p>
        <p>Net Price</p>
      </div>
      <div v-if="orderData.length > 0">
        <div
          class="dashboard-table-single-data border py-2 py-lg-4 px-2 px-lg-0 rounded-0 text-dark rounded"
          v-for="(order, key) in orderData"
          :key="`order-${key}`"
        >
          <div class="pl-0 pl-lg-3">
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Order No</h5>
            <p class="fs-m-14">#{{ order.id }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Date</h5>
            <p class="fs-m-14">{{ order.date }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Country</h5>
            <div class="d-flex align-items-center">
              <img
                :src="order.flag"
                :alt="order.country"
                class="order-data-table-flag mr-2"
              />
              <p class="fs-m-14">{{ order.country }}</p>
            </div>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Strategy</h5>
            <p class="fs-m-14">{{ order.strategy }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Price</h5>
            <p class="fs-m-14">£{{ order.price }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">
              Net Price
            </h5>
            <p class="fs-m-14">£{{ order.netPrice }}</p>
          </div>
        </div>
      </div>
      <div class="dashboard-data-table-empty text-center px-3" v-else>
        <div class="my-5 py-5">
          <img
            src="/images/table/empty-order.png"
            alt="empty"
            class="img-fluid"
          />
          <p class="mt-4 text-grey">
            You have no orders yet!
            <span class="d-block">Maybe it’s time to start selling? 🤑</span>
          </p>
          <b-button
            type="button"
            variant="primary"
            class="footy-button mt-3"
            @click="$nuxt.$emit('triggerSellStrategyModal')"
          >
            <IconCurrency class="mr-1" />Sell Strategy
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconCurrency from '~/static/images/strategy/currency.svg';

export default {
  name: 'seller-order-tab',
  components: {IconCurrency},
  data() {
    return {
      sortName: 'recent',
      orderData: [
        {
          id: '68095',
          date: '2022-03-15',
          country: 'US',
          flag: '../images/flag/us.svg',
          strategy: 'Over 2.5 Goals Strategy bet at first half',
          price: '4.99',
          netPrice: '3.19',
        },
        {
          id: '68095',
          date: '2022-03-15',
          country: 'FR',
          flag: '../images/flag/fr.svg',
          strategy: 'Over 2.5 Goals Strategy bet at first half',
          price: '4.99',
          netPrice: '3.19',
        },
        {
          id: '68095',
          date: '2022-03-15',
          country: 'CA',
          flag: '../images/flag/ca.svg',
          strategy: 'Over 2.5 Goals Strategy bet at first half',
          price: '4.99',
          netPrice: '3.19',
        },
        {
          id: '68095',
          date: '2022-03-15',
          country: 'UK',
          flag: '../images/flag/gb.svg',
          strategy: 'Over 2.5 Goals Strategy bet at first half',
          price: '4.99',
          netPrice: '3.19',
        },
      ],
    };
  },
};
</script>
