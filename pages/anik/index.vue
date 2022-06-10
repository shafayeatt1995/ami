<template>
  <GeneralPage page_title="Seller Dashboard" class extraHeaderClass="flex-row">
    <template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <SellerDashboard />
  </GeneralPage>
</template>

<script>
import GeneralPage from '~/components/GeneralPage.vue';
import HowItWorks from '~/components/HowItWorks.vue';
import SellerDashboard from '~/components/anik/Dashboard.vue';
export default {
  name: 'seller-dashboard',
  components: {
    GeneralPage,
    HowItWorks,
    SellerDashboard,
  },
  head() {
    return {
      title: `Seller Dashboard - FootyAmigo`,
    };
  },
};
</script>
