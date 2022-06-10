<template>
  <div>
    <div class="d-lg-none">
      <b-sidebar
        shadow
        v-model="is_sidebar_open"
        :backdrop="true"
        width="258px"
        no-header
        z-index="100"
        :class="is_sidebar_open ? '' : 'hidden'"
      >
        <SidebarInner> </SidebarInner>
      </b-sidebar>
    </div>
    <div class="sidebar d-none d-lg-block">
      <SidebarInner> </SidebarInner>
    </div>
  </div>
</template>

<script>
import SidebarInner from './SidebarInner.vue';
export default {
  components: {SidebarInner},
  props: {
    value: Boolean,
  },
  computed: {
    is_sidebar_open: {
      get() {
        return this.value;
      },
      set(value) {
        // console.log(value);
        this.$emit('input', value);
        // this.$emit("input", +value);
      },
    },
  },
  methods: {
    openSidebar() {
      this.is_sidebar_open = true;
    },
    closeSidebar(i) {
      this.is_sidebar_open = false;
      this.activeIndex = i;
    },
  },
};
</script>

<style lang="scss">
@import '~assets/scss/colors';

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 256px;
  background: #fff;
  box-shadow: 1px 0 0 rgb(0 0 0 / 10%);
  height: 100%;
}

@media only screen and (max-width: $lg) {
  .sidebar.hidden {
    display: none;
  }
}
</style>
