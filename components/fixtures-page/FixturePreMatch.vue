<template>
  <div v-if="loading" class="d-flex justify-content-center">
    <Loader />
  </div>
  <div v-else>
    <div class="d-none">
      {{ fixtures_count }}
    </div>

    <div v-for="(country, index) in countries" :key="country.name">
      <div class="country-wrapper">
        <b-button @click="handleCountryClick(index)" class="country-name" block>
          <div class="country-content">
            <span class="flag-icon mr-2" :class="getFlag(country.iso)"></span>
            <span class="country-text">
              {{ country.name }}
            </span>
          </div>
          <b-spinner
            v-if="index == active_country_index && loading_fixtures_for_country"
            small
            type="grow"
            variant="success "
            class="mx-1"
          ></b-spinner>
          <span
            v-else-if="selected_scroller !== 'in_play_scroller'"
            class="material-icons-outlined icon"
            :class="{active: index !== active_country_index}"
          >
            keyboard_arrow_down
          </span>
        </b-button>
        <div v-if="index === active_country_index">
          <div
            v-for="(fixtures, league_name) in groupByLeague(country.fixtures)"
            :key="country.id + '_' + league_name"
            class="mb-2"
          >
            <div class="league-name pl-2">
              <h6>{{ league_name }}</h6>

              <FixtureLeagueStats />
            </div>

            <div class="mb-1" v-if="!false">
              <FixtureStatsWrapper
                :fixture="fixture"
                :stat="selected_stat"
                :scroller="selected_scroller"
                v-for="fixture in fixtures"
                :key="fixture.id"
                :is_live_mode="is_live_mode"
                @showstats="showStats(fixture)"
                @closestats="closeStats"
                showingDetails
                :statshidden="!show_fixture_details"
              >
              </FixtureStatsWrapper>
            </div>
          </div>
          <MugenScroll
            :handler="getCountryFixtures"
            :should-handle="!loading_fixtures_for_country"
            v-if="!loaded_all_fixtures_for_country"
          >
            <div class="centered my-4">
              <b-spinner
                variant="primary"
                v-if="loading_fixtures_for_country"
              ></b-spinner>
            </div>
          </MugenScroll>
        </div>
      </div>
    </div>

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        :preloaded_fixture="selected_fixture"
        v-if="selected_fixture"
        @closestats="closeStats"
        :key="selected_fixture_id"
        :fixture_id="selected_fixture_id"
        :is_live_mode="is_live_mode"
      >
      </FixtureDetails>
    </ModalOnMobile>
  </div>
</template>

<script>
import FixtureLeagueStats from '~/components/fixtures-page/FixtureLeagueStats.vue';

const NUMBER_OF_FIXTURE_PER_PAGE = 10;

export default {
  props: {
    selected_scroller: String,
    is_live_mode: Boolean,
    selected_date: Date,
    selected_stat: String,
    selected_settings: Array,
  },
  data() {
    return {
      countries: [],
      selected_fixture: null,
      show_fixture_details: false,
      selected_fixture_id: null,
      loading: false,
      active_country_index: -1,
      loading_fixtures_for_country: false,
      loaded_all_fixtures_for_country: false,
    };
  },
  mounted() {
    this.fetchFixtures();
  },
  components: {
    FixtureLeagueStats,
  },
  watch: {
    selected_date() {
      this.fetchFixtures();
    },
  },
  computed: {
    fixtures_count() {
      let count = 0;
      // console.log(Object.values(fixtures));
      for (const country of this.countries) {
        count += country.fixture_ids.length;
      }
      this.$emit('countChange', count);
      return count;
    },
  },
  methods: {
    async fetchFixtures() {
      try {
        this.loading = true;
        const date = this.$moment(this.selected_date).format('YYYY-MM-DD');
        const countries = await this.$axios.$get('/user/fixtures', {
          params: {date, settings: this.selected_settings},
        });
        this.countries = countries;
        this.loading = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getCountryFixtures() {
      try {
        this.loading_fixtures_for_country = true;
        const index = this.active_country_index;

        const {fixture_ids} = this.countries[index];
        const fetched_fixture_ids = this.$_.map(
          this.countries[index].fixtures,
          (fixture) => fixture.fixture_id
        );
        const diff_fixture_ids = this.$_.difference(
          fixture_ids,
          fetched_fixture_ids
        );
        const fixture_ids_to_fetch = this.$_.slice(
          diff_fixture_ids,
          0,
          NUMBER_OF_FIXTURE_PER_PAGE
        );

        const fixtures = await this.$axios.$post('/user/fixtures/ids', {
          fixture_ids: fixture_ids_to_fetch,
        });

        if (diff_fixture_ids === undefined || diff_fixture_ids.length === 0) {
          this.loaded_all_fixtures_for_country = true;
        }
        this.countries[index]['fixtures'].push(...fixtures);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_fixtures_for_country = false;
      }
    },
    getFlag(iso) {
      return iso ? 'flag-icon-' + iso : 'flag-icon-un';
    },
    closeStats() {
      this.show_fixture_details = false;
    },
    groupByLeague(fixtures) {
      if (!fixtures.length) {
        return {};
      }
      const leagues = new Set(fixtures.map((fixture) => fixture.league_name));
      const leagues_obj = {};
      leagues.forEach((league) => (leagues_obj[league] = []));
      fixtures.forEach((fixture) => {
        const {league_name} = fixture;
        leagues_obj[league_name].push(fixture);
      });
      return leagues_obj;
    },
    handleCountryClick(index) {
      if (this.active_country_index == index) {
        // user clicked opened country, and it should be closed.
        this.active_country_index = -1;
      } else {
        this.loaded_all_fixtures_for_country = false;
        this.active_country_index = index;
      }
    },
    async showStats(fixture) {
      this.selected_fixture = fixture;
      this.selected_fixture_id = fixture.fixture_id;
      this.show_fixture_details = true;
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/scss/colors';
</style>
