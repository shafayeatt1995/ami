<template>
  <div>
    <CreateStrategy
      v-model="form"
      :page_title="page_title"
      :strategy_type="strategy_type"
      v-if="form"
    />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

export default {
  head() {
    return {
      title: this.$titles.in_play_edit_strategies,
    };
  },
  data() {
    return {
      form: null,
      page_title: "Edit InPlay Strategy",
      strategy_type: "in-play-alerts",
    };
  },
  mounted() {
    this.getFilter(this.$route.params.id);
  },
  methods: {
    async getFilter(id) {
      try {
        const params = { id };
        const filter = await this.$axios.$get("/user/strategies/id", {
          params,
        });
        this.$set(this, "form", filter);
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {
    CreateStrategy,
  },
};
</script>

<style></style>
