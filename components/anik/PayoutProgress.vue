<template>
  <div class="p-3">
    <p class="text-dark border p-3 rounded-10">
      If you’ve exceeded your minimum payout threshold (based on your Payout
      Settings) and your current balance has been converted into a payout, its
      payout reference and amount will be displayed in the table below. We are
      currently processing your payout, and once sent, will appear in the
      Payouts Sent section. For more information on when and how you’re paid,
      please see our
      <nuxt-link class="text-primary" :to="{name: 'dashboard'}">
        FAQs.
      </nuxt-link>
    </p>
    <div class="d-flex align-items-center justify-content-between mt-4 mb-2">
      <p class="fw-500 text-grey">
        Showing {{ payoutProgressData.length }} results
      </p>
      <b-dropdown id="progress" text="Sort" class="m-md-2 footy-dropdown">
        <b-dropdown-item @click="sortName = 'recent'">
          Recent Transactions
        </b-dropdown-item>
        <b-dropdown-item @click="sortName = 'old'">
          Old Transactions
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="dashboard-data-table payout-progress-data-table fw-500">
      <div
        class="dashboard-data-table-title border py-3 text-grey text-uppercase fs-16"
      >
        <p class="pl-3">Reference</p>
        <p>Amount</p>
      </div>
      <div v-if="payoutProgressData.length > 0">
        <div
          class="dashboard-table-single-data border py-4 px-2 px-lg-0"
          v-for="(progress, key) in payoutProgressData"
          :key="`payout-progress-${key}`"
        >
          <div class="pl-0 pl-lg-3">
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">
              Reference
            </h5>
            <p class="fs-m-14 text-dark">#{{ progress.reference }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Amount</h5>
            <p class="fs-m-14 text-grey">£{{ progress.amount }}</p>
          </div>
        </div>
      </div>
      <div class="dashboard-data-table-empty text-center px-3" v-else>
        <div class="my-5 py-5">
          <img
            src="/images/table/empty-payout-sent.png"
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
import IconCurrency from '~/static/images/strategy/currency.svg';
export default {
  name: 'payout-progress',
  components: {
    IconCurrency,
  },

  data() {
    return {
      sortName: 'recent',
      payoutProgressData: [
        {
          reference: '68095',
          amount: '2900.66',
        },
        {
          reference: '68096',
          amount: '2500.00',
        },
        {
          reference: '68097',
          amount: '1200.50',
        },
        {
          reference: '68098',
          amount: '1800.10',
        },
        {
          reference: '68099',
          amount: '800.00',
        },
      ],
    };
  },
};
</script>
