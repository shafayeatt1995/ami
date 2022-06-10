<template>
  <div class="streaks-table">
    <h4 class="streaks-table-head text-grey streaks-table-row">
      <div @click="sortby(0)" class="sortable-th sortable-th-title">
        <div class="sortable-th-content text-capitalize">{{ title }}</div>
        <SortButton
          class="sort-button"
          v-b-tooltip.hover.topright
          title="Sort by time"
          :active="sortList[0].value == currentSortIndex"
          :order="sortList[0].asc ? 1 : -1"
        />
      </div>

      <div class="centered">
        <StatsIcon />
      </div>

      <div @click="sortby(1)" class="sortable-th">
        <div class="sortable-th-content text-capitalize">%</div>
        <SortButton
          class="sort-button"
          v-b-tooltip.hover.topright
          title="Sort by hit %"
          :active="sortList[1].value == currentSortIndex"
          :order="sortList[1].asc ? 1 : -1"
        />
      </div>

      <div @click="sortby(2)" class="sortable-th">
        <div class="sortable-th-content text-capitalize">Odds</div>
        <SortButton
          class="sort-button"
          v-b-tooltip.hover.topright
          title="Sort by odds"
          :active="sortList[2].value == currentSortIndex"
          :order="sortList[2].asc ? 1 : -1"
        />
      </div>
    </h4>
    <div
      class="streaks-table-row centered text-capitalize streaks-mobile-title-row"
    >
      <div class="streaks-mobile-title">
        {{ title }}
      </div>
      <SmallDropdown
        label="Sort by"
        :options="sortList"
        v-model="currentSortIndex"
      />
    </div>
    <template v-if="fixtures.length">
      <div
        v-for="(fixture, index) in fixtures"
        :key="index"
        class="streaks-table-row"
        :class="['streak-' + getColor(fixture.hits_per)]"
      >
        <div v-if="loading" class="loading"><Loading /></div>
        <div v-else class="fixture-name-item streaks-table-item">
          <div class="time-info">
            <span class="flag-icon" :class="$getFlag(fixture.iso)"></span>
            <span>{{
              $moment.utc(fixture.timestamp * 1000).format('ddd LT')
            }}</span>
            <span v-if="fixture.home_position && fixture.away_position">
              {{ $nth(fixture.home_position) }} v
              {{ $nth(fixture.away_position) }}
            </span>
          </div>
          <div
            class="team-items mt-2 my-hover-effect"
            @click="$emit('showStats', fixture.fixture_id)"
            v-if="fixture.home_name"
          >
            <h4
              style="display: flex; align-items: center"
              class="overflow-ellipsis"
            >
              <b-img
                :src="fixture.home_logo || $defaultLogo"
                class="team-logo mr-2"
                style="width: 15px; height: 15px"
              ></b-img>
              <span class="text"> {{ fixture.home_name }}</span>
            </h4>
            <h4 style="display: flex; align-items: center">
              <b-img
                :src="fixture.away_logo || $defaultLogo"
                class="team-logo mr-2"
                style="width: 15px; height: 15px"
              ></b-img>
              <span class="text"> {{ fixture.away_name }}</span>
            </h4>
          </div>
          <div
            v-else
            class="p-3 fixture-name-item streaks-table-item"
            style="flex-direction: row"
          >
            <div class="centered w-100">
              <span class="material-icons-outlined text-primary"> lock </span>
              <nuxt-link to="/profile/subscription"
                ><span class="">Upgrade to pro</span>
              </nuxt-link>
            </div>
          </div>
        </div>

        <div class="no-of-hits-item streaks-table-item">
          <div class="streaks-table-label">No. of Hits</div>
          <div class="streaks-item-value streaks-table-no-of-hits centered">
            {{ fixture.hits }}/{{ fixture.played }}
          </div>
        </div>

        <div class="hit-per-item streaks-table-item">
          <div class="streaks-table-label">Hit %</div>
          <div class="streaks-item-value centered">
            <h4
              class="text-white centered rounded-10"
              block
              :class="['bg-' + getColor(fixture.hits_per)]"
              style="width: 40px; height: 50px"
            >
              {{ Math.round(fixture.hits_per) }}
            </h4>
          </div>
        </div>
        <div class="odd-item streaks-table-item centered">
          <b-button
            class="footy-button"
            target="_blank"
            @click="$emit('toggleBet', fixture.key)"
            :disabled="!fixture.home_name"
            :variant="
              selectedBets.includes(fixture.key) ? 'primary' : 'secondary'
            "
          >
            {{ fixture.odds ? fixture.odds.toFixed(2) : '-' }}
          </b-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center m-2">No streaks</div>
    </template>
  </div>
</template>

<script>
import SmallDropdown from '~/components/common/SmallDropdown.vue';
import SortButton from '~/components/common/SortButton.vue';

export default {
  props: {
    fixtures: Array,
    title: String,
    selectedBets: Array,
  },
  data() {
    return {
      loading: this.$store.getters.subscriptionType === 'trial',
      currentSortIndex: 1, // sortList[1]
      sortList: [
        {value: 0, field: 'timestamp', text: 'Kick-off time', asc: true},
        {value: 1, field: 'hits_per', text: 'Hit %', asc: false},
        {value: 2, field: 'odds', text: 'Odds', asc: false},
      ],
    };
  },
  async mounted() {
    this.sort();
    if (
      this.fixtures.length &&
      this.$store.getters.subscriptionType === 'trial'
    ) {
      const firstFixture = this.fixtures[0];
      const fullFixture = await this.$axios.$get(
        '/user/fixtures/' + firstFixture.fixture_id
      );
      firstFixture.home_name = fullFixture.home_name;
      firstFixture.away_name = fullFixture.away_name;
      firstFixture.home_logo = fullFixture.home_logo;
      firstFixture.away_logo = fullFixture.away_logo;
      this.loading = false;
    }
  },
  components: {
    SmallDropdown,
    SortButton,
  },
  methods: {
    sortby(sortIndex) {
      if (sortIndex === this.currentSortIndex) {
        this.sortList[this.currentSortIndex].asc =
          !this.sortList[this.currentSortIndex].asc;
      } else {
        this.currentSortIndex = sortIndex;
      }
    },
    sort() {
      const field = this.sortList[this.currentSortIndex].field;
      const asc = this.sortList[this.currentSortIndex].asc;
      this.fixtures.sort((a, b) => {
        return asc ? a[field] - b[field] : b[field] - a[field];
      });
    },
    getColor(num) {
      if (num >= 70) {
        return 'success';
      } else if (num >= 60) {
        return 'primary';
      } else if (num >= 49) {
        return 'warning';
      } else {
        return 'danger';
      }
    },
  },
  computed: {
    cssClass() {
      const css = {};
      css[this.currentSortIndex] = `active ${
        this.sortList[this.currentSortIndex].asc ? 'asc' : 'desc'
      }`;
      return css;
    },
  },
  watch: {
    currentSortIndex() {
      this.sort();
    },
    sortList: {
      handler() {
        this.sort();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.streaks-table-page {
  .time-info {
    font-size: 12px;
    line-height: 16px;
    color: $grey;
    display: flex;
    column-gap: 10px;
  }
}
.my-hover-effect:hover {
  cursor: pointer;
}
// .streaks-table-header {
//   padding: 8px;
//   display: grid;

// }
.streaks-table {
  display: grid;
  gap: 0px;
  font-weight: 500;
  align-content: flex-start;
  min-height: 300px;
  height: 566px;
  overflow-y: auto;
  .streaks-table-row {
    grid-template-columns: minmax(0, 5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(
        0,
        1.5fr
      );

    .streaks-table-label {
      color: $grey;
    }
    display: grid;

    gap: 12px;
    border: 1px solid #f0f1f0;
    border-top: none;
    padding: 8px;
    .win-per-item {
      justify-items: center;
      h4 {
        padding: 12px 8px;
        border-radius: 8px;
      }
    }

    &.streaks-mobile-title-row {
      display: none;
    }

    .streaks-table-label {
      display: none;
    }

    .sortable-th {
      display: flex;
      align-items: center;
      justify-content: center;
      .sortable-th-content {
        margin-right: 10px;
      }
      .sort-button {
      }
      &.sortable-th-title {
        justify-content: start;
      }
    }
  }
  .streaks-table-head {
    border: none;
    background: $light;
    // padding: 4px 16px;
    // border-top: 1px solid #f0f1f0;
    // border-bottom: 1px solid #f0f1f0;
  }
}
@media screen and (min-width: $lg) {
  .streaks-table {
    .streaks-table-row {
      &.streak-success {
        border-left: 4px solid $success;
      }
      &.streak-primary {
        border-left: 4px solid $primary;
      }

      &.streak-danger {
        border-left: 4px solid $danger;
      }
      &.streak-warning {
        border-left: 4px solid $warning;
      }
      .streaks-table-item {
        align-items: center;

        display: grid;
      }
      .streaks-table-label {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .streaks-table {
    gap: 12px;
    height: 750px;
    .streaks-table-row {
      grid-template-columns: 1fr 1fr;

      .streaks-table-label {
        display: block;
        margin-bottom: 8px;
      }
      .streaks-table-item {
        display: flex;
        flex-flow: column;
        row-gap: 5px;
      }
      .hit-per-item,
      .no-of-hits-item {
        align-items: center !important;
      }
      .fixture-name-item {
        grid-column: span 2;
        .team-items {
          display: flex;
          column-gap: 10px;
          overflow: hidden;
        }
      }
      .odd-item {
        grid-column: span 2;
        .btn {
          width: 100%;
        }
      }

      &.streak-success {
        border-top: 4px solid $success;
      }
      &.streak-primary {
        border-top: 4px solid $primary;
      }

      &.streak-danger {
        border-top: 4px solid $danger;
      }
      &.streak-warning {
        border-top: 4px solid $warning;
      }
      border-left: 1px solid #f0f1f0;

      border-radius: 4px;
      .streaks-table-no-of-hits {
        height: 100%;
      }
      .hide-on-mobile {
        display: none;
      }
      &.streaks-mobile-title-row {
        border-top: 1px solid #f0f1f0;
        display: flex;
      }
      .streaks-mobile-title {
        grid-column: span 2;
        flex-grow: 1;
      }
    }
    .streaks-table-head {
      display: none;
    }
  }
}
</style>
