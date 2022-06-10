<template>
  <ModalOnMobile v-model="modal" :is_a_modal="true">
    <div class="cancel-subscription-modal mt-2 mt-lg-0 py-4 px-lg-2">
      <transition name="fade" mode="out-in">
        <div class="row" v-if="stage === 1" key="1">
          <div class="col-12 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="fw-600 fs-m-22">Cancel Subscription</h3>
              <b-button
                variant="white"
                class="float-right rounded px-2"
                @click="modal = !modal"
              >
                <span class="material-icons"> close </span>
              </b-button>
            </div>
          </div>
          <div class="col-12 mb-4 pb-0 pb-lg-2">
            <div class="border border-primary rounded-sm p-3">
              <p>
                <span class="fw-500">Before you decide to go,</span> cancelling
                your subscription will
                <span class="text-danger fw-500">deactivate</span> your account
                which means you will lose access to your strategies, alerts,
                picks and all Pro feature.
              </p>
            </div>
          </div>
          <div class="col-lg-4 mb-4">
            <div
              class="border border-primary px-4 px-lg-5 py-2 py-lg-3 rounded-sm"
            >
              <h3 class="text-primary fw-600 fs-m-36">102</h3>
              <p class="fw-500 fs-18">Strategies</p>
            </div>
          </div>
          <div class="col-lg-4 mb-4">
            <div
              class="border border-primary px-4 px-lg-5 py-2 py-lg-3 rounded-sm"
            >
              <h3 class="text-primary fw-600 fs-m-36">23.6k</h3>
              <p class="fw-500 fs-18">Picks</p>
            </div>
          </div>
          <div class="col-lg-4 mb-4">
            <div
              class="border border-primary px-4 px-lg-5 py-2 py-lg-3 rounded-sm"
            >
              <h3 class="text-primary fw-600 fs-m-36">All</h3>
              <p class="fw-500 fs-18">Pro Features</p>
            </div>
          </div>
          <div class="col-lg-6 mt-2 mt-lg-0">
            <h5 class="mb-3 fw-500 fs-18">Ways we can help</h5>
            <p>
              We’re here to help and we want to see you win. We have invested
              heavily in lots of how-to videos that shows exactly how to get the
              best out of Footy Amigo. We are here for you, amigo.
            </p>
            <div
              class="cancel-subscription-link-list d-flex flex-column gap-15 mt-3"
            >
              <a
                class="btn btn-outline-primary rounded-sm text-left fw-500"
                href="https://calendly.com/footyamigo/amigo-help"
                target="_blank"
              >
                <IconEnvelope class="mr-1" /> RSVP for 1-on-1 call
              </a>
              <a
                class="btn btn-outline-primary rounded-sm text-left fw-500"
                href="https://footyamigo.com/how-it-works/"
                target="_blank"
              >
                <IconEye class="mr-1" /> Watch How-To Videos
              </a>
              <a
                class="btn btn-outline-primary rounded-sm text-left fw-500"
                href="https://footyamigo.com/contact/"
                target="_blank"
              >
                <IconSupport class="mr-1" /> Contact Support
              </a>
            </div>
            <p class="mt-4">
              Or talk to our amazing Support team about any problem you’re
              experiencing or how we can make your experience with Footy Amigo
              better.
            </p>
          </div>
          <div class="col-lg-6 mt-3 mt-lg-0">
            <h5 class="mb-2 fw-500 fs-18">Cancellation Reason</h5>
            <footy-dropdown-select
              v-model="form.issue"
              :options="cancelOption"
              label="Please indicate the reason for cancelling your account:"
              id="city"
              class="cancel-subscription-dropdown"
              :check_circle_mode="true"
            />
            <div>
              <label for="feedback" class="my-4"
                >Before you click Cancel Account, please let us know how we can
                make your experience with Footy Amigo better:
              </label>
              <div>
                <textarea
                  type="text"
                  class="footy-textarea w-100"
                  placeholder="Please type a response in here"
                  v-model="form.feedback"
                  id="feedback"
                  rows="3"
                  maxlength="300"
                />
                <p class="text-right text-grey fw-400 fs-14">
                  {{ form.feedback.length }}/300 characters
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 mb-4 mb-lg-0">
            <div class="modal-submit-button-group text-right">
              <b-button
                variant="white"
                class="footy-button border"
                @click="modal = !modal"
              >
                Don’t Cancel
              </b-button>
              <b-button
                variant="primary"
                class="footy-button ml-2"
                @click="submit"
                :disabled="!(form.issue && form.feedback)"
              >
                Cancel Account
              </b-button>
            </div>
          </div>
        </div>
        <div class="row" v-else-if="stage === 2" key="2">
          <div class="col-12 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="fw-600 fs-m-22 mr-5">
                <transition name="fade" mode="out-in">
                  <span v-if="subscriptionCancel">Subscription Cancelled!</span>
                  <span v-else>Do you Really Want to Cancel Your Account?</span>
                </transition>
              </h3>
              <b-button
                variant="white"
                class="float-right rounded px-2"
                @click="modal = !modal"
              >
                <span class="material-icons"> close </span>
              </b-button>
            </div>
          </div>
          <div class="col-12 mb-4 pb-3">
            <div class="border border-primary rounded-sm p-3">
              <p class="fw-500" v-if="subscriptionCancel">
                Subscription cancelled. Your Footy Amigo PRO subscription ends
                on 06/01/2022.
              </p>
              <p class="fw-500" v-else>
                Cancelling your paid account will result in
                <span class="text-danger">de-activation</span> of your
                strategies, picks, alerts and access to all Pro features. By
                cancelling your account, you acknowledge the following:
              </p>
            </div>

            <div
              class="subscription-cancel-message d-flex flex-column mt-4 pt-2 gap-15"
              v-if="!subscriptionCancel"
            >
              <b-form-checkbox
                id="message1"
                v-model="accept.message1"
                class="fw-400"
              >
                I understand that my account will be cancelled and I will lose
                access to all my strategies, picks and assets I’ve created in my
                account.
              </b-form-checkbox>
              <b-form-checkbox
                id="message2"
                v-model="accept.message2"
                class="fw-400"
              >
                I understand that my account will be cancelled as of
                <span class="fw-500">06/01/2022.</span>
                As of that date my plan will not be renewed. Any standing
                payments for previous months will still be collected.
              </b-form-checkbox>
              <b-form-checkbox
                id="message3"
                v-model="accept.message3"
                class="fw-400"
              >
                I understand that as Footy Amigo releases new tools and
                features, the price is likely to increase in the future, and I
                may not be able to rejoin in my current locked-in price.
              </b-form-checkbox>
            </div>
          </div>
          <div class="col-12 mb-4 mb-lg-0" v-if="!subscriptionCancel">
            <div class="modal-submit-button-group text-right">
              <b-button
                variant="white"
                class="footy-button border"
                @click="modal = !modal"
              >
                Don’t Cancel
              </b-button>
              <b-button
                variant="primary"
                class="footy-button ml-2"
                @click="submit"
                :disabled="
                  !(accept.message1 && accept.message2 && accept.message3)
                "
              >
                Cancel Account
              </b-button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </ModalOnMobile>
</template>

<script>
import ModalOnMobile from '~/components/common/ModalOnMobile.vue';
import IconEnvelope from '~/static/images/icon/envelope.svg';
import IconEye from '~/static/images/icon/eye-outline.svg';
import IconSupport from '~/static/images/icon/support.svg';

export default {
  name: 'cancel-s-modal',
  components: {
    ModalOnMobile,
    IconEnvelope,
    IconEye,
    IconSupport,
  },
  data() {
    return {
      modal: true,
      stage: 1,
      subscriptionCancel: false,
      form: {
        issue: '',
        feedback: '',
      },
      accept: {
        message1: false,
        message2: false,
        message3: false,
      },
      cancelOption: [
        {
          value: '1',
          text: 'Temporary Cancellation',
        },
        {
          value: '2',
          text: 'Missing Functionality',
        },
        {
          value: '3',
          text: `Can't Create a Winning Strategy`,
        },
        {
          value: '4',
          text: 'Using Other Product',
        },
        {
          value: '5',
          text: 'Not What I was Expecting',
        },
        {
          value: '5',
          text: `Can't Understand the Platform`,
        },
      ],
    };
  },

  methods: {
    openModal() {
      this.modal = true;
    },

    submit() {
      if (this.stage === 1) {
        this.stage = 2;
      } else if (this.stage === 2) {
        this.subscriptionCancel = true;
        console.log('form submitted');
      }
    },
  },

  created() {
    this.$nuxt.$on('triggerCancelSubscriptionModal', () => {
      this.openModal();
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('triggerCancelSubscriptionModal');
  },
};
</script>
