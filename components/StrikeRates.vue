<template>
  <div class="d-grid gap-20" style="align-content: start">
    <h3 class="inner-heading">Picks Sent</h3>
    <footy-radio
      id="strike-rates"
      v-model="strikeRate.active"
      :options="strikeRate.modes"
      radioClass="w-100-mobile centered"
    >
    </footy-radio>

    <div class="fmt">
      <div class="fmt-head fmt-row text-grey">
        <div class="strategy-name">STRATEGY NAME</div>
        <div class="hit-rate">PICKS SENT</div>
        <div class="actions centered">ACTIONS</div>
      </div>

      <b-skeleton-wrapper :loading="loading">
        <template #loading>
          <div v-for="index in 4" :key="'recent_picks' + index" class="fmt-row">
            <b-skeleton height="40px" class="strategy-name" />
            <b-skeleton height="40px" class="hit-rate" />
            <b-skeleton height="40px" class="actions" />
          </div>
        </template>
        <template v-if="strikes.length">
          <div
            v-for="(filter, i) in strikeRates[strikeRate.active]"
            :key="i"
            class="fmt-row"
          >
            <div class="fmt-label text-grey">STRATEGY NAME</div>
            <div class="fmt-label text-grey">PICKS SENT</div>
            <div class="strategy-name">
              {{ filter.title }}
            </div>
            <div class="hit-rate">
              {{ filter.picks_sent }}
            </div>
            <!-- <div class="hit-rate" :class="$getColor(filter.strike_rate, 'text-')">
                {{ filter.strike_rate }}%
              </div> -->
            <div class="actions">
              <b-button
                variant="secondary"
                class="footy-button"
                block
                :disabled="!$store.getters.subscriptionType"
                @click="viewFilter(filter._id)"
                >View</b-button
              >
            </div>
          </div>
        </template>
        <div v-else class="centered py-3">
          <h4 class="text-grey">No strategies found !</h4>
        </div>
      </b-skeleton-wrapper>
    </div>
    <SharerModal
      v-model="is_strategy_shown"
      :id="strategy_id"
      v-if="is_strategy_shown"
      :is_view_mode="true"
    >
    </SharerModal>
  </div>
</template>

<script>
import SharerModal from '~/components/SharerModal';
export default {
  data() {
    return {
      is_strategy_shown: false,
      strategy_id: null,
      strikeRates: {
        user_stategies: [],
        other_stategies: [],
      },
      strikeRate: {
        modes: [
          {text: 'Others', value: 'other_stategies'},
          {text: 'Yours', value: 'user_stategies'},
        ],
        active: 'other_stategies',
        fields: [{key: 'title', label: 'Strategy Name'}, 'hit_rate', 'actions'],
      },
      loading: true,
    };
  },
  components: {
    SharerModal,
  },
  computed: {
    strikes() {
      return this.strikeRates[this.strikeRate.active];
    },
  },
  mounted() {
    this.getStrikeRates();
  },
  methods: {
    async getStrikeRates() {
      try {
        this.loading = true;
        const rates = await this.$axios.getStrikeRates();
        this.strikeRates = rates;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    viewFilter(id) {
      this.is_strategy_shown = true;
      this.strategy_id = id;
    },
  },
};
</script>

<style lang="scss"></style>
