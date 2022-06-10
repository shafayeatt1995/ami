<template>
  <div>
    <h3 class="fs-18 fw-600 m-b-15">📆 Date Range</h3>
    <div class="m-b-31 fs-12 text-grey">
      <strong class="text-dark">How It Works:</strong> The date range allows you
      to see the percentage % hit rate of the strategy in different time
      ranges.<br />
      This gives you an overview of the strength of the strategy against the
      outcome or market set by the seller.
    </div>
    <div class="m-b-26">
      <DateRange v-model="selected_date_range" />
    </div>
    <StrategyPerformance
      :track="track"
      :selected_date_range="selected_date_range"
      :outcome="outcome"
    />
  </div>
</template>

<script>
import StrategyPerformance from '@/components/strategy-details/track/StrategyPerformance.vue';
import DateRange from '@/components/strategy-details/track/DateRange.vue';
export default {
  components: {
    StrategyPerformance,
    DateRange,
  },
  data() {
    return {
      selected_date_range: 7,
      outcome: {
        priority: 0,
        type: 'both',
        _id: '61ee97e00a8dcd4cc1bfc8f2',
        id: 40,
        code: 'o05_goals',
        label: 'Over 0.5 Total Goals',
        active: true,
        is_bet_builder: null,
      },
      track: {
        7: {
          hits_found_in_all_leagues: 2109,
          miss_found_in_all_leagues: 108,
          fixtures_found_in_all_leagues: 2217,
          hits_found: 2085,
          fixtures_found: 2193,
          miss_found: 108,
          avg_odds: 1.0397,
          win_per_in_all_leagues: 95.1286,
          lose_per_in_all_leagues: 4.8714,
          win_per: 95.0752,
          lose_per: 4.9248,
          games_having_odds: 507,
        },
        30: {
          hits_found_in_all_leagues: 10759,
          miss_found_in_all_leagues: 611,
          fixtures_found_in_all_leagues: 11370,
          hits_found: 10668,
          fixtures_found: 11277,
          miss_found: 609,
          avg_odds: 1.0658,
          win_per_in_all_leagues: 94.6262,
          lose_per_in_all_leagues: 5.3738,
          win_per: 94.5996,
          lose_per: 5.4004,
          games_having_odds: 2564,
        },
        90: {
          hits_found_in_all_leagues: 32516,
          miss_found_in_all_leagues: 2401,
          fixtures_found_in_all_leagues: 34917,
          hits_found: 32386,
          fixtures_found: 34780,
          miss_found: 2394,
          avg_odds: 1.0564,
          win_per_in_all_leagues: 93.1237,
          lose_per_in_all_leagues: 6.8763,
          win_per: 93.1167,
          lose_per: 6.8833,
          games_having_odds: 7029,
        },
        180: {
          hits_found_in_all_leagues: 49264,
          miss_found_in_all_leagues: 3661,
          fixtures_found_in_all_leagues: 52925,
          hits_found: 49126,
          fixtures_found: 52780,
          miss_found: 3654,
          avg_odds: 1.0547,
          win_per_in_all_leagues: 93.0827,
          lose_per_in_all_leagues: 6.9173,
          win_per: 93.0769,
          lose_per: 6.9231,
          games_having_odds: 11151,
        },
      },
    };
  },
  computed: {
    date_ranges() {
      return [
        {
          value: 7,
          text: '7 Days',
        },
        {
          value: 30,
          text: '30 Days',
        },
        {
          value: 90,
          text: '3 Months',
        },
        {
          value: 180,
          text: '6 Months',
        },
      ];
    },
  },
};
</script>

<style></style>
