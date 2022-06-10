<template>
  <div>
    <CreateStrategy
      v-model="form"
      :page_title="page_title"
      :strategy_type="strategy_type"
    />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

function initialInPlayForm() {
  return {
    _id: null,
    title: "",
    strategy_prematch_rules: [],
    strategy_inplay_rules: [],
    leagues: [],
    outcome_id: null,
    needs_odds: false,
    is_public: true,
    timer: {
      time: "atMinuteX",
      from: 0,
      to: 45,
      minute: 45,
    },
    note: "",
    has_note: false,
  };
}

export default {
  head() {
    return {
      title: this.$titles.in_play_create_strategies,
    };
  },
  data() {
    return {
      form: initialInPlayForm(),
      page_title: "New InPlay Strategy",
      strategy_type: "in-play-alerts",
    };
  },
  components: {
    CreateStrategy,
  },
};
</script>

<style></style>
