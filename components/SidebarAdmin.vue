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
        <SidebarInnerAdmin> </SidebarInnerAdmin>
      </b-sidebar>
    </div>
    <div class="sidebar d-none d-lg-block">
      <SidebarInnerAdmin> </SidebarInnerAdmin>
    </div>
  </div>
</template>

<script>
import SidebarInnerAdmin from './SidebarInnerAdmin.vue';
export default {
  components: {SidebarInnerAdmin},
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
