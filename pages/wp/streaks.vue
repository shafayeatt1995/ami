<template>
  <div id="info">
    <div class="streaks-wp" v-if="streak" ref="info">
      <div class="streaks-wp-table__head text-capitalize mb-3">
        {{ title }}
      </div>
      <div class="streaks-wp-table grid-col-sm-2">
        <div
          class="streaks-wp-table__row"
          v-for="(fixture, index) in streak.fixtures"
          @click="openFixture(fixture.fixture_id)"
          :key="fixture._id"
        >
          <span class="streaks-wp-table__cell country-name">
            <div class="text-grey">
              <span
                class="flag-icon mr-3"
                :class="$getFlag(fixture.iso)"
              ></span>
              {{ $moment.utc(fixture.timestamp * 1000).format('ddd') }} |
              {{ $moment.utc(fixture.timestamp * 1000).format('hh:mm') }} |
              <strong class="text-dark"
                >{{ fixture.home_position | nth }} vs
                {{ fixture.away_position | nth }}</strong
              >
            </div>
          </span>
          <span class="streaks-wp-table__cell">
            <div class="" v-if="!fixture.fixture_id">
              <b-button class="get-pro-button" @click="viewMore"
                ><pad-lock-icon /> Get Pro
              </b-button>
            </div>
            <div>
              <div
                :class="{'blurred-team': !fixture.fixture_id}"
                class="team-names"
              >
                <span>
                  <b-img
                    :src="fixture.home_logo || $defaultLogo"
                    class="team-logo mr-1 mr-md-2"
                  ></b-img
                  >{{ fixture.home_name }}</span
                >
                <span class="mx-3"> v</span>

                <span>
                  <b-img
                    :src="fixture.away_logo || $defaultLogo"
                    class="team-logo mr-1 mr-md-2"
                  ></b-img
                  >{{ fixture.away_name }}
                </span>
              </div>
              <!-- <div class="d-block d-lg-none mt-5" v-if="!fixture.fixture_id">
              <b-button
                class="get-pro-button"
                v-if="!fixture.fixture_id"
                @click="viewMore"
                ><pad-lock-icon /> Get Pro
              </b-button>
            </div> -->
            </div>

            <b-button class="footy-button custom-button">
              {{ fixture[market] | TwoDecimal }}
            </b-button>
          </span>

          <div class="streaks-wp-table__cell streaks-wp-table__cell--result">
            <div>
              <h5 class="mb-1">
                <span class="text-primary fw-600 streak-label"
                  >{{ label }} - Yes</span
                >
              </h5>
              <h4 class="text-grey streak-description">
                {{ getTeamName(fixture, index) }} has had
                <span class="fw-600 text-dark"
                  >{{ fixture.hits }} out {{ fixture.played }}</span
                >
                of their last games end with
                <span class="fw-600 text-dark">{{ short_label }}</span>
              </h4>
            </div>
            <div>
              <h5 class="custom-percentage" style="">
                {{ fixture.hits_per }}%
              </h5>
            </div>
          </div>
        </div>
      </div>
      <b-button
        class="streaks-wp-table__head text-left view-more-button"
        @click="viewMore"
      >
        View 100+ more {{ label }} predictions
        <right-chevron-icon class="ml-auto"> </right-chevron-icon>
      </b-button>
    </div>
  </div>
</template>

<script>
import PadLockIcon from '~/static/icons/padlock.svg';
import RightChevronIcon from '~/static/icons/right-chevron.svg';

export default {
  layout: 'wp',
  components: {
    PadLockIcon,
    RightChevronIcon,
  },
  data() {
    return {
      streak: null,
      markets: {
        home_win: {
          short_label: 'Home Win',
          label: 'Home Win',
        },
        away_win: {
          short_label: 'Away Win',
          label: 'Away Win',
        },
        draw: {
          short_label: 'Draw',
          label: 'Draw',
        },
        home_win_ht: {
          short_label: 'Home Win HT',
          label: 'Home Win HT',
        },
        away_win_ht: {
          short_label: 'Away Win HT',
          label: 'Away Win HT',
        },

        btts: {
          short_label: 'BTTS',
          label: 'Both Teams To Score',
        },
        btts_o05: {
          short_label: 'BTTS +0.5',
          label: 'Both Teams To Score +0.5',
        },
        most_goals_1h: {
          short_label: 'Most Goals 1H',
          label: 'Most Goals 1H',
        },
        most_goals_2h: {
          short_label: 'Most Goals 2H',
          label: 'Most Goals 2H',
        },
        o05_goals_1h: {
          short_label: 'Over 0.5 Goals 1H',
          label: 'Over 0.5 Goals 1H',
        },
        o15_goals: {
          short_label: 'Over 1.5 Goals',
          label: 'Over 1.5 Goals',
        },
        o25_goals: {
          short_label: 'Over 2.5 Goals',
          label: 'Over 2.5 Goals',
        },
        u35_goals: {
          short_label: 'Under 3.5 Goals',
          label: 'Under 3.5 Goals',
        },
        u25_goals: {
          short_label: 'Under 2.5 Goals',
          label: 'Under 2.5 Goals',
        },
        o8_corners: {
          short_label: 'Over 8 Corners',
          label: 'Over 8 Corners',
        },
        u9_corners: {
          short_label: 'Under 10 Corners',
          label: 'Under 10 Corners',
        },
      },
    };
  },
  computed: {
    form() {
      return this.$route.query.form;
    },
    market() {
      return this.$route.query.market;
    },
    label() {
      return this.markets[this.market].label;
    },
    short_label() {
      return this.markets[this.market].short_label;
    },
    title() {
      const form_labels = {
        home: 'Home Team',
        away: 'Away Team',
        overall: 'Both teams',
      };
      const form_label = form_labels[this.form];
      return `${this.short_label} Tips (${form_label})`;
    },
    pageHeight() {
      return this.streak ? this.$refs.info : null;
    },
  },
  mounted() {
    this.fetchStreak();
    // on document ready get page height
    const resize_ob = new ResizeObserver((entries) => {
      // since we are observing only a single element, so we access the first element in entries array
      const rect = entries[0].contentRect;

      // current width & height
      // const width = rect.width;
      const height = rect.height;
      this.adjustHeight(height);
    });

    // start observing for resize
    resize_ob.observe(document.querySelector('#info'));
    console.log('height', this.pageHeight);
  },
  beforeDestroy() {
    // stop observing for resize
    this.resize_ob.disconnect();
  },
  methods: {
    async fetchStreak() {
      const streak = await this.$axios.$get('/wp/streaks', {
        params: {
          form: this.form,
          market: this.market,
        },
      });
      this.streak = streak;
    },
    openFixture(fixture_id) {
      const message = {
        action: 'open-fixture',
        fixture_id: fixture_id,
      };
      window.top.postMessage(message, '*');
    },
    viewMore() {
      const message = {
        action: 'view-more',
      };
      window.top.postMessage(message, '*');
    },
    adjustHeight(height) {
      const message = {
        action: 'adjust-height',
        height: height,
      };
      window.top.postMessage(message, '*');
    },
    getTeamName(fixture, index) {
      const form_labels = {
        home: 'The Home Team',
        away: 'The Away Team',
        overall: 'Both teams',
      };
      if (!fixture.fixture_id) {
        return form_labels[this.form];
      } else {
        if (this.form === 'home') {
          return fixture.home_name;
        } else if (this.form === 'away') {
          return fixture.away_name;
        } else {
          return `Both ${fixture.home_name} and ${fixture.away_name}`;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.streaks-wp {
  font-family: Poppins, sans-serif;
  color: #060606;
  // padding: 10px;
  --desktop-font-size-24: 24px;
  --desktop-font-size-20: 20px;
  --desktop-font-size-18: 18px;
  .streaks-wp-table {
    display: grid;
    gap: 19px;
    margin-bottom: 10px;
    .get-pro-button {
      background: rgba(228, 175, 94, 0.2);
      display: flex;

      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 7px 18px;

      background: rgba(228, 175, 94, 0.2);

      color: #e4af5e;
      border-radius: 10px;
      border: 0;

      font-weight: 600;

      gap: 10px;
    }
    &__head {
      background: #3bb44d;
      color: white;

      font-size: var(--desktop-font-size-24);
      font-weight: 600;

      padding: 10px 30px;
      border-radius: 10px;
      &.view-more-button {
        font-weight: 600;

        line-height: 24px;
        padding: 18px 20px;
        display: flex;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }
    }
    &__row {
      display: flex;
      // align-items: center;
      flex-direction: column;
      // justify-content: space-between;
      padding: 10px 20px;
      border: 1px solid $success;
      border-radius: 10px;
      gap: 25px;
      padding: 12px 20px;
      &:hover {
        // cursor: pointer;
      }
      .country-name {
        font-size: var(--desktop-font-size-18);
        font-weight: 500;
        padding: 10px 18px;
        background: $light;

        border-radius: 10px;

        display: flex;

        align-items: center;
      }
    }
    &__cell {
      display: flex;
      justify-content: space-between;
      font-size: var(--desktop-font-size-18);
      line-height: 27px;
      align-items: center;
      gap: 20px;
      .streak-label {
        font-size: var(--desktop-font-size-24);
      }
      .streak-description {
        font-size: var(--desktop-font-size-18);
      }
      .team-names {
        font-weight: 500;
        font-size: var(--desktop-font-size-20);
        line-height: 27px;
        /* identical to box height */

        letter-spacing: -1px;

        color: #60685f;
      }
      .blurred-team {
        filter: blur(4px);
        opacity: 0.5;
      }
      .custom-button {
        background: rgba(59, 180, 77, 0.2);
        font-weight: 800;
        font-size: var(--desktop-font-size-18);
        line-height: 21px;
        /* identical to box height */

        color: #3bb44d;
        padding: 10px;
        border-radius: 5px;
      }
      .custom-percentage {
        color: white;
        background: #3bb44d;
        padding: 6px;
        border-radius: 8px;
        font-size: var(--desktop-font-size-18);
      }
      &--result {
        background: rgba(96, 177, 90, 0.1);
        padding: 12px 23px;
        background: rgba(96, 177, 90, 0.1);
        /* green */

        border: 1px solid #60b15a;
        box-sizing: border-box;
        border-radius: 15px;
      }
    }
    .last-data {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

@media screen and (max-width: $lg) {
  .streaks-wp {
    --desktop-font-size-24: 16px;
    --desktop-font-size-20: 14px;
    --desktop-font-size-18: 12px;
  }
}
</style>
