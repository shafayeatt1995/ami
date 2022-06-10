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

    <FaqPage />
    <ProAccountModal />
  </GeneralPage>
</template>

<script>
import GeneralPage from '~/components/GeneralPage.vue';
import HowItWorks from '~/components/HowItWorks.vue';
import FaqPage from '~/components/anik/Faq.vue';
import ProAccountModal from '~/components/anik/ProAccountModal.vue';
export default {
  name: 'faq',
  components: {
    GeneralPage,
    HowItWorks,
    FaqPage,
    ProAccountModal,
  },
  head() {
    return {
      title: `Seller Dashboard - FootyAmigo`,
    };
  },
};
</script>
