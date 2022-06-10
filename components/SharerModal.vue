<template>
  <b-modal
    id="share-modal"
    title="Share"
    body-bg-variant="light"
    hide-footer
    hide-header
    v-model="is_sharer_shown"
    centered
    content-class="border-0 rounded-20"
    body-class="rounded-20"
    modal-class="share-modal"
    ><b-overlay :show="loading">
      <div style="min-height: 400px">
        <Sharer
          :id="id"
          v-if="is_sharer_shown"
          v-model="is_sharer_shown"
          :loading.sync="loading"
          :is_view_mode="is_view_mode"
        />
      </div>
    </b-overlay>
  </b-modal>
</template>

<script>
import Sharer from '~/components/Sharer';
export default {
  props: {
    value: Boolean,
    id: [String, Number],
    is_view_mode: Boolean,
  },
  components: {
    Sharer,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    is_sharer_shown: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style lang="scss">
#share-modal___BV_modal_backdrop_ {
  opacity: 0.9;
}
</style>
