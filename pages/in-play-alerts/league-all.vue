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

    <!-- Start of Main Content -->
    <LeagueAll
      :strategy_type="strategy_type"
    />
    <!-- End of Main Content -->

    </div>
  </GeneralPage>
</template>

<script>
import GeneralPage from "~/components/GeneralPage";

import HowItWorks from "~/components/HowItWorks";
import PlusIcon from "~/static/icons/plus.svg";
import PresetIcon from "~/static/icons/preset.svg";
import BellIcon from "~/static/icons/bell.svg";
import ExploreIcon from "~/static/icons/explore.svg";
import CalendarIcon from "~/static/icons/calendar.svg";
import TrophyIcon from "~/static/icons/trophy.svg";

import tabManager from '@/mixins/tabManager';

import LeagueAll from "~/components/sections/LeagueAll";

export default {
  data() {
    const strategy_type = "in-play-alerts";
    return {
      page_title: "PreMatch Alerts",
      page_description: "Create unlimited PreMatch Alerts to Automatically find Value Matches According to Your Conditions, or Import Preset Alerts Created by other Users",
      strategy_type,
      search_text: "", // not used
      strategy_modes: this.tabManager(strategy_type),
    };
  },
  beforeMount() {
  },

  mixins: [ tabManager ],

  methods: {
  },
  components: {
    PlusIcon,
    PresetIcon,
    BellIcon,
    TrophyIcon,
    GeneralPage,
    HowItWorks,
    LeagueAll,
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
