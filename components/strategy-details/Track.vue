<template>
  <div>
    <div class="track-page-container">
      <div class="d-grid gap-20">
        <div class="footy-page-container" style="overflow: hidden">
          <h3 class="mb-3">🚀 BackTesting</h3>
          <div class="text-grey">
            <strong>How it works:</strong> No more guessing or betting blindly.
            Our sophisticated backtesting feature allows you to easily see the
            historical performance of your strategies within seconds. Footy
            Amigo runs through millions of data points and fixtures to calculate
            the true HIT RATE % of your strategy against the desired outcome
            you’ve set, so you can bet with confidence!
          </div>
          <div class="my-4">
            <DateRange v-model="selected_date_range" />
          </div>
          <WaitMessage
            v-if="filter.hit_rate == null && !is_expired"
            :waited_seconds="waited_seconds"
          />
          <b-overlay
            style="
              max-width: 520px;
              width: 100%;
              display: grid;
              gap: 30px;
              min-height: 126px;
            "
            :show="loading"
            v-else
          >
            <StrategyPerformance
              :outcome="filter.outcome"
              :track="filter.track"
              :selected_date_range="selected_date_range"
            />
          </b-overlay>
        </div>
        <div class="footy-page-container">
          <h3 class="mb-3">🎯 Summary</h3>
          <div class="text-grey">
            This shows you the summary and overview of how your strategy
            performed against the outcome you’ve set.
          </div>
          <WaitMessage
            v-if="filter.hit_rate == null && !is_expired"
            :waited_seconds="waited_seconds"
          />
          <b-overlay :show="loading" v-else>
            <StrategySummary
              :outcome="filter.outcome"
              :track="filter.track"
              :selected_date_range="selected_date_range"
            />
          </b-overlay>
        </div>
      </div>

      <rules-preview :value="filter" read_only v-if="pre_match_rules && filter">
      </rules-preview>
    </div>
  </div>
</template>

<script>
import RulesPreview from '~/components/strategy-creation/RulesPreview.vue';
import StrategyPerformance from '@/components/strategy-details/track/StrategyPerformance.vue';
import StrategySummary from '@/components/strategy-details/track/StrategySummary.vue';
import DateRange from '@/components/strategy-details/track/DateRange.vue';

import WaitMessage from '@/components/strategy-details/track/WaitMessage.vue';
import {mapState, mapActions, mapGetters} from 'vuex';
export default {
  components: {
    RulesPreview,
    StrategyPerformance,
    WaitMessage,
    StrategySummary,
    DateRange,
  },
  props: {
    included_leagues: Object,
    filter: Object,
    waited_seconds: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fixtures: [],
      type: 'pre-match-alerts',
      show_fixture_details: false,
      selected_fixture: null,
      selected_stat: 'ft_result',
      selected_scroller: 'stats_scroller',
      stat: 'ft_result',
      page: 1,
      initialized: false,
      loading: false,
      loaded: false,
      selected_date_range: 7,
    };
  },
  computed: {
    ...mapState(['pre_match_rules']),
    ...mapGetters(['is_expired']),
  },
  mounted() {
    this.fetchPreMatchRules();
  },
  methods: {
    ...mapActions(['fetchPreMatchRules']),
  },
};
</script>

<style lang="scss">
.track-page-container {
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  gap: 14px;
}

@include for-size(sm) {
  .track-page-container {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
