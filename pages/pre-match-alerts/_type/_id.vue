<template>
  <StrategyDetails :navigation_links="navigation_links" type="pre-match-alerts" />
</template>
<script>
import StrategyDetails from "~/components/strategy-details/StrategyDetails.vue";

export default {
  components: {
    StrategyDetails,
  },
  data() {
    return {
      navigation_links: [
        {
          slug: "track",
          label: "Track",
          icon: "PicksIcon",
        },
        {
          slug: "results",
          label: "Results",
          icon: "ResultsIcon",
        },
        {
          slug: "upcoming",
          label: "Upcoming",
          icon: "CalendarIcon",
        },
        {
          slug: "picks",
          label: "Picks",
          icon: "PicksIcon",
        },
        {
          slug: "leagues",
          label: "Leagues",
          icon: "TrophyIcon",
        },
      ],
    };
  },
};
</script>
