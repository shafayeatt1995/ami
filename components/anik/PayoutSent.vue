<template>
  <div class="p-3">
    <p class="text-dark border p-3 rounded-10">
      The payments below has been sent based on your payout settings. It can
      take up to 1-5 working days to receive your payment based on the payment
      method. If your payment has not arrived yet, please first check with your
      bank. or please contact us.
    </p>

    <div class="d-flex align-items-center justify-content-between mt-4 mb-2">
      <p class="fw-500 text-grey">
        Showing {{ payoutSentData.length }} results
      </p>
      <b-dropdown id="sent" text="Sort" class="m-md-2 footy-dropdown">
        <b-dropdown-item @click="sortName = 'recent'">
          Recent Transactions
        </b-dropdown-item>
        <b-dropdown-item @click="sortName = 'old'">
          Old Transactions
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="dashboard-data-table payout-sent-data-table fw-500">
      <div
        class="dashboard-data-table-title border py-3 text-uppercase fs-16 text-grey"
      >
        <p class="pl-3">Reference</p>
        <p>Date</p>
        <p>Amount</p>
        <p>Notes</p>
        <p>Invoices (PDF)</p>
      </div>
      <div v-if="payoutSentData.length > 0">
        <div
          class="dashboard-table-single-data border py-3 px-2 px-lg-0"
          v-for="(sent, key) in payoutSentData"
          :key="`payout-sent-${key}`"
        >
          <div class="pl-0 pl-lg-3">
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">
              Reference
            </h5>
            <p class="mb-2 mb-lg-0 fs-m-14 text-dark">#{{ sent.reference }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Date</h5>
            <p class="mb-2 mb-lg-0 fs-m-14 text-grey">{{ sent.date }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Amount</h5>
            <p class="mb-2 mb-lg-0 fs-m-14 text-grey">£{{ sent.amount }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">Note</h5>
            <p class="mb-2 mb-lg-0 fs-m-14 text-grey">{{ sent.note || '-' }}</p>
          </div>
          <div>
            <h5 class="d-lg-none text-grey text-uppercase fs-m-14">
              Invoices (PDF)
            </h5>
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
import IconCurrency from '~/static/images/strategy/currency.svg';
import IconDownload from '~/static/images/icon/download.svg';
export default {
  name: 'payout-sent',
  components: {
    IconCurrency,
    IconDownload,
  },

  data() {
    return {
      sortName: 'recent',
      payoutSentData: [
        {
          reference: '68097',
          date: '2022-03-15',
          amount: '2900.66',
          notes: '',
        },
        {
          reference: '68098',
          date: '2022-03-15',
          amount: '1200.00',
          notes: '',
        },
        {
          reference: '68099',
          date: '2022-03-15',
          amount: '2000.00',
          notes: '',
        },
        {
          reference: '68100',
          date: '2022-03-15',
          amount: '1800.00',
          notes: '',
        },
      ],
    };
  },
};
</script>
