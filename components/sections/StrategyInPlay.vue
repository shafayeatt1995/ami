<template>
  <div>
    <StrategyList
      :page_title="page_title"
      :page_description="page_description"
      strategy_type="in-play-alerts"
      :strategy_mode="strategy_mode"
    />
  </div>
</template>

<script>
import StrategyList from './StrategyList';
export default {
  props: {
    strategy_mode: String,
  },
  data() {
    return {
      page_title: 'InPlay Alerts',
      page_description:
        'Create unlimited InPlay Alerts to Automatically find Value Matches According to Your Conditions, or Import Preset Alerts Created by other Users',
      strategy_type: 'in-play-alerts',
    };
  },
  components: {
    StrategyList,
  },
};
</script>

<style></style>
