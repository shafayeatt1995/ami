<template>
  <GeneralPage
    page_title="Value Bets"
    class="value-bets"
    page_description="The Value Bets page uses sophisticated machine learning algorithms and statistical models to find imbalances between odds and stats in order to identify an edge against the bookies."
  >
    <template v-slot:howItWorks>
      <HowItWorks location="value-bets" />
    </template>

    <value-options v-model="odds_stack" @next-step="step += 1" v-if="step == 0">
    </value-options>
    <value-found
      :odds_stack="odds_stack"
      v-else-if="step == 1"
      @new-combo="step = 0"
    >
    </value-found>
  </GeneralPage>
</template>

<script>
import ValueOptions from "@/components/value-bets/value-options.vue";
import ValueFound from "@/components/value-bets/value-found.vue";

export default {
  head() {
    return {
      title: this.$titles.value_bets,
    };
  },
  data() {
    return {
      odds_stack: "1.5",
      step: 0,
    };
  },
  components: {
    ValueOptions,
    ValueFound,
  },
};
</script>
