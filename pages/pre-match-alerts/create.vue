<template>
  <div>
    <CreateStrategy
      v-model="form"
      :page_title="page_title"
      :strategy_type="strategy_type"
      :beginZero="true"
    />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

function initialPreMatchForm() {
  return {
    id: null,
    _id: null,
    title: "",
    strategy_prematch_rules: [],
    strategy_inplay_rules: [],
    outcome_id: null,
    needs_odds: false,
    is_public: true,
    timer: {
      minute: 15,
    },
    note: "",
    has_note: false,
    leagues: [],
  };
}
export default {
  head() {
    return {
      title: this.$titles.pre_match_create_strategy,
    };
  },
  data() {
    return {
      form: initialPreMatchForm(),
      page_title: "New PreMatch Strategy",
      strategy_type: "pre-match-alerts",
    };
  },
  components: {
    CreateStrategy,
  },
};
</script>

<style></style>
