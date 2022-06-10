<template>
  <div>
    <StrategyPreMatch
      strategy_mode="preset-alerts"
      :table_felds="table_fields"
    />
  </div>
</template>

<script>
import StrategyPreMatch from "~/components/sections/StrategyPreMatch";
export default {
  head() {
    return {
      title: this.$titles.pre_match_preset_strategies,
    };
  },
  data() {
    return {
      table_fields: ["hit_rate", "outcome", "status", "actions"],
    };
  },
  components: {
    StrategyPreMatch,
  },
};
</script>

<style></style>
