<template>
  <div>
    <section class="footy-page-header">
      <div class="footy-page-header-info">
        <div class="footy-page-title-wrapper" style="margin-top: 30px">
          <h3 class="footy-page-title" style="font-size: 26px">
            {{ filter ? filter.title : 'Loading...' }}
          </h3>
        </div>
        <h2
          class="footy-page-description text-warning"
          v-html="
            'Desired outcome: ' + (filter ? filter.outcome.label : 'Loading')
          "
          style="font-weight: 500"
        ></h2>
      </div>
      <div class="footy-page-header-buttons"></div>
    </section>
    <div class="d-flex column-gap-10 mb-3" style="justify-content: flex-end">
      <FixtureDatePicker
        v-model="selected_date"
        :minDate="new Date()"
        :buttonText="$moment(selected_date).format('LL')"
      />
      <FixtureStatPicker v-model="selected_stat" />
    </div>

    <div style="min-height: 100px">
      <div
        v-for="(league, league_id) in $groupFixturesByLeague(fixtures)"
        :key="league_id + 'league'"
        class="mb-4"
      >
        <div
          class="text-uppercase pl-2 wrap-on-mobile mb-3 league-name-inner-strategy"
          block
        >
          <div class="country-content">
            <span class="flag-icon mr-2" :class="league.flagicon"></span>
            <span class="country-text">
              {{ league.name }}
            </span>
          </div>
          <b-button
            class="text-warning"
            size="sm"
            variant="transparent"
            v-show="league.league_id in included_leagues"
            @click="promptExcludeLeague(league.league_id)"
          >
            <!-- @click="$emit('promptExcludeLeague', league.league_id)" -->
            EXCLUDE LEAGUE
          </b-button>
        </div>
        <FixtureStatsWrapper
          :fixture="fixture"
          :stat="selected_stat"
          :scroller="selected_scroller"
          v-for="fixture in league.fixtures"
          :key="fixture.id"
          :is_live_mode="false"
          :hideFavorite="true"
          @showstats="showStats(fixture)"
          @closestats="closeStats"
          :statshidden="selected_fixture == null"
        >
        </FixtureStatsWrapper>
      </div>

      <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
        <FixtureDetails
          :preloaded_fixture="selected_fixture"
          v-if="selected_fixture"
          @closestats="closeStats"
          class="fixture-details-box"
          :selected_scroller="selected_scroller"
          :is_live_mode="false"
          :fixture_id="selected_fixture.fixture_id"
        >
        </FixtureDetails>
      </ModalOnMobile>
    </div>

    <LoadMore v-if="loading" />
    <!-- <MugenScroll :handler="getResults" :should-handle="!loading" v-if="!loaded"> -->
    <!--div class="centered my-4">
        <b-spinner variant="primary" v-if="loading"></b-spinner>
      </div-->
    <!-- </MugenScroll> -->

    <h4 v-if="!loading && loaded" class="centered text-grey">
      <template v-if="fixtures.length"> No more results ! </template>
      <template v-else>
        No fixtures that meets your rules were found for this day, try another
        date
      </template>
    </h4>

    <div v-else class="text-center">
      <b-button class="footy-button" variant="primary" @click="getResults">
        <PlusIcon class="icon-left" />
        <span class="text"> Load more </span>
      </b-button>

      <b-button
        class="footy-button"
        variant="primary"
        :disabled="page <= 2"
        @click="showLess"
      >
        <PlusIcon class="icon-left" />
        <span class="text"> Show less </span>
      </b-button>
    </div>

    <!-- <FixtureScrollPicker v-model="selected_scroller" /> -->

    <PromptModal
      v-model="showPrompt"
      @accepted="excludeLeague(exclude_league_id)"
    />
  </div>
</template>

<script>
import FixtureDatePicker from '~/components/fixtures-page/FixtureDatePicker.vue';
// import FixtureScrollPicker from "~/components/fixtures-page/FixtureScrollPicker.vue";
import FixtureStatPicker from '~/components/fixtures-page/FixtureStatPicker.vue';
import dummy_upcoming from '~/components/json/dummy-upcoming';
import PlusIcon from '~/static/icons/plus.svg';

import {FIXTURES_PER_PAGE_UPCOMING_BY_STRATEGY} from '~/constants/';

export default {
  props: {
    // included_leagues: Object,
    strategy_id: String,
    selected_scroller: String,
  },
  data() {
    return {
      filter: null,
      fixtures: [],
      showPrompt: false,
      exclude_league_id: null,
      type: 'pre-match-alerts',
      show_fixture_details: false,
      selected_fixture: null,
      selected_stat: 'ft_result',
      // selected_scroller: "stats_scroller",
      stat: 'ft_result',
      page: 1,
      initialized: false,
      loading: false,
      // is_upgrade_overlay_shown: false,
      loaded: false,
      selected_date: new Date(),
    };
  },
  components: {
    // FixtureScrollPicker,
    FixtureDatePicker,
    FixtureStatPicker,
    PlusIcon,
  },
  beforeMount() {
    this.getResults();
    this.getFilter(this.strategy_id);
  },

  watch: {
    selected_date() {
      this.page = 1;
      this.fixtures = [];
      this.getResults();
    },
  },

  computed: {
    strategy() {
      return this.strategy_id;
    },
    included_leagues() {
      if (!this.filter) {
        return {};
      }
      return Object.assign(
        {},
        ...this.filter.leagues.map((id) => {
          return {
            [id]: 1,
          };
        })
      );
    },
  },

  methods: {
    async showStats(fixture) {
      this.show_fixture_details = true;
      this.selected_fixture = fixture;
    },
    closeStats() {
      this.show_fixture_details = false;
      this.selected_fixture = null;
    },
    showDemoToExpired() {
      // not needed
      this.fixtures = dummy_upcoming;
      this.loaded = true;
      // console.log(dummy_strategies);
      this.is_upgrade_overlay_shown = true;
    },
    showLess() {
      this.page--;
      this.fixtures = this.fixtures.slice(
        0,
        -FIXTURES_PER_PAGE_UPCOMING_BY_STRATEGY
      );
    },
    async getResults() {
      try {
        if (this.$store.getters.subscriptionType == 'trial') {
          return this.showDemoToExpired();
        }
        this.loading = true;

        const params = {
          page: this.page,
          date: this.$moment(this.selected_date).unix(),
          // id: this.$route.params.id, // i.e. "623217e5044182c19fb6c179"
          id: this.strategy_id,
          perPage: FIXTURES_PER_PAGE_UPCOMING_BY_STRATEGY,
        };

        const {fixtures} = await this.$axios.$get(
          `/user/strategies/${this.type}/upcoming/`,
          {
            params,
          }
        );

        // this.loaded = fixtures.length < 50 ? true : false;
        this.loaded =
          fixtures.length < FIXTURES_PER_PAGE_UPCOMING_BY_STRATEGY
            ? true
            : false;
        if (!this.loaded) {
          window.scrollBy(0, -300);
        }
        this.page += 1;
        this.fixtures.push(...fixtures);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },
    async getFilter(id) {
      const params = {id};
      const filter = await this.$axios.$get(`/user/strategies/id/`, {
        params,
      });

      this.filter = filter;

      // console.log("getFilter => id = ", id, this.filter, this.filter._id);
    },
    async excludeLeague(league_id) {
      const strategy = await this.$axios.$post(
        '/user/strategies/exclude-league/' + this.filter._id,
        {league_id}
      );
      const index = this.filter.leagues.indexOf(league_id);
      if (index !== -1) {
        this.filter.leagues.splice(index, 1);
      }
    },
    async promptExcludeLeague(league_id) {
      this.showPrompt = true;
      this.exclude_league_id = league_id;
    },
  },
};
</script>

<style lang="scss">
@media screen and (min-width: $lg) {
  .is_hit {
    border-left: 4px solid $primary;
  }
  .not_hit {
    border-left: 4px solid $red;
  }
}
@media screen and (max-width: $lg) {
  .is_hit {
    border-top: 4px solid $primary;
  }
  .not_hit {
    border-top: 4px solid $red;
  }
}
</style>
