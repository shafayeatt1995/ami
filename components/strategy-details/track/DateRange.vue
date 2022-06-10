<template>
  <footy-radio
    :options="date_ranges"
    v-model="selected_date_range"
    radioClass="w-100"
    containerClass="gap-10"
  >
  </footy-radio>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  props: {
    value: {
      type: Number,
      default: 7,
    },
  },

  computed: {
    ...mapGetters(['is_pro_user']),
    date_ranges() {
      return [
        {
          value: 7,
          text: '7 Days',
        },
        {
          value: 30,
          text: '30 Days',
          upgradeToPro: !this.is_pro_user,
          disabled: !this.is_pro_user,
        },
        {
          value: 90,
          text: '3 Months',
          upgradeToPro: !this.is_pro_user,
          disabled: !this.is_pro_user,
        },
        {
          value: 180,
          text: '6 Months',
          upgradeToPro: !this.is_pro_user,
          disabled: !this.is_pro_user,
        },
      ];
    },
    hit_details() {
      if (this.track) {
        return this.track[this.selected_date_range];
      } else {
        return null;
      }
    },
    selected_date_range: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style></style>
