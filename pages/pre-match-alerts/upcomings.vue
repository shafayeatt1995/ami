<template>
  <GeneralPage :page_title="page_title" :page_description="page_description">
    <template v-slot:pageButton>
      <b-button
        class="footy-button"
        variant="primary"
        block
        :disabled="!$store.getters.subscriptionType"
        :to="`/${strategy_type}/create`"
      >
        <PlusIcon class="icon-left" />

        <span class="text"> Add a new strategy </span>
      </b-button>
    </template>
    <template v-slot:howItWorks>
      <HowItWorks :location="strategy_type" />
    </template>

    <!-- nav -->
    <div class="strategy-list-table-wrapper">
      <!-- nav items -->
      <div class="nav-items-search">
        <div class="nav-items-button scroll-on-mobile">
          <b-button
            class="footy-button"
            :to="`/${strategy_type}/${mode.slug}`"
            v-for="mode in strategy_modes"
            :key="mode.slug"
          >
            <component class="icon-left" :is="mode.icon" />
            <span class="text">{{ mode.label }}</span>
          </b-button>
        </div>

        <!-- search box -->
        <div class="search-box-holder bg-lightpink">
          <b-input-group size="lg" class="search-box">
            <b-input-group-prepend>
              <div class="bg-lightpink centered p-2">
                <span style="margin-bottom: 2px">
                  <img :src="`/icons/search.svg?inline`" alt="" />
                </span>
              </div>
            </b-input-group-prepend>
            <b-form-input
              class="bg-lightpink search-input"
              placeholder="Search"
              v-model="search_text"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>

      <!-- main content -->
      <div v-if="total">
        <div>
          <div v-for="alert in alerts" :key="alert._id + 'alert'">
            <UpcomingByStrategy
              :strategy_id="alert._id"
              :selected_scroller="selected_scroller"
            ></UpcomingByStrategy>
            <div class="footy-hr"></div>
          </div>
        </div>
        <MugenScroll
          :handler="fetchStrategies"
          :should-handle="!loading"
          v-if="!loaded"
        >
        </MugenScroll>

        <FixtureScrollPicker v-model="selected_scroller" />
      </div>

      <!-- if there is no active strategies -->
      <div
        v-else
        class="d-flex m-5 mx-auto w-50 flex-column justfy-content-center align-items-center"
      >
        <div class="text-center h1 fw-normal custom-text">
          You don't have any <b>active</b> strategies. Once you have an active
          strategy, you will be able to see all the upcoming picks for your
          strategies.
        </div>
        <b-button
          class="footy-button mt-3"
          variant="primary"
          :disabled="!$store.getters.subscriptionType"
          :to="`/${strategy_type}/create`"
        >
          <PlusIcon class="icon-left" />

          <span class="text"> Add a new strategy </span>
        </b-button>
      </div>
    </div>
  </GeneralPage>
</template>

<script>
import GeneralPage from '~/components/GeneralPage';
// import dummy_strategies from '~/components/json/dummy-strategies';

import UpcomingByStrategy from '~/components/strategy-details/UpcomingByStrategy';

import FixtureScrollPicker from '~/components/fixtures-page/FixtureScrollPicker.vue';

import HowItWorks from '~/components/HowItWorks';
import PlusIcon from '~/static/icons/plus.svg';
import tabManager from '../../mixins/tabManager.vue';
export default {
  data() {
    const strategy_type = 'pre-match-alerts';
    return {
      page_title: 'Upcomings',
      page_description:
        'This page shows you all the upcoming picks for all your active strategies all on one page.',
      strategy_type: strategy_type,
      strategy_modes: this.tabManager(strategy_type),
      strategy_mode: 'upcoming-alerts',
      initialized: false,
      alerts: [],
      loading: false,
      loaded: false,
      page: 1,
      total: 0,
      // selectedType: "active",
      selected_sort: 'updated_at',
      search_text: '',
      interval: null,
      selected_scroller: 'stats_scroller',
    };
  },
  beforeMount() {
    this.fetchStrategies();
  },
  mixins: [tabManager],
  watch: {
    search_text(val) {
      // const durationInSeconds = this.$moment().diff(
      //   this.$moment(this.lastInput),
      //   "seconds"
      // );
      clearInterval(this.interval);

      const instance = this;
      this.interval = setTimeout((x) => {
        instance.refetchTable();
      }, 1000);
    },
    // selectedType() {
    //   this.refetchTable();
    // },
    // selected_sort() {
    //   this.refetchTable();
    // },
  },

  methods: {
    async deleteStrategy(id) {
      const index = this.alerts.findIndex((item) => item._id === id);

      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },

    async refetchTable() {
      this.page = 1;
      this.alerts = [];
      this.loaded = false;
      await this.fetchStrategies();
    },

    async fetchStrategies() {
      try {
        this.loading = true;
        // console.log(this.selected_sort);
        const {total, strategies} = await this.$axios.fetchStrategies({
          type: this.strategy_type,
          mode: this.strategy_mode,
          page: this.page,
          sortBy: this.selected_sort,
          search: this.search_text,
        });
        this.page += 1;
        this.total = total;
        this.alerts.push(...strategies);
        window.scrollBy(0, -200);
        this.loading = false;
        // if (strategies.length < 20) {
        if (strategies.length < 3) {
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },

  components: {
    PlusIcon,
    GeneralPage,
    HowItWorks,
    UpcomingByStrategy,
    FixtureScrollPicker,
  },
};
</script>

<style lang="scss">
// @use "sass:map";

.strategy-list-table-wrapper {
  font-weight: 500;
  .fixed-bottom {
    background: #60b15ad3 !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff !important;
  }
  .btn.nuxt-link-exact-active.nuxt-link-active {
    background: $primary;
    color: white;
    svg {
      filter: grayscale(1) brightness(0) invert(1);
    }
  }
}

.nav-items-search {
  display: flex;
  row-gap: 1rem;
  column-gap: 8px;
  .nav-items-button {
    display: flex;
    column-gap: 8px;
    flex-shrink: 0;
  }
}

.footy-hr {
  margin: 50px 0;
  position: relative;
  &:after {
    // @color:#f1d479;
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 2px;
    display: block;
    background: #f1d479; // Fallback to block line if doesn't support radial gradient background
    background: radial-gradient(
      fadeout(#f1d479, 0%) 40%,
      fadeout(#f1d479, 100%) 80%
    );
  }
}

.custom-text {
  font-size: 2rem;
  width: 130%;
}

@media screen and (max-width: $lg) {
  .nav-items-search {
    flex-direction: column;
  }
  .nav-items-button {
    .btn {
      flex: 1;
    }
  }
  .custom-text {
    font-size: 1.5rem;
    width: 150%;
  }
}
</style>
