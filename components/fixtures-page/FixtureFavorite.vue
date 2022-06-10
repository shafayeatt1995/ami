<template>
  <div class="country-wrapper">
    <b-button @click="hidden = !hidden" class="favorite-button" block>
      <div class="favorite-content">
        <StarredGreenIcon class="mr-2" />
        <span class="mr-3"> Favorites </span>
        <span> {{ fixtures.length }} Saved </span>
      </div>
      <div class="flex-grow-1"></div>
      <label
        class="text-primary mr-3 cursor-pointer"
        @click.stop="showConfirmPrompt = true"
      >
        Clear All
      </label>
      <b-spinner
        v-if="loading"
        small
        type="grow"
        variant="success "
        class="mx-1"
      ></b-spinner>
      <span
        v-else-if="selected_scroller !== 'in_play_scroller'"
        class="material-icons-outlined icon"
        :class="{active: hidden}"
      >
        keyboard_arrow_down
      </span>
    </b-button>
    <div v-if="!hidden && loading" class="d-flex justify-content-center">
      <Loader />
    </div>
    <div v-else v-show="!hidden">
      <div class="mb-2">
        <div class="mb-1">
          <FixtureStatsWrapper
            :fixture="fixture"
            :stat="selected_stat"
            :scroller="selected_scroller"
            v-for="(fixture, index) in fixtures"
            :key="fixture.fixture_id + '-' + index"
            @showstats="showStats(fixture)"
            @closestats="closeStats"
            showingDetails
            :statshidden="!show_fixture_details"
          >
          </FixtureStatsWrapper>
        </div>
      </div>
    </div>
    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        :preloaded_fixture="selected_fixture"
        :fixture_id="selected_fixture.fixture_id"
        v-if="selected_fixture"
        @closestats="closeStats"
        :selected_scroller="selected_scroller"
        :is_live_mode="is_live_mode"
      >
      </FixtureDetails>
    </ModalOnMobile>
    <PromptModal
      v-model="showConfirmPrompt"
      title="Clear Favorites?"
      message="This will remove all your saved favourites."
      @accepted="clearAll"
      :hideCancel="true"
      acceptText="Clear All"
    />
  </div>
</template>

<script>
import PromptModal from '~/components/common/PromptModal.vue';

export default {
  props: {
    selected_scroller: String,
    is_live_mode: Boolean,
    selected_stat: String,
  },
  data() {
    return {
      fixtures: [],
      selected_fixture: null,
      show_fixture_details: false,
      showConfirmPrompt: false,
      hidden: true,
      loading: true,
    };
  },
  async mounted() {
    await this.getFavoriteFixtures();
  },
  components: {
    PromptModal,
  },
  methods: {
    async getFavoriteFixtures() {
      try {
        this.loading = true;
        const fixture_ids = this.$store.getters.favoriteFixtures;
        this.fixtures = await this.$axios.$post('/user/fixtures/ids', {
          fixture_ids,
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    closeStats() {
      this.show_fixture_details = false;
    },

    showStats(fixture) {
      console.log('show stats', fixture);
      this.selected_fixture = fixture;
      this.show_fixture_details = true;
    },

    clearAll() {
      this.$store.dispatch('clearFavoriteFixture');
    },
  },

  watch: {
    '$store.getters.favoriteFixtures': function () {
      this.getFavoriteFixtures();
    },
  },
};
</script>

<style lang="scss">
@import '~assets/scss/breakpoints';
@import '~/assets/scss/colors';
</style>
