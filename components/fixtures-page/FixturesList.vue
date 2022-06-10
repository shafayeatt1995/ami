<template>
  <fixture-page :page_title="page_title" :page_description="page_description">
  </fixture-page>
</template>

<script>
import FixturePage from '../FixturePage';

export default {
  components: {
    FixturePage,
  },
  props: {
    page_title: String,
    page_description: String,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
// @use "sass:map";
</style>
