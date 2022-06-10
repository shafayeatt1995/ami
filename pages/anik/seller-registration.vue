<template>
  <GeneralPage
    page_title="Become A Seller"
    page_description="Make money from your strategies 💰"
    extraHeaderClass="flex-row"
  >
    <template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <RegistrationForm />
  </GeneralPage>
</template>

<script>
import GeneralPage from '~/components/GeneralPage.vue';
import HowItWorks from '~/components/HowItWorks.vue';
import RegistrationForm from '~/components/anik/SellerRegistration.vue';
export default {
  name: 'seller-registration',
  components: {
    GeneralPage,
    HowItWorks,
    RegistrationForm,
  },
  head() {
    return {
      title: `Seller Registration - FootyAmigo`,
    };
  },
};
</script>
