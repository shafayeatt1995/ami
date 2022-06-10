<template>
  <div>
    <StrategyList
      :page_title="page_title"
      :page_description="page_description"
      strategy_type="pre-match-alerts"
      :strategy_mode="strategy_mode"
      :table_fields="table_fields"
    />
  </div>
</template>

<script>
import StrategyList from './StrategyList';
export default {
  props: {
    strategy_mode: String,
    table_fields: Array,
  },
  data() {
    return {
      page_title: 'PreMatch Alerts',
      page_description:
        'Create unlimited PreMatch Alerts to Automatically find Value Matches According to Your Conditions, or Import Preset Alerts Created by other Users',
      strategy_type: 'pre-match-alerts',
    };
  },
  components: {
    StrategyList,
  },
};
</script>

<style></style>
