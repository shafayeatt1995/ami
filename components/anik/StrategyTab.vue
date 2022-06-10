<template>
  <div>
    <h3 class="fw-500 text-dark">Strategies</h3>
    <div class="d-flex align-items-center justify-content-between mt-4 mb-2">
      <p class="fw-500 text-grey">Showing {{ strategies.length }} results</p>
      <b-dropdown id="strategies" text="Sort" class="m-md-2 footy-dropdown">
        <b-dropdown-item @click="sortName = 'name'">Name</b-dropdown-item>
        <b-dropdown-item @click="sortName = 'price'">Price</b-dropdown-item>
        <b-dropdown-item @click="sortName = 'subscribe'">
          Subscribe
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="dashboard-data-table strategy-data-table fw-500 mt-4">
      <div
        class="dashboard-data-table-title border py-3 text-grey text-uppercase fs-16"
      >
        <p class="pl-3">Strategy Name</p>
        <p>Hit/Strike</p>
        <p>Price</p>
        <p>Subscribe</p>
        <p>Condition</p>
        <p>Status</p>
        <p>Actions</p>
      </div>
      <div v-if="strategies.length > 0">
        <div
          class="dashboard-table-single-data mb-4 mb-lg-0 border p-3 px-2 px-lg-0 rounded-0 text-dark"
          v-for="(strategy, key) in strategies"
          :key="`strategy-${key}`"
        >
          <div class="pl-0 pl-lg-3">
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Strategy Name
            </h5>
            <div class="d-flex align-items-center">
              <img :src="strategy.image" alt="image" class="img-fluid" />
              <p class="pl-2 fs-m-14 fw-500">{{ strategy.name }}</p>
            </div>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Hit/Strike
            </h5>
            <p class="text-primary fs-m-14 fw-500">{{ strategy.strike }}%</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Price
            </h5>
            <p class="fs-m-14 fw-500">£{{ strategy.price }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Subscribe
            </h5>
            <p class="fs-m-14 fw-500">{{ strategy.subscribe }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Condition
            </h5>
            <p
              class="text-primary inline-center fs-m-14 fw-500"
              v-if="strategy.status"
            >
              <IconEye class="mr-1" />
              <span>Visible</span>
            </p>
            <p class="text-danger inline-center fs-m-14" v-else>
              <IconEyeSlash class="mr-1" />
              <span>Hidden</span>
            </p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14 fw-500">
              Status
            </h5>
            <CommonFootySwitch
              :value="strategy.status"
              v-model="strategy.status"
              noCaret="true"
              class="mt-1"
            />
          </div>
          <div class="full-width-multiactions-btn pr-0 pr-lg-3 w-100">
            <b-dropdown
              size="sm"
              text="View"
              no-caret
              class="multiactions-btn my-0"
            >
              <template slot="button-content">
                <div class="view-text pr-4">View</div>
                <span class="btn-icon">
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66602 1L5.66602 5L1.66602 1"
                      stroke="#222622"
                      stroke-opacity="0.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </template>
              <b-dropdown-item @click="$nuxt.$emit('triggerEditStrategyModal')">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                @click="deleteStrategy(key)"
                variant="danger"
                active-class="bg-dangerous"
                link-class="bg-dangerous"
                class="bg-white"
              >
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="dashboard-data-table-empty text-center px-3" v-else>
        <div class="my-5 py-5">
          <img
            src="/images/table/empty-strategy.png"
            alt="empty"
            class="img-fluid"
          />
          <p class="mt-4 text-grey">
            You have no strategy for sale! What are you waiting for?
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
import IconEye from '~/static/images/icon/eye.svg';
import IconEyeSlash from '~/static/images/icon/eye-slash.svg';
import IconCurrency from '~/static/images/strategy/currency.svg';

export default {
  name: 'seller-strategy-tab',
  components: {
    IconEye,
    IconEyeSlash,
    IconCurrency,
  },
  data() {
    return {
      sortName: 'name',
      strategies: [
        {
          image: '/images/table/football.jpg',
          name: 'Over 2.5 Goals Strategy bet at first half',
          strike: '95.40',
          price: '4.99',
          subscribe: '30',
          status: true,
        },
        {
          image: '/images/table/football.jpg',
          name: 'Over 2.5 Goals Strategy bet at first half',
          strike: '95.40',
          price: '5.99',
          subscribe: '39',
          status: false,
        },
        {
          image: '/images/table/football.jpg',
          name: 'Over 2.5 Goals Strategy bet at first half',
          strike: '95.40',
          price: '5.99',
          subscribe: '120',
          status: false,
        },
        {
          image: '/images/table/football.jpg',
          name: 'Over 2.5 Goals Strategy bet at first half',
          strike: '95.40',
          price: '5.99',
          subscribe: '271',
          status: false,
        },
        {
          image: '/images/table/football.jpg',
          name: 'Over 2.5 Goals Strategy bet at first half',
          strike: '95.40',
          price: '5.99',
          subscribe: '309',
          status: false,
        },
      ],
    };
  },
  methods: {
    deleteStrategy(key) {
      this.strategies.splice(key, 1);
    },
  },
};
</script>
