<template>
  <div class="p-3">
    <p class="text-Dark border p-3 rounded-10">
      If you’ve exceeded your minimum payout threshold (based on your Payout
      Settings) and your current balance has been converted into a payout, its
      payout reference and amount will be displayed in the table below. We are
      currently processing your payout, and once sent, will appear in the
      Payouts Sent section. For more information on when and how you’re paid,
      please see our
      <nuxt-link class="text-primary" :to="{name: 'anik-faq'}">FAQs.</nuxt-link>
    </p>
    <div class="d-flex align-items-center justify-content-between mt-4 mb-2">
      <p class="fw-500 text-grey">Showing {{ statementData.length }} results</p>
      <b-dropdown id="progress" text="Sort" class="m-md-2 footy-dropdown">
        <b-dropdown-item @click="sortName = 'new'">
          New Statement
        </b-dropdown-item>
        <b-dropdown-item @click="sortName = 'old'">
          Old Statement
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="dashboard-data-table payout-progress-data-table fw-500">
      <div
        class="dashboard-data-table-title border py-3 text-grey text-uppercase fs-16"
      >
        <p class="pl-3">Date</p>
        <p>Download</p>
      </div>
      <div v-if="statementData.length > 0">
        <div
          class="dashboard-table-single-data border py-3 px-2 px-lg-0"
          v-for="(statement, key) in statementData"
          :key="`payout-statement-${key}`"
        >
          <div class="pl-0 pl-lg-3">
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Date</h5>
            <p class="text-grey mt-2 mt-lg-0 fs-m-14">{{ statement.date }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Download</h5>
            <b-button
              variant="secondary"
              type="button"
              class="inline-center text-primary rounded-lg fw-500"
            >
              <IconDownload class="mr-1" />Download
            </b-button>
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
import IconDownload from '~/static/images/icon/download.svg';
import IconCurrency from '~/static/images/strategy/currency.svg';
export default {
  name: 'payout-statement',
  components: {
    IconDownload,
    IconCurrency,
  },

  data() {
    return {
      sortName: 'new',
      statementData: [
        {date: '2022-03-01'},
        {date: '2022-03-02'},
        {date: '2022-03-03'},
        {date: '2022-03-04'},
        {date: '2022-03-05'},
      ],
    };
  },
};
</script>
