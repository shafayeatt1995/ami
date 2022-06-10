<template>
  <div>
    <h3 class="fw-500 text-dark p-3">Payout Settings</h3>
    <div class="dashboard-payout">
      <div class="dashboard-payout-tab-title p-3">
        <b-button
          :variant="payoutActiveMenu === 'sent' ? 'secondary' : 'none'"
          type="button"
          class="rounded-sm fw-500"
          @click="payoutActiveMenu = 'sent'"
        >
          Payouts Sent
        </b-button>

        <b-button
          :variant="payoutActiveMenu === 'progress' ? 'secondary' : 'none'"
          type="button"
          class="rounded-sm fw-500"
          @click="payoutActiveMenu = 'progress'"
        >
          Payouts in-Progress
        </b-button>

        <b-button
          :variant="payoutActiveMenu === 'setting' ? 'secondary' : 'none'"
          type="button"
          class="rounded-sm fw-500"
          @click="payoutActiveMenu = 'setting'"
        >
          Payout Settings
        </b-button>

        <b-button
          :variant="payoutActiveMenu === 'statement' ? 'secondary' : 'none'"
          type="button"
          class="rounded-sm fw-500"
          @click="payoutActiveMenu = 'statement'"
        >
          Monthly Statements
        </b-button>
      </div>
      <div class="dashboard-payout-tab-body">
        <transition name="fade" mode="out-in">
          <div
            class="dashboard-payout-tab-sent"
            v-if="payoutActiveMenu === 'sent'"
            :key="payoutActiveMenu"
          >
            <SellerPayoutSent />
          </div>
          <div
            class="dashboard-payout-tab-progress"
            v-else-if="payoutActiveMenu === 'progress'"
            :key="payoutActiveMenu"
          >
            <SellerPayoutProgress />
          </div>
          <div
            class="dashboard-payout-tab-setting"
            v-else-if="payoutActiveMenu === 'setting'"
            :key="payoutActiveMenu"
          >
            <SellerPayoutSetting />
          </div>
          <div
            class="dashboard-payout-tab-statement"
            v-else-if="payoutActiveMenu === 'statement'"
            :key="payoutActiveMenu"
          >
            <SellerPayoutStatement />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import SellerPayoutSent from '~/components/anik/PayoutSent.vue';
import SellerPayoutProgress from '~/components/anik/PayoutProgress.vue';
import SellerPayoutSetting from '~/components/anik/PayoutSetting.vue';
import SellerPayoutStatement from '~/components/anik/PayoutStatement.vue';
export default {
  name: 'seller-payout-tab',
  components: {
    SellerPayoutSent,
    SellerPayoutProgress,
    SellerPayoutSetting,
    SellerPayoutStatement,
  },
  data() {
    return {
      sortName: 'recent',
      payoutActiveMenu: 'sent',
    };
  },
  methods: {
    deleteStrategy(key) {
      this.strategies.splice(key, 1);
    },
  },
};
</script>
