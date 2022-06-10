<template>
  <div class="footy-page-container value-found" v-if="is_loading">
    <h2 class="value-found__title">Your Amigo is Working...</h2>

    <!-- <loading-image style="max-width: 260px"> </loading-image> -->

    <loading-animation
      style="display: grid; justify-items: center; min-height: 300px"
    >
    </loading-animation>

    <div class="w-100" style="max-width: 200px">
      <b-progress
        :value="progress"
        :max="100"
        show-progress
        class="w-100 rounded"
        variant="primary"
      >
        <b-progress-bar
          :value="progress"
          :label="`${((progress / 100) * 100).toFixed(0)}%`"
        ></b-progress-bar
      ></b-progress>
    </div>

    <b-button
      class="value-found__back footy-button"
      variant="primary"
      @click="$emit('new-combo')"
      block
      style="max-width: 260px"
    >
      <span class="material-icons-outlined"> keyboard_backspace </span>
      Go Back
    </b-button>
  </div>
  <div class="footy-page-container value-found" v-else-if="no_more">
    <h2 class="value-found__title">
      No value bets found. Please check back later!
    </h2>

    <!-- <sad-image style="max-width: 260px"> </sad-image> -->

    <sad-animation
      style="display: grid; justify-items: center; min-height: 300px"
    >
    </sad-animation>

    <!-- <div class="w-100" style="max-width: 200px; opacity: 0"> </div> -->
    <!-- <b-progress
        :value="progress"
        :max="100"
        show-progress
        class="w-100 rounded"
        animated
        variant="primary"
      ></b-progress> -->

    <b-button
      class="value-found__back footy-button"
      variant="primary"
      @click="$emit('new-combo')"
      block
      style="max-width: 260px"
      ><span class="material-icons-outlined"> keyboard_backspace </span>
      Go Back
    </b-button>
  </div>

  <div class="footy-page-container value-found" v-else>
    <h2 class="value-found__title">Value Found! 💸</h2>

    <ModalOnMobile v-model="show_value_box" v-if="show_value_box">
      <div class="value-box">
        <div class="value-box__heading">
          <h3>Value Bet Slip</h3>
          <!-- <b-button
            class="value-box__new-combo centered"
            @click="
              is_user_trial
                ? $router.push('/profile/subscription')
                : getValueBets()
            "
            @mouseenter="is_user_trial = !is_pro_user"
            @mouseleave="is_user_trial = false"
          >
            {{ is_user_trial ? "Upgrade 🔒 " : "New Combo" }}
            <span class="ml-1" v-if="is_user_trial"> </span>
            <retweet-icon class="ml-1" v-else> </retweet-icon>
          </b-button> -->
          <b-button
            class="value-box__new-combo centered"
            @click="!is_pro_user ? null : getValueBets()"
            id="new-combo-button"
            v-b-popover.click.bottom="'Upgrade to pro 🔒'"
          >
            New Combo
            <retweet-icon class="ml-1"> </retweet-icon>
          </b-button>

          <b-popover
            target="new-combo-button"
            placement="bottom"
            v-if="!is_pro_user"
          >
            <router-link to="/profile/subscription">
              <strong class="text-primary"> Upgrade to Pro 🔒 </strong>
            </router-link>
          </b-popover>
        </div>
        <div class="value-box__body">
          <div class="value-fixtures">
            <div
              v-for="fixture in fixtures"
              :key="fixture.fixture_id"
              class="value-fixture"
            >
              <h5
                @click="fixture.fixture_id ? showFixture(fixture) : null"
                class="cursor-pointer"
                :class="{'text-primary': !fixture.fixture_id}"
              >
                {{ fixture.fixture_name || '🔒 Upgrade to Pro' }}
              </h5>

              <h5>
                <span class="text-grey">{{ fixture.indication }} @</span>
                <span class="text-success">{{ fixture.odds.toFixed(2) }}</span>
                <span class="text-muted"
                  >l Real Odds: {{ fixture.footyamigo_odds.toFixed(2) }}</span
                >
              </h5>
              <div>
                <small>
                  Bookie probabilty: {{ fixture.bookie_chance }}% l Real
                  probability: {{ fixture.footyamigo_chance }}%
                  <span class="d-none d-md-inline-block">l</span>
                  <br class="d-md-none" />
                  <span class="text-primary strong"
                    >Value: {{ fixture.margin }}%</span
                  >
                </small>
              </div>
            </div>
          </div>
          <div class="value-box__actions">
            <div class="value-odds">
              <div>Stake</div>
              <div>{{ fixtures.length }} games @ {{ combined_odds }}</div>
            </div>
            <div class="d-grid grid-col-2 gap-20 w-100">
              <b-input class="footy-input w-100"> </b-input>
              <b-button
                variant="primary"
                class="footy-button w-100"
                v-b-popover.click.right="'Coming soon'"
                >Place Bet</b-button
              >
            </div>
            <div class="d-grid grid-col-2 gap-20 w-100">
              <b-button variant="twitter" class="footy-button w-100">
                <icon icon-name="facebook" class-names="mr-1" />Share</b-button
              >
              <b-button variant="facebook" class="footy-button w-100"
                ><icon icon-name="facebook" class-names="mr-1" />Share</b-button
              >
            </div>
          </div>
          <b-button
            class="value-found__back footy-button mobile-block"
            variant="primary"
            @click="$emit('new-combo')"
          >
            <span class="material-icons-outlined"> keyboard_backspace </span> Go
            Back
          </b-button>
        </div>
      </div>
    </ModalOnMobile>

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        v-if="selected_fixture"
        @closestats="show_fixture_details = false"
        :key="selected_fixture_id"
        :fixture_id="selected_fixture_id"
      >
      </FixtureDetails>
    </ModalOnMobile>
  </div>
</template>

<script>
import {ValueBetsApi} from '@/api/';
import RetweetIcon from '@/static/icons/retweet.svg';
import SadAnimation from '@/components/value-bets/sad-animation.vue';
import LoadingAnimation from '@/components/value-bets/loading-animation.vue';
import Icon from '@/components/common/Icon.vue';
import {mapGetters} from 'vuex';
export default {
  components: {
    SadAnimation,
    LoadingAnimation,
    Icon,
    RetweetIcon,
  },
  props: {
    odds_stack: String,
  },
  data() {
    return {
      fixtures: [],
      is_loading: true,
      no_more: false,
      progress: 0,
      interval: null,
      show_fixture_details: false,
      first_load: true,
      show_value_box: true,
      is_user_trial: false,
      skip: 0,
    };
  },
  computed: {
    ...mapGetters(['is_pro_user']),
    combined_odds() {
      return this.fixtures
        .reduce((acc, fixture) => {
          return acc * fixture.odds;
        }, 1)
        .toFixed(2);
    },
  },
  watch: {
    show_value_box(value) {
      if (!value) {
        this.$emit('new-combo');
      }
    },
  },
  mounted() {
    this.getValueBets();
  },
  methods: {
    async getValueBets() {
      /**
       * @param {number} ms - time in milliseconds
       */
      async function delay(ms) {
        // return await for better async stack trace support in case of errors.
        return await new Promise((resolve) => setTimeout(resolve, ms));
      }
      try {
        this.is_loading = true;
        this.progress = 0;
        this.no_more = false;
        const wait_seconds = this.first_load ? 8 : 1;
        let seconds = 0;
        while (seconds < wait_seconds) {
          await delay(100);
          this.progress = (seconds / wait_seconds) * 100;
          seconds += 0.1;
        }
        // this.interval = setInterval(() => {
        //   this.progress += 100 / wait_seconds / 10;
        //   if (this.progress >= 100) {
        //     clearInterval(this.interval);
        //     this.is_loading = false;
        //   }
        // }, 100);
        const {
          data: {fixtures},
        } = await ValueBetsApi.fetchCombo(this.skip, this.odds_stack);
        this.fixtures = fixtures;
        this.skip += 1;
      } catch (error) {
        this.no_more = true;
        this.skip = 0;
        console.error(error);
      } finally {
        this.first_load = false;
        this.is_loading = false;
      }
    },
    showFixture(fixture) {
      this.selected_fixture = fixture;
      this.selected_fixture_id = fixture.fixture_id;
      this.show_fixture_details = true;
    },
  },
};
</script>

<style lang="scss">
.value-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 100%;
  width: 100%;
  border-radius: 10px;
  gap: 40px;
  background: #f7f9f7;
  // padding: 35px;
  position: relative;
  &__back {
    // position: absolute;
    // top: -10px;
    // left: 10px;
    // background: white !important;
    // padding: 4px 7px;

    // color: #60685f;
    font-weight: 500;
    border: 1px solid #d5ded5;
    box-sizing: border-box;
    // border-radius: 4px;
  }
  &__title {
    color: #60b15a;
  }
  .value-box {
    width: 100%;
    max-width: 564px;
    background: #f7f9f7;
    box-shadow: 0px 14px 34px rgba(0, 0, 0, 0.07);
    border-radius: 20px;
    &__new-combo {
      background: white;
      padding: 4px 7px;
      color: #60685f;
      font-weight: 500;
      border: 1px solid #d5ded5;
      box-sizing: border-box;
      border-radius: 4px;
    }
    &__heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // height: 100%;
      width: 100%;
      gap: 20px;
      padding: 26px 24px;
      border-bottom: 1px solid #dee2de;
    }
    &__body {
      display: flex;

      flex-direction: column;
      justify-content: space-between;
      // height: 100%;
      width: 100%;
      gap: 20px;
      padding: 20px 24px;
      .value-fixtures {
        display: flex;

        flex-direction: column;
        justify-content: space-between;
        // height: 100%;
        width: 100%;
        // height: 400px;
        // overflow-y: scroll;
        gap: 20px;
        .value-fixture {
          padding-bottom: 6px;
          border-bottom: 1px solid #dee2de;
        }
      }
    }
    &__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      // height: 100%;
      width: 100%;
      gap: 20px;

      .value-odds {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        // height: 100%;
        width: 100%;
        gap: 20px;
        font-weight: 500;
      }
      .value-stake {
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        // // height: 100%;
        // width: 100%;
        // gap: 20px;
        // font-weight: 500;
      }
    }
  }
}

@media screen and (max-width: $md) {
  .value-found {
    overflow-y: auto;
    // &__back {
    //   display: none;
    // }
    &__title {
      font-size: 1.5rem;
    }
    .mobile-block {
      width: 100%;
    }
    .value-box {
      // overflow-y: auto;
      height: 100%;
      &__heading {
        padding: 20px;
      }
      &__body {
        overflow-y: auto;
        padding: 20px;
        height: 90%;
        // display: flex;
        // flex-direction: column;
      }
      &__actions {
        margin-top: auto;
      }
    }
  }
}
</style>
