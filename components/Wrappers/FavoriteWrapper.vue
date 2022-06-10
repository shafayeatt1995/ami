<template>
  <div
    class="favorite-wrapper"
    @click="toggle"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <span class="star-icon" v-if="isFavorite">
      <StarredHoverIcon v-if="hovered && !isMobile" />
      <StarredIcon v-else />
    </span>
    <span class="star-icon" v-else>
      <UnstarredHoverIcon v-if="hovered && !isMobile" />
      <UnstarredIcon v-else />
    </span>
  </div>
</template>

<script>
import {SCREEN_SIZE} from '~/constants/';

export default {
  props: {
    fixture: Object,
  },
  data() {
    return {
      hovered: false,
    };
  },
  methods: {
    toggle() {
      const {fixture_id} = this.fixture;
      const addOrRemove = !this.isFavorite; // true: to be inserted : false: to be remove
      this.$store.dispatch('toggleFavoriteFixture', {fixture_id, addOrRemove});
    },
  },
  computed: {
    isFavorite() {
      const favoriteFixtures = this.$store.getters.favoriteFixtures;
      return (
        this.$_.findIndex(
          favoriteFixtures,
          (e) => e === this.fixture.fixture_id
        ) > -1
      );
    },
    isMobile() {
      return this.$screenSize() === SCREEN_SIZE.MOBILE;
    },
  },
};
</script>

<style lang="scss">
.favorite-wrapper {
  display: flex;
  cursor: pointer;
  .bg-box {
    display: none;
  }
}
@media (max-width: $lg) {
  .favorite-wrapper {
    cursor: pointer;
    position: absolute;
    right: 0;
    border: none;
    top: 0;
    //height: calc(100% - 94px) !important;
    display: flex;
    flex-direction: column;
    align-items: center !important;
    border-right: none !important;
    // background: red;
    // background: #ffffff !important;
    padding: 0px !important;
    width: 57px;
    justify-content: space-between !important;
    background: linear-gradient(
      269.38deg,
      #ffffff 0.62%,
      rgba(255, 255, 255, 0.9) 99.56%
    ) !important;

    .star-icon {
      padding-top: 16px;
      // align-self: flex-end;
    }
    .bg-box {
      display: block;
      height: 56px;
      width: 100%;
    }
  }
}
</style>
