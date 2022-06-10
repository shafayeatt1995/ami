<template>
  <div id="to-top">
    <div class="d-grid grid-col-md-2 gap-20" style="min-height: 700px">
      <LeagueItems
        title="Included"
        :countries="countries"
        :leagues="leagues"
        itemkey="included"
        :filter="filter"
        :hits_lookup="hits_lookup"
        :loading="loading"
        class="d-none d-lg-flex"
        @updateCount="updateIncludedCount"
      >
      </LeagueItems>

      <LeagueItems
        title="Excluded"
        :countries="countries"
        :leagues="leagues"
        itemkey="excluded"
        :filter="filter"
        :loading="loading"
        :hits_lookup="hits_lookup"
        class="d-none d-lg-flex"
        @updateCount="updateExcludedCount"
      ></LeagueItems>

      <b-tabs
        fill
        class="bg-light d-lg-none rounded-20"
        active-nav-item-class="active-material-tab"
      >
        <b-tab>
          <template #title>
            <div class="include-exclude-title wrap-on-mobile">
              <h3>Included</h3>

              <h4 class="text-grey">{{ included_count }} Leagues</h4>
            </div>
          </template>
          <LeagueItems
            title="Included"
            :countries="countries"
            :leagues="leagues"
            itemkey="included"
            :filter="filter"
            class="d-lg-none"
            :hits_lookup="hits_lookup"
            :loading="loading"
            @updateCount="updateIncludedCount"
          >
          </LeagueItems>
        </b-tab>
        <b-tab>
          <template #title>
            <div class="include-exclude-title wrap-on-mobile">
              <h3>Excluded</h3>

              <h4 class="text-grey">{{ excluded_count }} Leagues</h4>
            </div>
          </template>

          <LeagueItems
            title="Excluded"
            :countries="countries"
            :leagues="leagues"
            itemkey="excluded"
            :filter="filter"
            :hits_lookup="hits_lookup"
            class="d-lg-none"
            :loading="loading"
            @updateCount="updateExcludedCount"
          ></LeagueItems>
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
import LeagueItems from './LeagueItems.vue';
export default {
  props: {
    id: String,
    type: String,
    filter: Object,
  },
  data() {
    return {
      countries: [],
      included_count: 0,
      excluded_count: 0,
      loading: false,
      hits: [],
    };
  },
  components: {
    LeagueItems,
  },

  computed: {
    leagues() {
      return this.$arrayToObject(this.$store.state.leagues_raw, 'id');
    },
    league_ids_all() {
      return this.$store.state.leagues.map((league) => league.value);
    },
    hits_lookup() {
      return this.$arrayToObject(this.hits, '_id');
    },
  },
  mounted() {
    this.included_ids = this.$jsonify(this.filter.leagues);

    this.getLeagues();
    this.getHits();
  },
  methods: {
    updateIncludedCount(value) {
      this.included_count = value;
    },
    updateExcludedCount(value) {
      this.excluded_count = value;
    },
    async getLeagues() {
      try {
        this.loading = true;
        const countries = await this.$axios.$get('/user/leagues/countries');

        const existing = new Set(this.filter.leagues);
        this.countries = countries.map((country) => {
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

        // this.leagues = leagues;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async updateLeagues() {
      const leagues = [];
      for (const country of this.countries) {
        leagues.push(...country['included']);
      }

      const body = {leagues};
      await this.$axios.$post(
        '/user/strategies/update-leagues/' + this.filter._id,
        body
      );
      await this.$bvToast.toast(
        `Congrats! Your strategy leagues has been successfully updated.`,
        {
          title: 'Success',
          variant: 'primary',
          position: 'b-toaster-bottom-center',
          solid: true,
          autoHideDelay: 5000,
        }
      );
    },
    async getHits() {
      try {
        this.loading = true;
        const hits = await this.$axios.$get(
          '/user/strategies/hits/' + this.filter._id
        );
        this.hits = hits;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
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
