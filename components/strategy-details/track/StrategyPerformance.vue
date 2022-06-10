<template>
  <div>
    <h3 class="fs-24 fw-600 mb-3">🎯 Performance</h3>
    <div v-for="item in performance" :key="item.name" class="mb-4">
      <div class="d-flex mb-2 justify-content-between">
        <h4>
          {{ item.title
          }}<span class="text-grey"> ({{ item.hits }}/{{ item.total }})</span>
        </h4>
        <h4 :class="$getColor(item.hit_rate, 'text-')">{{ item.hit_rate }}%</h4>
      </div>
      <b-progress
        :value="item.hit_rate"
        :max="100"
        class="footy-progress"
        :variant="$getColor(item.hit_rate)"
      ></b-progress>
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
    performance() {
      return [
        {
          name: 'with_leagues_exclusion',
          title: this.outcome?.label,
          total: this.hit_details?.fixtures_found ?? 'NA',
          hits: this.hit_details?.hits_found ?? 'NA',
          miss: this.hit_details?.miss_found ?? 'NA',
          hit_rate: this.hit_details?.win_per?.toFixed(2) ?? 'NA',
        },
        {
          name: 'without_leagues_exclusion',
          title: 'Without Leagues Exclusion',
          total: this.hit_details?.fixtures_found_in_all_leagues ?? 'NA',
          hits: this.hit_details?.hits_found_in_all_leagues ?? 'NA',
          miss: this.hit_details?.miss_found_in_all_leagues ?? 'NA',
          hit_rate:
            this.hit_details?.win_per_in_all_leagues?.toFixed(2) ?? 'NA',
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

<style></style>
