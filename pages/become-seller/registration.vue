<template>
  <GeneralPage
    page_title="Become A Seller"
    class=""
    extraHeaderClass="flex-row"
    page_description="Make money from your strategies 💰"
  >
    <template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <div class="pt-4 d-flex wrap-on-mobile gap-40">
      <div class="footy-page-container w-100 flex-9">
        <h3 class="mb-4">Seller Registration</h3>
        <div class="d-flex gap-25 mb-3 wrap-on-mobile">
          <div class="flex-1">
            <label for="" class="mb-2">Your Name</label>
            <div>
              <input
                type="text"
                class="footy-input w-100"
                placeholder="Full name"
                v-model="form.fullname"
              />
            </div>
          </div>

          <div class="flex-1">
            <label for="" class="mb-2">Username</label>
            <div>
              <input
                type="text"
                class="footy-input w-100"
                placeholder="@username"
                v-model="form.username"
              />
            </div>
          </div>
        </div>

        <div>
          <label for="" class="mb-2">Profile Description</label>
          <div>
            <textarea
              type="text"
              class="footy-textarea w-100"
              placeholder="A cool Profile!"
              v-model="form.description"
              :rows="5"
            />
          </div>
        </div>
        <div class="d-flex mt-4 wrap-on-mobile gap-20">
          <div>
            <b-button class="footy-button fw-16 w-100-mobile" variant="white">
              Change Profile Image
            </b-button>
          </div>
          <div class="ml-auto gap-10 d-flex w-100-mobile scroll-on-mobile">
            <b-button class="footy-button" variant="white" to="/become-seller">
              Cancel
            </b-button>
            <b-button
              class="footy-button"
              variant="primary"
              @click="createSeller"
            >
              Create a Seller Account
            </b-button>
          </div>
        </div>
        <div class="text-center mt-5">
          By creating a seller account, you agree to our
          <a
            href="https://footyamigo.com/terms-and-conditions/"
            target="__blank"
            >terms of service.</a
          >
        </div>
      </div>
      <div class="footy-page-container flex-3">
        <h3>Excited? here is how it works!</h3>
        <div
          class="d-flex align-items-center gap-20 mt-4"
          v-for="(step, index) in steps"
          :key="index"
        >
          <div>
            <span
              class="fs-20 fw-600 text-primary bg-success-light is-36x36 centered"
            >
              {{ index + 1 }}
            </span>
          </div>

          <div class="">
            <div class="fs-16 fw-600">{{ step.title }}</div>
            <div class="fs-14 fw-400 text-grey mt-2">
              {{ step.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </GeneralPage>
</template>
<script>
import AvatarDropdown from '~/components/AvatarDropdown.vue';

export default {
  head() {
    return {
      title: this.$titles.dashboard,
    };
  },
  middleware: 'tester',
  data() {
    return {
      form: {
        fullname: '',
        username: '',
        description: '',
      },
      steps: [
        {
          title: 'Create your seller account.',
          text: 'It takes just 30 seconds to get started.',
        },
        {
          title: 'Sell your already created strategies.',
          text: 'List any strategy from your account for sale.',
        },
        {
          title: 'Get paid while helping others.',
          text: 'Other amigos are waiting to pay for your profitable strategies.',
        },
      ],
    };
  },
  components: {
    AvatarDropdown,
  },
  methods: {
    async createSeller() {
      const res = await this.$axios.get('http://ip-api.com/json');
      const countryCode = res.data.countryCode;
      await this.$axios.post('/user/become-seller', {
        ...this.form,
        countryCode,
      });
      this.$router.push('/seller-dashboard');
    },
  },
};
</script>
<style lang="scss"></style>
