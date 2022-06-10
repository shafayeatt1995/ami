<template>
  <StrategyDetails :navigation_links="navigation_links" type="in-play-alerts" />
</template>
<script>
import StrategyDetails from "~/components/strategy-details/StrategyDetails.vue";

export default {
  components: {
    StrategyDetails
  },
  data() {
    return {
      navigation_links: [
        {
          slug: "picks",
          label: "Picks",
          icon: "PicksIcon"
        },
        {
          slug: "leagues",
          label: "Leagues",
          icon: "TrophyIcon"
        }
      ]
    };
  }
};
</script>
