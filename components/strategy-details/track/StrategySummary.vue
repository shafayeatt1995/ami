<template>
  <div class="summary-items-grid">
    <div
      class="summary-item"
      v-for="(item, index) in summary_items"
      :key="index"
      :class="['summary-item--' + item.variant]"
    >
      <h3 class="summary-item__value" :class="'text-' + item.variant">
        {{ item.value == '0.00' ? 'NA' : item.value }}
      </h3>
      <div
        class="summary-item__text"
        :class="'text-' + item.variant"
        v-html="item.text"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    outcome: {
      type: Object,
      default: () => {},
    },
    track: {
      type: Object,
      default: () => {},
    },
    selected_date_range: {
      type: Number,
      default: 7,
    },
  },
  computed: {
    summary_items() {
      return [
        {
          value: this.hit_details?.hits_found ?? 'NA',
          text: `${
            this.hit_details?.win_per?.toFixed(2) ?? 'NA'
          }% <strong>Won</strong> Your desired outcome`,
          variant: 'success',
        },
        {
          value: this.hit_details?.miss_found ?? 'NA',
          text: `${
            this.hit_details?.win_per?.toFixed(2) ?? 'NA'
          }% <strong>Lost</strong> Your desired outcome.`,
          variant: 'danger',
        },
        {
          value: this.hit_details?.avg_odds ?? 'NA',
          text: 'Average <strong>odds</strong> for the outcome.',
          variant: 'dark',
        },
        {
          value: this.hit_details?.games_having_odds ?? 'NA',
          text: 'Total number of <strong>games having odds</strong>',
          variant: 'success',
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
  },
};
</script>

<style lang="scss" scoped>
.summary-items-grid {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
  grid-gap: 26px;
  margin-top: 26px;

  .summary-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 60px;
    border-radius: 12px;
    // background-color: $color-grey-light;
    text-align: center;
    &__text {
      margin-top: 10px;
    }
    &--success {
      background: #eef5ed;
      border: 1px solid #60b15a;
    }
    &--dark {
      background: #ffffff;
      border: 1px solid #d5ded5;
    }
    &--danger {
      background: rgba(220, 96, 96, 0.1);
      /* red */

      border: 1px solid #dc6060;
    }
  }
}

@include for-size(sm) {
  .summary-items-grid {
    grid-template-columns: minmax(auto, 1fr);
  }
}
</style>
