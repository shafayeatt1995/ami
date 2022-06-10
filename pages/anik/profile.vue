<template>
  <GeneralPage
    page_title="Amigo Profile"
    class
    extraHeaderClass="flex-row"
    :disable_how_it_works="true"
  >
    <b-button
      variant="secondary"
      class="align-self-start profile-back-button rounded-sm d-flex align-items-center fw-500 fs-14"
      type="button"
      slot="back-button"
    >
      <IconArrowLeft class="mr-2" />
      Back
    </b-button>

    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <UserProfile />
  </GeneralPage>
</template>

<script>
import GeneralPage from '~/components/GeneralPage.vue';
import UserProfile from '~/components/anik/UserProfile.vue';
import IconArrowLeft from '~/static/images/icon/arrow-left.svg';

export default {
  name: 'profile',
  components: {
    GeneralPage,
    UserProfile,
    IconArrowLeft,
  },
  head() {
    return {
      title: `Seller Dashboard - FootyAmigo`,
    };
  },
};
</script>
