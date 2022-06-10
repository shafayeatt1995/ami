<template>
  <GeneralPage
    page_title="Seller Dashboard"
    class=""
    extraHeaderClass="flex-row"
    ><template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <template v-slot:avatar>
      <AvatarDropdown class="avatar d-lg-none" />
    </template>
    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <div class="pt-4">
      <div class="d-flex wrap-on-mobile gap-40">
        <div
          class="d-flex justify-content-between w-100 w-lg-25 p-2 border border-1 rounded rounded-10"
        >
          <div class="d-flex flex-column">
            <div class="medium-icon text-primary fw-600">
              ${{ total_earnings }}
            </div>
            <div class="text-grey fw-600">TOTAL Earnings</div>
          </div>
          <CoinIcon class="m-2" />
        </div>
        <div
          class="d-flex justify-content-between w-100 w-lg-25 p-2 border border-1 rounded rounded-10"
        >
          <div class="d-flex flex-column">
            <div class="medium-icon text-primary fw-600">
              {{ total_sales }}
            </div>
            <div class="text-grey fw-600">TOTAL Sales</div>
          </div>
          <CoinIcon class="m-2" />
        </div>
        <div
          class="d-flex justify-content-between w-100 w-lg-25 p-2 border border-1 rounded rounded-10"
        >
          <div class="d-flex flex-column">
            <div class="medium-icon text-primary fw-600">
              {{ total_subscribers }}
            </div>
            <div class="text-grey fw-600">Subscribers</div>
          </div>
          <CoinIcon class="m-2" />
        </div>
      </div>
      <div class="border border-1 my-4 p-4 rounded rounded-10">
        <div class="d-flex justify-content-between">
          <p class="fs-20 fw-600">Sales Over Time</p>
          <footy-dropdown-select
            type="text"
            class="w-50 w-lg-25"
            :options="filter_options"
            :value="filter_by"
          />
        </div>
        <FootySellerChart />
      </div>
      <div class="d-flex justify-content-between">
        <div class="d-flex gap-40 fw-500">
          <FootyTabButton :active="true" @click="handleTab('strategies')">
            <template slot="icon"><BallIcon /></template>
            <template slot="active-icon"><BallActiveIcon /></template>
            Strategies
          </FootyTabButton>
          <FootyTabButton @click="handleTab('payout-settings')">
            <template slot="icon"><DollarIcon /></template>
            <template slot="active-icon"><DollarActiveIcon /></template>
            Payout Settings
          </FootyTabButton>
          <FootyTabButton @click="handleTab('orders')">
            <template slot="icon"><OrderIcon /></template>
            <template slot="active-icon"><OrderActiveIcon /></template>
            Orders
          </FootyTabButton>
          <FootyTabButton @click="handleTab('profile-settings')">
            <template slot="icon"><ProfileIcon /></template>
            <template slot="active-icon"><ProfileActiveIcon /></template>
            Profile Settings
          </FootyTabButton>
        </div>
        <b-button
          class="footy-button"
          variant="primary"
          @click="openSellStrategyModal"
        >
          <DollarCircleIcon class="mr-1" />
          Sell Strategy
        </b-button>
      </div>
      <keep-alive>
        <component
          :is="currentTab"
          @openSellStrategyModal="openSellStrategyModal"
          ref="strategies"
        ></component>
      </keep-alive>
    </div>
    <StrategySellModal
      v-model="is_open_sell_strategy_modal"
      @accepted="sellStrategy"
    />
  </GeneralPage>
</template>
<script>
import AvatarDropdown from '~/components/AvatarDropdown';
import FootySellerChart from '~/components/common/FootySellerChart.vue';
import StrategySellModal from '~/components/seller-dashboard/StrategySellModal.vue';

import Strategies from '~/components/seller-dashboard/Strategies.vue';

// icons
import BallActiveIcon from '~/static/icons/seller-dashboard/ball-active.svg';
import DollarActiveIcon from '~/static/icons/seller-dashboard/dollar-active.svg';
import OrderActiveIcon from '~/static/icons/seller-dashboard/order-active.svg';
import ProfileActiveIcon from '~/static/icons/seller-dashboard/profile-active.svg';
import BallIcon from '~/static/icons/seller-dashboard/ball.svg';
import DollarIcon from '~/static/icons/seller-dashboard/dollar.svg';
import OrderIcon from '~/static/icons/seller-dashboard/order.svg';
import ProfileIcon from '~/static/icons/seller-dashboard/profile.svg';
import DollarCircleIcon from '~/static/icons/seller-dashboard/dollar-circle.svg';

export default {
  data() {
    return {
      filter_options: [
        {text: 'Today', value: 'today'},
        {text: 'Yesterday', value: 'yesterday'},
        {text: 'Last 7 Days', value: 'last_7days'},
        {text: 'Month To Date', value: 'month_to_date'},
        {text: 'Year To Date', value: 'year_to_date'},
        {text: 'All Time', value: 'all_time'},
        {text: 'Custome', value: 'custom'},
      ],
      filter_by: 'year_to_date',
      total_earnings: 24020.0,
      total_sales: 650,
      total_subscribers: 2400,
      currentTab: 'strategies',

      is_open_sell_strategy_modal: false,
    };
  },
  mounted() {},
  computed: {
    avatar_link() {
      return `/svg/${this.$auth.user.avatar_id}.svg`;
    },
  },
  methods: {
    async sellStrategy(data) {
      const strategy = await this.$axios.$post(
        '/user/strategies/seller/',
        data
      );
      if (!strategy) console.log('Failed to sell');
      this.$refs.strategies.initialFetch();
    },
    openSellStrategyModal() {
      this.is_open_sell_strategy_modal = true;
    },
    handleTab(tabString) {
      this.currentTab = tabString;
    },
  },
  components: {
    AvatarDropdown,
    FootySellerChart,

    Strategies,

    BallActiveIcon,
    DollarActiveIcon,
    OrderActiveIcon,
    ProfileActiveIcon,
    BallIcon,
    DollarIcon,
    OrderIcon,
    ProfileIcon,
    DollarCircleIcon,
    StrategySellModal,
  },
};
</script>
<style lang="scss">
@media screen and (min-width: $lg) {
  .w-lg-25 {
    width: 25% !important;
  }
  .w-lg-50 {
    width: 50% !important;
  }
}
</style>
