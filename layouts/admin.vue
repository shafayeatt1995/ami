<template>
  <div id="nuxt">
    <b-navbar
      toggleable="lg"
      type="light"
      variant="light"
      class="p-0 d-lg-none"
      sticky
    >
      <b-button
        @click="is_sidebar_open = !is_sidebar_open"
        variant="transparent"
        class="p-2 m-0"
      >
        <span class="material-icons">
          {{ is_sidebar_open ? "close" : "menu" }}
        </span>
      </b-button>
      <b-navbar-brand href="#" class="mr-auto">
        <b-img-lazy src="/logo.png" class="footy-mobile-logo"></b-img-lazy
      ></b-navbar-brand>
    </b-navbar>
    <SidebarAdmin v-model="is_sidebar_open"> </SidebarAdmin>
    <section class="footy-page-content">
      <Nuxt />
    </section>
  </div>
</template>
<script>
import SidebarAdmin from "~/components/SidebarAdmin";

export default {
  data() {
    return {
      is_sidebar_open: false
    };
  },
  components: {
    SidebarAdmin
  },
  middleware: ["auth", "superman"],
  mounted() {},
  methods: {}
};
</script>
