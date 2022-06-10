<template>
  <div>
    <StrategyPreMatch strategy_mode="explore-alerts" />
  </div>
</template>

<script>
import StrategyPreMatch from "~/components/sections/StrategyPreMatch";
export default {
  head() {
    return {
      title: this.$titles.pre_match_explore_strategies,
    };
  },
  components: {
    StrategyPreMatch
  }
};
</script>

<style></style>
