<template>
  <div>
    <h4 class="text-Dark fw-500 p-3 fs-20">How would you like to be paid?</h4>
    <div class="row mt-4 p-3">
      <footy-dropdown-select
        v-model="paymentForm.method"
        :options="paymentOption"
        label="Payment Method"
        id="payment-method"
        class="col-lg-6 mb-4 px-0 px-lg-2"
      />
      <footy-dropdown-select
        v-model="paymentForm.threshold"
        :options="thresholdOption"
        label="Minimum Threshold"
        id="minimum-threshold"
        class="col-lg-6 mb-4 px-0 px-lg-2"
      />
    </div>
    <hr />
    <h4 class="text-Dark fw-500 p-3 fs-20">Bank/Wire Transfer Details</h4>
    <div class="row p-3">
      <footy-dropdown-select
        v-model="paymentForm.country"
        :options="countryOption"
        label="Bank Country"
        id="bank-country"
        class="col-lg-6 mb-4 px-0 px-lg-2"
      />
      <footy-dropdown-select
        v-model="paymentForm.currency"
        :options="currencyOption"
        label="Transfer Currency"
        id="transfer-currency"
        class="col-lg-6 mb-4 px-0 px-lg-2"
      />
      <div class="col-lg-6 mb-2 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">Bank Name</label>
          <b-form-input
            b-input
            v-model="paymentForm.bankName"
            label="Bank Name"
            id="bank-name"
            class="mb-2 footy-input"
            placeholder="Bank name Here"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-lg-6 mb-2 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">Account Holder Name</label>
          <b-form-input
            b-input
            v-model="paymentForm.accountName"
            label="Account Holder Name"
            id="account-holder-name"
            class="mb-2 footy-input"
            placeholder="Account holder name here"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 mb-4 px-0 px-lg-2">
        <label for="bank-address" class="mb-2">Bank Address</label>
        <div>
          <textarea
            type="text"
            class="footy-textarea w-100"
            placeholder="Bank address here"
            v-model="paymentForm.address"
            id="bank-address"
            rows="3"
          />
        </div>
      </div>
      <div class="col-lg-6 mb-2 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">BIC/SWIFT</label>
          <b-form-input
            b-input
            v-model="paymentForm.swift"
            label="BIC/SWIFT"
            id="bic-swift"
            class="mb-2 footy-input"
            placeholder="BIC/SWIFT code here"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-lg-6 mb-2 px-0 px-lg-2">
        <b-form-group>
          <label class="footy-label">IBAN</label>
          <b-form-input
            b-input
            v-model="paymentForm.iban"
            label="IBAN"
            id="ibn"
            class="mb-2 footy-input"
            placeholder="IBAN code here"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 mb-4 px-0 px-lg-2">
        <label for="" class="mb-2">Notes / Comments</label>
        <div>
          <textarea
            type="text"
            class="footy-textarea w-100"
            placeholder="Note / Comments"
            v-model="paymentForm.note"
            rows="3"
          />
        </div>
      </div>
      <div
        class="col-lg-12 text-lg-right px-0 px-lg-2 payout-setting-submit-button-group"
      >
        <b-button variant="white" class="footy-button border">
          Cancel & Back
        </b-button>
        <b-button variant="primary" class="footy-button">
          Save Changes
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'payment-setting',
  data() {
    return {
      paymentOption: [
        {
          value: 1,
          text: 'Bank Transfer',
        },
        {
          value: 2,
          text: 'Card',
        },
        {
          value: 3,
          text: 'Pay Pal',
        },
      ],
      thresholdOption: [
        {
          value: 4.99,
          text: '£4.99',
        },
        {
          value: 9.99,
          text: '£9.99',
        },
        {
          value: 12.99,
          text: '£12.99',
        },
      ],
      countryOption: [
        {
          value: 'us',
          text: 'United State',
        },
        {
          value: 'pl',
          text: 'Poland',
        },
        {
          value: 'nz',
          text: 'New Zealand',
        },
      ],
      currencyOption: [
        {
          value: 'usd',
          text: 'USD',
        },
        {
          value: 'gbp',
          text: 'GBP',
        },
        {
          value: 'nzd',
          text: 'NZD',
        },
      ],

      paymentForm: {
        method: '',
        threshold: '',
        country: '',
        currency: '',
        bankName: '',
        accountName: '',
        address: '',
        swift: '',
        iban: '',
        note: '',
      },
    };
  },
};
</script>
