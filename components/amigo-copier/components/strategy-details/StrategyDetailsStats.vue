<template>
  <div class="strategy-details-stats">
    <div class="fw-600 fs-18 mb-4">💰 Profit & Loss</div>
    <div class="fs-12 m-b-28 text-grey">
      <strong class="text-dark">How It Works:</strong> The data here shows you
      the performance of this strategy based on an assumed stake of £100 per
      bet. You can see the amount of games won, lost and profit in the last
      7days, 30days etc.
    </div>
    <div class="d-grid grid-col-2 grid-col-md-4 gap-10">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-2"
        style="border-radius: 8px"
      >
        <div class="fs-14 text-grey fw-500">
          {{ stat.label }}
        </div>
        <div class="fw-600">
          {{ stat.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stats: {
      type: Array,
      default: () => {
        return [
          {
            label: 'Published',
            value: '10/09/2021',
          },
          {
            label: 'Subscribers',
            value: '1245',
          },
          {
            label: 'Reviews',
            value: '320',
          },
          {
            label: 'Overall Views',
            value: '1421',
          },
          {
            label: 'All Picked Matches',
            value: '1845',
          },
          {
            label: '7 Days Picked Matches',
            value: '451',
          },
          {
            label: 'Rules & Conditions',
            value: 'Hidden',
          },
          {
            label: 'Strategy Type',
            value: 'PreMatch',
          },
        ];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.strategy-details-stats {
  &__grid {
  }
}
</style>
