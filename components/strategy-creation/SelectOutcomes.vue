<template>
  <div class="selected-outcomes">
    <div class="d-flex flex-col row-gap-20">
      <h4 class="mb-2">Select Outcomes</h4>
      <h6 class="description-text">
        Select the main result (or results) you are expecting from this
        strategy. Selecting a 'Desired Outcome' from the list below will allow
        your strategy to be tracked and you will be able to view your strategy’s
        success rate and strike rate from your alert page.
      </h6>
      <b-overlay :show="loading" :opacity="0.95">
        <footy-vertical-radio
          v-model="outcome_id"
          :options="outcomeOptions"
          name="outcomes"
          v-if="outcomeOptions"
          id="outcomes"
          filtered
        ></footy-vertical-radio>
      </b-overlay>
    </div>
    <div class="step-button-group mt-5">
      <b-button
        class="footy-button prev-button"
        @click="$emit('prevstep')"
        href="#create-strategy"
      >
        <PrevIcon class="icon-left" />
        Previous Step
      </b-button>

      <b-button
        class="footy-button"
        variant="primary"
        :disabled="outcome_id == null"
        @click="$emit('nextstep')"
        href="#create-strategy"
      >
        Next Step
        <NextIcon class="icon-right" />
      </b-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  props: {
    value: null,
    showNav: {type: Boolean, default: true},
    strategy_type: String,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['outcome_choices']),
    outcomeOptions() {
      const demo_outcome = {
        value: this.$uuid.v4(),
        text: 'Outcome',
      };
      if (this.loading) {
        return Array(10).fill(demo_outcome);
      }
      return this.outcome_choices;
      // if (this.strategy_type == 'pre-match')
      //   return this.$store.getters.getPrematchOutcomeOptions;
      // else return this.$store.getters.getInplayOutcomeOptions;
    },
    outcome_id: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    this.fetchOutcomes();
  },
  methods: {
    async fetchOutcomes() {
      try {
        this.loading = true;
        await this.$store.dispatch('fetchOutcomes', {type: this.strategy_type});
        this.loading = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.selected-outcomes {
  .outcome-description {
    font-size: 12px;
    line-height: 18px;
    color: #60685f !important;
  }
  .sub-heading {
    margin-bottom: 8px;
  }
}
</style>
