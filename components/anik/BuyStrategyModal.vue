<template>
  <div class="buy-strategy-modal bg-light-grey">
    <div class="row">
      <div class="col-12 mb-4">
        <div class="d-flex justify-content-between">
          <h3 class="fw-600">Buy a Strategy</h3>
          <b-button
            variant="white"
            class="float-right rounded px-2"
            @click="$nuxt.$emit('triggerStrategyDetailsModal')"
          >
            <span class="material-icons"> close </span>
          </b-button>
        </div>
      </div>
      <div class="col-12">
        <div class="border border-primary p-3 rounded-10">
          <h4 class="fs-18 fw-600 mb-2">Checkout Summary</h4>
          <div class="row">
            <div class="col-6 col-lg-4 pr-2 pl-0 mb-3 mb-lg-0">
              <p class="text-grey fw-500 fs-m-13">Strategy name</p>
              <p class="fw-500 fs-14 fs-m-12">Over 2.5 goals home team...</p>
            </div>
            <div class="col-6 col-lg-4 pr-2 pl-0 mb-3 mb-lg-0">
              <p class="text-grey fw-500 fs-m-13">Strategy Performance</p>
              <p class="fw-500 d-flex text-grey fs-14 fs-m-12">
                <span class="material-icons text-primary mr-2">
                  trending_up
                </span>
                <span class="mr-1text-primary"> 90% </span>
                Hit Rate
              </p>
            </div>
            <div class="col-6 col-lg-4 pr-2 pl-0">
              <p class="text-grey fw-500 fs-m-13">Billing Amount</p>
              <p class="fw-500 text-primary fs-14 fs-m-12">£4.99</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 mt-4">
        <div
          class="buy-strategy-payment-button d-flex justify-content-between justify-content-lg-start"
        >
          <button
            type="button"
            class="mr-3"
            @click="paymentType = 'card'"
            :class="paymentType === 'card' ? 'active' : ''"
          >
            <img
              src="/images/icon/master-card.png"
              class="mr-1"
              alt="mastercard"
            />
            Pay by Card
          </button>
          <button
            type="button"
            @click="paymentType = 'paypal'"
            :class="paymentType === 'paypal' ? 'active' : ''"
          >
            <img src="/images/icon/paypal.png" alt="paypal" />
          </button>
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="paymentType === 'card'" key="card">
        <transition name="fade" mode="out-in">
          <div class="row mt-4" v-if="cardPaymentPart === '1'" key="1">
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label"> Full Name </label>
                <b-form-input
                  b-input
                  v-model="form.name"
                  label="Full Name"
                  id="full-name"
                  class="mb-2 footy-input"
                  placeholder="Full Name Here"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label"> Email </label>
                <b-form-input
                  b-input
                  v-model="form.email"
                  label="Email"
                  id="email"
                  class="mb-2 footy-input"
                  placeholder="Email Here"
                ></b-form-input>
              </b-form-group>
            </div>
            <footy-dropdown-select
              v-model="form.country"
              :options="countryOption"
              label="Country"
              id="country"
              class="col-lg-6 mb-4"
            />
            <footy-dropdown-select
              v-model="form.city"
              :options="cityOption"
              label="City"
              id="city"
              class="col-lg-6 mb-4"
            />
            <footy-dropdown-select
              v-model="form.state"
              :options="stateOption"
              label="State"
              id="state"
              class="col-lg-6 mb-4"
            />
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label"> Address Line 1 </label>
                <b-form-input
                  b-input
                  v-model="form.address_line_1"
                  label="Address Line 1"
                  id="address_line_1"
                  class="mb-2 footy-input"
                  placeholder="Address Here"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label">Address Line 2</label>
                <b-form-input
                  b-input
                  v-model="form.address_line_2"
                  label="Address Line 2"
                  id="address_line_2"
                  class="mb-2 footy-input"
                  placeholder="Address Here"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label">Zip Code</label>
                <b-form-input
                  b-input
                  v-model="form.zip_code"
                  label="Zip Code"
                  id="zip_code"
                  class="mb-2 footy-input"
                  placeholder="Zip code"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row mt-4" key="2" v-else>
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label"> Name on Card </label>
                <b-form-input
                  b-input
                  v-model="card_info.name"
                  label="Name on Card"
                  id="name-on-card"
                  class="mb-2 footy-input"
                  placeholder="Card Name Here"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-lg-6">
              <b-form-group class="card-number-input-image">
                <label class="footy-label"> Card Number </label>
                <b-form-input
                  b-input
                  v-model="card_info.number"
                  label="Card Number"
                  type="number"
                  id="name-on-card"
                  class="mb-2 footy-input"
                  placeholder="Card Name Here"
                ></b-form-input>
                <b-input-group-append>
                  <img
                    src="/images/icon/master-card.png"
                    class="img-fluid"
                    alt="mastercard"
                  />
                </b-input-group-append>
              </b-form-group>
            </div>
            <div
              class="col-lg-6 d-flex align-items-end gap-10 card-exp-date-select"
            >
              <footy-dropdown-select
                v-model="card_info.exp_month"
                :options="monthOption"
                label="Expiration Date"
                id="expiration-date"
                class="w-100 mb-4"
                placeholder="Select Month"
              />
              <footy-dropdown-select
                v-model="card_info.exp_year"
                :options="yearOption"
                label=""
                id="year"
                class="w-100 mb-4"
                placeholder="Select Year"
              />
            </div>
            <div class="col-lg-6">
              <b-form-group>
                <label class="footy-label"> CVC </label>
                <b-form-input
                  b-input
                  v-model="card_info.cvc"
                  label="cvc"
                  id="cvc"
                  class="mb-2 footy-input"
                  placeholder="CVC Number Here"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
        </transition>

        <div class="row">
          <div class="col-12">
            <div class="modal-submit-button-group text-right">
              <b-button
                variant="white"
                class="footy-button border"
                @click="cancel"
              >
                <transition name="fade" mode="out-in">
                  <span v-if="cardPaymentPart == '1'">Cancel & Back</span>
                  <span v-else>Go Back</span>
                </transition>
              </b-button>
              <b-button
                variant="primary"
                class="footy-button ml-2"
                @click="submit"
              >
                <transition name="fade" mode="out-in">
                  <span v-if="cardPaymentPart == '1'">Continue</span>
                  <span v-else>Make Payment Now</span>
                </transition>
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-5" key="paypal" v-else>
        <img src="/images/paypal.png" class="img-fluid" alt="paypal" />
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'buy-strategy-modal',
  data() {
    return {
      paymentType: 'card',
      cardPaymentPart: '1',
      form: {
        name: '',
        email: '',
        country: '',
        city: '',
        state: '',
        address_line_1: '',
        address_line_2: '',
        zip_code: '',
      },
      card_info: {
        name: '',
        number: '',
        exp_month: '',
        exp_year: '',
        cvc: '',
      },

      countryOption: [
        {
          value: '1',
          text: 'United State',
        },
        {
          value: '2',
          text: 'United Kingdom',
        },
        {
          value: '3',
          text: 'France',
        },
      ],

      stateOption: [
        {
          value: '1',
          text: 'Alabama',
        },
        {
          value: '2',
          text: '	Alaska',
        },
        {
          value: '3',
          text: 'California',
        },
      ],

      cityOption: [
        {
          value: '1',
          text: 'New York',
        },
        {
          value: '2',
          text: 'Chicago',
        },
        {
          value: '3',
          text: 'San Diego',
        },
      ],

      monthOption: [
        {
          value: '1',
          text: '01',
        },
        {
          value: '2',
          text: '02',
        },
        {
          value: '3',
          text: '03',
        },
        {
          value: '4',
          text: '04',
        },
        {
          value: '5',
          text: '05',
        },
        {
          value: '6',
          text: '06',
        },
        {
          value: '7',
          text: '07',
        },
        {
          value: '8',
          text: '08',
        },
        {
          value: '9',
          text: '09',
        },
        {
          value: '10',
          text: '10',
        },
        {
          value: '11',
          text: '11',
        },
        {
          value: '12',
          text: '12',
        },
      ],

      yearOption: [
        {
          value: '2022',
          text: '2022',
        },
        {
          value: '2023',
          text: '2023',
        },
        {
          value: '2024',
          text: '2024',
        },
        {
          value: '2025',
          text: '2025',
        },
        {
          value: '2026',
          text: '2026',
        },
      ],
    };
  },

  methods: {
    submit() {
      if (this.cardPaymentPart === '1') {
        this.cardPaymentPart = '2';
      } else {
        console.log('form submit');
      }
    },

    cancel() {
      if (this.cardPaymentPart === '1') {
        this.$emit('triggerBuyStrategyOption', false);
      } else {
        this.cardPaymentPart = '1';
      }
    },
  },
};
</script>
