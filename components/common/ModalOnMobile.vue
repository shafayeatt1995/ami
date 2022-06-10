<template>
  <div>
    <b-modal
      body-bg-variant="light"
      hide-footer
      hide-header
      size="lg"
      v-model="showModal"
      centered
      content-class="border-0 rounded-20"
      body-class="rounded-20 p-0"
      modal-class="p-0 rounded-20"
      class="d-none d-lg-block"
      v-if="is_a_modal && is_lg_screen"
    >
      <slot> </slot>
    </b-modal>
    <div class="d-none d-lg-block" v-else-if="is_lg_screen">
      <slot> </slot>
    </div>

    <b-sidebar
      id="sidebar-backdrop"
      backdrop-variant="dark"
      backdrop
      shadow
      no-header
      no-slide
      class="footy-mobile-modal d-lg-none"
      width="100%"
      height="80%"
      right
      v-model="showModal"
      v-if="!is_lg_screen"
    >
      <slot> </slot>
    </b-sidebar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  props: {
    value: Boolean,
    is_a_modal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['is_lg_screen', 'window_width']),
    showModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss">
.rules-preview-container {
  overflow-y: scroll;
}

.footy-mobile-modal {
  .b-sidebar {
    top: auto;
    bottom: 0;
    border-radius: 20px 20px 0px 0px;
    height: 90%;
    overflow: hidden;
    .b-sidebar-body {
      overflow-y: auto;
    }
  }
}
</style>
