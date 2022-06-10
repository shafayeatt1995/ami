<template>
  <div id="to-top">
    <label class="mt-3 mb-3 footy-label">
      Global League Exclusion
      <span>
        <InfoIcon class="icon-right" :id="id + '-info'"> </InfoIcon>
        <b-popover
          :target="id + '-info'"
          variant="grey"
          triggers="hover"
          placement="topright"
        >
          Want to exclude certain leagues from your strategies globally? You can
          do so below and use this will be your default leagues for new
          strategies.
        </b-popover>
      </span>
    </label>

    <div class="d-grid grid-col-md-2 gap-20" style="min-height: 700px">
      <LeagueAllItems
        v-if="!isMobile"
        title="Included"
        :countries="countries"
        :included_leagues="included_leagues"
        itemkey="included"
        :loading="loading"
        class="d-none d-lg-flex"
        @updateCount="updateIncludedCount"
      >
      </LeagueAllItems>

      <LeagueAllItems
        v-if="!isMobile"
        title="Excluded"
        :countries="countries"
        :included_leagues="included_leagues"
        itemkey="excluded"
        :loading="loading"
        class="d-none d-lg-flex"
        @updateCount="updateExcludedCount"
      ></LeagueAllItems>

      <b-tabs
        v-if="isMobile"
        fill
        class="bg-light rounded-20"
        active-nav-item-class="active-material-tab"
      >
        <b-tab>
          <template #title>
            <div class="include-exclude-title wrap-on-mobile">
              <h3>Included</h3>

              <h4 class="text-grey">{{ included_count }} Leagues</h4>
            </div>
          </template>
          <LeagueAllItems
            title="Included"
            :countries="countries"
            :included_leagues="included_leagues"
            itemkey="included"
            class="d-lg-none"
            :loading="loading"
            @updateCount="updateIncludedCount"
          >
          </LeagueAllItems>
        </b-tab>
        <b-tab>
          <template #title>
            <div class="include-exclude-title wrap-on-mobile">
              <h3>Excluded</h3>

              <h4 class="text-grey">{{ excluded_count }} Leagues</h4>
            </div>
          </template>

          <LeagueAllItems
            title="Excluded"
            :countries="countries"
            :included_leagues="included_leagues"
            itemkey="excluded"
            class="d-lg-none"
            :loading="loading"
            @updateCount="updateExcludedCount"
          ></LeagueAllItems>
          <!-- :filter="filter" -->
        </b-tab>
      </b-tabs>
    </div>
    <div class="centered mt-4" style="">
      <b-button
        variant="primary"
        class="footy-button"
        block
        @click="updateLeagues"
        href="#nuxt"
      >
        Save Changes
      </b-button>
    </div>
  </div>
</template>

<script>
import LeagueAllItems from './LeagueAllItems.vue';
import {SCREEN_SIZE} from '~/constants/';
import {mapActions} from 'vuex';
// import FixtureStatsWrapper from "~/components/FixtureStatsWrapper";
export default {
  props: {
    // id: String,
    // type: String,
    strategy_type: String,
  },
  data() {
    return {
      id: this.$uuid.v4(),
      countries: [],
      included_count: 0,
      excluded_count: 0,
      loading: true,
      included_leagues: [],
    };
  },
  components: {
    LeagueAllItems,
  },

  computed: {
    isMobile() {
      return this.$screenSize() === SCREEN_SIZE.MOBILE;
    },
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(['fetchCountries', 'fetchLeagues']),
    updateIncludedCount(value) {
      this.included_count = value;
    },
    async fetchData() {
      await this.fetchCountries();
      await this.fetchLeagues();
      await this.getLeagues();
    },
    updateExcludedCount(value) {
      this.excluded_count = value;
    },
    async getLeagues() {
      try {
        this.loading = true;
        const params = {strategy_type: this.strategy_type};
        this.included_leagues = await this.$axios.$get(
          `/user/leagues/league-all/`,
          {
            params,
          }
        );

        const includedLeague_ids = this.included_leagues.map(({id}) => id);
        // const countries = await this.$axios.$get("/user/leagues/countries");

        const existing = new Set(includedLeague_ids);
        this.countries = this.$store.getters.countries.map((country) => {
          const included = [];
          const excluded = [];
          for (const league of country['leagues']) {
            if (existing.has(league.league_id)) {
              included.push(league.league_id);
            } else {
              excluded.push(league.league_id);
            }
          }
          return {
            ...country,
            excluded,
            included,
          };
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async updateLeagues() {
      const included_leagues = [];
      for (const country of this.countries) {
        included_leagues.push(...country['included']);
      }

      const res = await this.$axios.$post(`/user/leagues/league-all/`, {
        strategy_type: this.strategy_type,
        included_leagues,
      });

      await this.$bvToast.toast(
        `Congrats! Your Global excluded/included leagues has been successfully updated.`,
        {
          title: 'Success',
          variant: 'primary',
          position: 'b-toaster-bottom-center',
          solid: true,
          autoHideDelay: 5000,
        }
      );
    },
  },
};
</script>
<style lang="scss">
@import '~/assets/scss/colors';

@import '~/assets/scss/breakpoints';
.include-exclude-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.active-material-tab {
  background: transparent !important;
  outline: none;
  border: 1px solid transparent !important;
  border-bottom: 2px solid $primary !important;
}
</style>
