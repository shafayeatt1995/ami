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

    <div class="strategy-list-table-wrapper">
      <div class="nav-items-search mb-4">
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

      <b-skeleton-wrapper :loading="loading && page <= 1">
        <template #loading>
          <div rounded="sm" class="mt-4">
            <div class="my-alerts-table">
              <div class="my-alerts-table-head my-alerts-table-row text-grey">
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
                <b-skeleton height="20px" width="70%"></b-skeleton>
              </div>

              <div v-for="index in 5" :key="index" class="my-alerts-table-row">
                <div class="my-alerts-table-item">
                  <b-skeleton height="40px" width="70%"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="20px" width="70%"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="20px" width="30px"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="40px" width="70%"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="20px" width="70%"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="30px" width="70%"></b-skeleton>
                </div>
                <div class="my-alerts-table-item">
                  <b-skeleton height="40px" width="70%"></b-skeleton>
                </div>
              </div>
            </div>
          </div>
        </template>
        <AlertsTable
          :strategies="userStrategies"
          @refetchTable="refetchTable"
          :selectedType.sync="selectedType"
          :selected_sort.sync="selected_sort"
          :type="strategy_type"
          :total="total"
          :strategy_type="strategy_type"
          edited
          @deleteStrategy="deleteStrategy"
          class="strategy-list-table"
          :is_upgrade_overlay_shown="is_upgrade_overlay_shown"
          :strategy_mode="strategy_mode"
        ></AlertsTable>
        <MugenScroll
          :handler="fetchStrategies"
          :should-handle="!loading"
          v-if="!loaded && !is_upgrade_overlay_shown"
        >
          <div class="centered my-4">
            <b-spinner variant="primary" v-if="loading"></b-spinner>
          </div>
        </MugenScroll>
      </b-skeleton-wrapper>
      <b-alert
        v-model="isAlert"
        class="position-fixed fixed-bottom m-0 rounded-0 d-flex align-items-center justify-content-center"
        style="z-index: 2000"
      >
        Alert has been added
      </b-alert>
    </div>
  </GeneralPage>
</template>

<script>
import GeneralPage from '../GeneralPage';
import AlertsTable from '~/components/AlertsTable';
import dummy_strategies from '~/components/json/dummy-strategies';

import HowItWorks from '~/components/HowItWorks';
import PlusIcon from '~/static/icons/plus.svg';
import PresetIcon from '~/static/icons/preset.svg';
import BellIcon from '~/static/icons/bell.svg';
import TrophyIcon from '~/static/icons/trophy.svg';

import tabManager from '@/mixins/tabManager';

export default {
  props: {
    page_title: String,
    page_description: String,
    strategy_type: String,
    strategy_mode: String,
  },
  data() {
    return {
      initialized: false,
      alerts: [],
      loading: false,
      loaded: false,
      page: 1,
      total: 0,
      selectedType: 'all',
      is_upgrade_overlay_shown: false,
      selected_sort: 'updated_at',
      isAlert: false,
      search_text: '',
      interval: null,
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
    selectedType() {
      this.refetchTable();
    },
    selected_sort() {
      this.refetchTable();
    },
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
        if (!this.$store.getters.subscriptionType) {
          return this.showDemoToExpired();
        }
        this.loading = true;
        // console.log(this.selected_sort);
        const {total, strategies} = await this.$axios.fetchStrategies({
          type: this.strategy_type,
          mode: this.strategy_mode,
          page: this.page,
          sortBy: this.selected_sort,
          filterBy: this.selectedType,
          search: this.search_text,
        });
        this.page += 1;
        this.total = total;
        this.alerts.push(...strategies);
        window.scrollBy(0, -200);
        this.loading = false;
        if (strategies.length < 20) {
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    showDemoToExpired() {
      this.alerts = dummy_strategies;
      // console.log(dummy_strategies);
      this.is_upgrade_overlay_shown = true;
    },
  },
  components: {
    AlertsTable,
    PlusIcon,
    PresetIcon,
    BellIcon,
    TrophyIcon,
    GeneralPage,
    HowItWorks,
  },
  created() {
    if (this.$route.query.showAlert) {
      this.isAlert = true;
      setTimeout(() => {
        this.isAlert = false;
      }, 5000);
    }
  },
  computed: {
    strategy_modes() {
      return this.tabManager(this.strategy_type);
    },

    userStrategies() {
      return this.alerts;
      // if (this.search_text.length === 0) return this.alerts;
      // return this.alerts.filter((option) => {
      //   return (
      //     option.title.toUpperCase().indexOf(this.search_text.toUpperCase()) !=
      //     -1
      //   );
      // });
    },
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

@media screen and (max-width: $lg) {
  .nav-items-search {
    flex-direction: column;
  }
  .nav-items-button {
    .btn {
      flex: 1;
    }
  }
}
</style>
