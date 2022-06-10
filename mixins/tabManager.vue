<template>
  <div></div>
</template>

<script>
import PresetIcon from '~/static/icons/preset.svg';
import BellIcon from '~/static/icons/bell.svg';
import ExploreIcon from '~/static/icons/explore.svg';
import CalendarIcon from '~/static/icons/calendar.svg';
import TrophyIcon from '~/static/icons/trophy.svg';

export default {
  methods: {
    tabManager(strategy_type) {
      if (strategy_type === 'pre-match-alerts') {
        if (this.$store.getters.is_pro_user) {
          return [
            {label: 'Strategies', slug: '', icon: BellIcon},
            {label: 'Preset', slug: 'preset-alerts', icon: PresetIcon},
            {label: 'Explore', slug: 'explore-alerts', icon: ExploreIcon},
            {label: 'Upcomings', slug: 'upcomings', icon: CalendarIcon},
            {label: 'Leagues (All)', slug: 'league-all', icon: TrophyIcon},
          ];
        } else {
          return [
            {label: 'Strategies', slug: '', icon: BellIcon},
            {label: 'Preset', slug: 'preset-alerts', icon: PresetIcon},
            {label: 'Explore', slug: 'explore-alerts', icon: ExploreIcon},
            {label: 'Leagues (All)', slug: 'league-all', icon: TrophyIcon},
          ];
        }
      } else {
        if (this.$store.getters.is_pro_user) {
          return [
            {label: 'Strategies', slug: '', icon: BellIcon},
            {label: 'Preset', slug: 'preset-alerts', icon: PresetIcon},
            {label: 'Explore', slug: 'explore-alerts', icon: ExploreIcon},
            {label: 'Leagues (All)', slug: 'league-all', icon: TrophyIcon},
          ];
        } else {
          return [
            {label: 'Strategies', slug: '', icon: BellIcon},
            {label: 'Preset', slug: 'preset-alerts', icon: PresetIcon},
            {label: 'Explore', slug: 'explore-alerts', icon: ExploreIcon},
            {label: 'Leagues (All)', slug: 'league-all', icon: TrophyIcon},
          ];
        }
      }
    },
  },
};
</script>
