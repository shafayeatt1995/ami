<template>
  <div>
    <div class="d-flex justify-content-between align-items-center py-4">
      <div class="strategy-menu d-flex justify-content-between w-100 fw-600">
        <ul>
          <li>
            <span
              class="cursor-pointer inline-center text-dark"
              :class="
                strategyActiveMenu === 'strategy' ? 'strategy-menu-active' : ''
              "
              @click="strategyActiveMenu = 'strategy'"
            >
              <IconStrategy class="mr-1" />Strategies
            </span>
          </li>
          <li>
            <span
              class="cursor-pointer inline-center text-dark"
              :class="
                strategyActiveMenu === 'payout' ? 'strategy-menu-active' : ''
              "
              @click="strategyActiveMenu = 'payout'"
            >
              <IconPayOut class="mr-1" />Payout-Settings
            </span>
          </li>
          <li>
            <span
              class="cursor-pointer inline-center text-dark"
              :class="
                strategyActiveMenu === 'order' ? 'strategy-menu-active' : ''
              "
              @click="strategyActiveMenu = 'order'"
            >
              <IconCart class="mr-1" />Orders
            </span>
          </li>
          <li>
            <span
              class="cursor-pointer inline-center text-dark"
              :class="
                strategyActiveMenu === 'profile' ? 'strategy-menu-active' : ''
              "
              @click="strategyActiveMenu = 'profile'"
            >
              <IconProfile class="mr-1" />Profile Settings
            </span>
          </li>
        </ul>
        <b-button
          variant="primary"
          type="button"
          class="btn btn-primary footy-button"
          @click="$nuxt.$emit('triggerSellStrategyModal')"
        >
          <IconCurrency class="mr-1" />Sell Strategy
        </b-button>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div
        class="footy-shadow border rounded-10 p-3 mb-5"
        v-if="strategyActiveMenu === 'strategy'"
        key="1"
      >
        <SellerStrategyTab />
      </div>

      <div
        class="footy-shadow border rounded-10 mb-5"
        v-else-if="strategyActiveMenu === 'payout'"
        key="2"
      >
        <SellerPayoutTab />
      </div>

      <div
        class="footy-shadow border rounded-10 p-3 mb-5"
        v-else-if="strategyActiveMenu === 'order'"
        key="3"
      >
        <SellerOrderTab />
      </div>

      <div
        class="footy-shadow border rounded-10 p-3 mb-5"
        v-else-if="strategyActiveMenu === 'profile'"
        key="4"
      >
        <SellerProfileTab />
      </div>
    </transition>
  </div>
</template>
<script>
import IconStrategy from '~/static/images/strategy/football.svg';
import IconPayOut from '~/static/images/strategy/dollar.svg';
import IconCart from '~/static/images/strategy/cart.svg';
import IconProfile from '~/static/images/strategy/user.svg';
import IconCurrency from '~/static/images/strategy/currency.svg';
import SellerStrategyTab from '~/components/anik/StrategyTab.vue';
import SellerPayoutTab from '~/components/anik/PayoutTab.vue';
import SellerOrderTab from '~/components/anik/OrderTab.vue';
import SellerProfileTab from '~/components/anik/ProfileTab.vue';

export default {
  name: 'seller-tab',
  components: {
    IconStrategy,
    IconPayOut,
    IconCart,
    IconProfile,
    IconCurrency,
    SellerStrategyTab,
    SellerPayoutTab,
    SellerOrderTab,
    SellerProfileTab,
  },

  data() {
    return {
      strategyActiveMenu: 'strategy',
    };
  },
};
</script>
