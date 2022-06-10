<template>
  <div>
    <div class="footy-page-container middle-only">
      <div>
        <footy-dropdown-select
          v-model="selectedCategory"
          :options="categories"
          label="Select PreMatch Category"
          id="categories"
          class="mb-4"
        >
        </footy-dropdown-select>

        <footy-dropdown-select
          v-model="selectedStat"
          :options="statsOptions"
          label="Stats for"
          id="stats_for"
          class="mb-4"
          v-if="selectedCategory == 'h2h'"
        >
        </footy-dropdown-select>

        <footy-dropdown-select
          v-model="setting.rule_id"
          :options="prematchRulesOptions"
          id="options"
          label="Select PreMatch Stat"
          class="mb-4"
          info="Select the prematch stat you want to create an alert for e.g Games Played, Over / Under Occurrences, Goals Scored, etc.  "
          placeholder="Select a rule"
        >
        </footy-dropdown-select>

        <PreMatchRuleEditor v-model="setting"> </PreMatchRuleEditor>
        <!-- <input type="hidden" v-model="preview" /> -->
      </div>
    </div>
    <LivePreview
      @nextstep="$emit('nextstep')"
      @addRule="addRule"
      v-model="form"
      :strategy_type="strategy_type"
      :rulesCount="rulesCount"
      :preview="preview"
    >
    </LivePreview>
  </div>
</template>

<script>
import PreMatchRuleEditor from './PreMatchRuleEditor.vue';
import LivePreview from './LivePreview';
function initialPreMatchSetting() {
  return {
    rule_id: '61ee94f00a8dcd4cc1bfc653',
    values: [0, 6],
    comparator: '=',
    value: 1,
    team: 'home',
    location: 'home',
  };
}

export default {
  name: 'PreMatchRules',
  props: {
    category: {type: String, default: 'general'},
    value: Object,
    strategy_type: {type: String, default: 'pre-match-alerts'},
  },

  data() {
    return {
      setting: initialPreMatchSetting(),
      selectedCategory: 'general',
      selectedStat: 'all',
      statsOptions: [
        {value: 'all', text: 'All Games'},
        {value: 'last_5', text: 'Last 5 Games'},
        {value: 'last_10', text: 'Last 10 Games'},
      ],
      categories: [
        {value: 'general', text: 'General', image: '/vectors/general.svg'},
        {value: 'goals', text: 'Goals', image: '/vectors/goals.svg'},
        {
          value: 'streak',
          text: 'Streak',
          image: '/vectors/streak.svg',
        },
        {
          value: 'h2h',
          text: 'Head to Head',
          image: '/vectors/h2h.svg',
          new: true,
        },
        {value: 'half', text: 'Half', image: '/vectors/half.svg'},
        {value: 'corners', text: 'Corners', image: '/vectors/corners.svg'},
        {value: 'cards', text: 'Cards', image: '/vectors/cards.svg'},
        {value: 'odds', text: 'Odds', image: '/vectors/odds.svg'},

        {
          value: 'probability',
          text: 'Probability',
          image: '/vectors/probability.png',
        },
      ],
    };
  },
  components: {
    PreMatchRuleEditor,
    LivePreview,
  },
  watch: {
    selectedCategory: {
      immediate: true,
      handler() {
        const rules = this.filteredPrematchRules;

        if (rules) {
          const {_id, min, max} = rules[0];
          Object.assign(this.setting, {values: [min, max], rule_id: _id});
        }
      },
    },
  },
  methods: {
    addRule() {
      this.form.strategy_prematch_rules.push(this.$jsonify(this.setting));
    },
  },
  mounted() {
    this.selectedCategory = this.category;
  },
  computed: {
    filteredPrematchRules() {
      return Object.values(this.preMatchRules).filter(
        (x) => x.category == this.selectedCategory
      );
    },
    preMatchRules() {
      return this.$store.state.pre_match_rules;
    },
    prematchRulesOptions() {
      const options = this.filteredPrematchRules.map((rule) => {
        const {_id: value, label: text, code} = rule;
        return {
          value,
          text,
          code,
        };
      });
      console.log(this.selectedCategory);
      if (this.selectedCategory == 'h2h') {
        console.log(this.selectedStat, options);
        switch (this.selectedStat) {
          case 'last_5':
            return options.filter((option) => option.code.startsWith('last_5'));
          case 'last_10':
            return options.filter((option) =>
              option.code.startsWith('last_10')
            );
          default:
            return options.filter((option) => !option.code.startsWith('last_'));
        }
      }
      return options;
    },

    rulesCount() {
      return this.form.strategy_prematch_rules.length;
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    preview() {
      const preview = this.$getPreMatchPreview(
        this.setting,
        this.$store.getters.getPreMatchRuleById
      );
      // this.$emit("changePreview", preview);
      return preview;
    },
  },
};
</script>
