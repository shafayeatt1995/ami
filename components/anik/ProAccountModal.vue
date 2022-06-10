<template>
  <ModalOnMobile v-model="modal" :is_a_modal="true">
    <div class="footy-page-container pro-account-modal row">
      <div class="col-12 mb-4">
        <div class="d-flex justify-content-between">
          <div class="pro-account-modal-header d-flex align-items-center">
            <img src="/images/logo.png" class="img-fluid" alt="logo" />
            <h3 class="fw-500 ml-3 fs-m-18">Pro Account Needed</h3>
          </div>
          <b-button
            variant="white"
            class="float-right rounded px-2"
            @click="modal = !modal"
          >
            <span class="material-icons"> close </span>
          </b-button>
        </div>
      </div>
      <div class="col-12">
        <p class="border border-primary text-grey rounded-sm p-3">
          In order to start selling your strategies and making money as a
          seller, you need a PRO Footy Amigo account.
        </p>
      </div>
      <div class="col-12">
        <h4 class="mt-4 mb-3 fw-600">Here's Why:</h4>
        <ul class="px-3">
          <li class="mb-3">
            You cannot confidently sell a strategy without having an account on
            Footy Amigo for more than a week.
          </li>
          <li class="mb-3">
            When you list your strategies for sale on Footy Amigo, You will most
            likely make money from selling your strategies. This privilege of
            making money from other amigos who copy your strategy is reserved
            only to Pro users.
          </li>
          <li class="mb-3">
            We want to keep the “Amigo Copier” marketplace clean and with high
            quality people. If we open it to just anyone, it will become filled
            with spam.
          </li>
        </ul>
      </div>
      <div class="col-12">
        <div
          class="d-flex border border-primary bg-secondary py-3 px-3 px-lg-5 text-center align-items-start mt-3 mt-lg-4 gap-10 rounded-sm"
        >
          <i>
            “The fact that I am able to make some side money from strategies I
            personally use is exciting. It’s so fun! I like the fact that I know
            other people are making money from strategies.”
          </i>
        </div>
      </div>
      <div class="col-12 text-center mt-4">
        <b-button variant="primary" type="button" class="footy-button w-m-100">
          Upgrade to Pro
        </b-button>
      </div>
    </div>
  </ModalOnMobile>
</template>
<script>
import ModalOnMobile from '~/components/common/ModalOnMobile.vue';

export default {
  name: 'pro-account-needed-modal',
  components: {
    ModalOnMobile,
  },
  data() {
    return {
      modal: false,
    };
  },

  methods: {
    openModal() {
      this.modal = true;
    },
  },

  created() {
    this.$nuxt.$on('triggerProAccountModal', () => {
      this.openModal();
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('triggerProAccountModal');
  },
};
</script>
