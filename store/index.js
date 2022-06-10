const {getPreMatchPreview, getInPlayPreview} = require('../functions/previews');

/**
 *
 * @param {array} rules
 * @return {object} obj
 */
function rulesAsObject(rules) {
  const group = {};
  rules.forEach((rule) => {
    const {_id} = rule;
    group[_id] = rule;
  });
  return group;
}

/**
 *
 * @param {*} array
 * @param {string} keyfield
 * @return {object} obj
 */
function arrayToObject(array, keyfield = 'value') {
  const obj = {};
  for (const i of array) {
    obj[i[keyfield]] = i;
  }
  return obj;
}

export const state = () => ({
  leagues: [], // {value: league.id, text: league["country_name"] + " • " + league["name"]}[]
  leagues_raw: [], // full league object
  pre_match_rules: null,
  in_play_rules: null,
  outcomes: null,
  countries: [], // {id: 147, _id: 147, iso: "AL", name: "Africa", leagues: {league_id: 711, league_name: "WC Qualification Africa"}[]}[]
  favorite_fixtures: [], // a list of fixture_id
  window_width: 0,
});

export const mutations = {
  SET_LEAGUES(state, leagues) {
    state.leagues = leagues;
  },
  SET_LEAGUES_RAW(state, leagues) {
    state.leagues_raw = leagues;
  },
  SET_PRE_MATCH_RULES(state, rules) {
    state.pre_match_rules = rules;
  },
  SET_IN_PLAY_RULES(state, rules) {
    state.in_play_rules = rules;
  },
  SET_OUTCOMES(state, outcomes) {
    state.outcomes = outcomes;
  },
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  SET_FAVORITE_FIXTURES(state, favorite_fixtures) {
    state.favorite_fixtures = favorite_fixtures;
  },
  SET_WINDOW_WIDTH(state, payload) {
    state.window_width = payload;
  },
};

export const actions = {
  async fetchLeagues({commit}) {
    try {
      const leagues_raw = await this.$axios.$get('/user/leagues');
      const leagues = leagues_raw.map((league) => {
        return {
          value: league.id,
          text: league['country_name'] + ' • ' + league['name'],
        };
      });
      commit('SET_LEAGUES', leagues);
      commit('SET_LEAGUES_RAW', leagues_raw);
      return leagues;
    } catch (error) {
      console.log(error);
    }
  },
  async fetchOutcomes({commit}, {is_bet_builder, type}) {
    try {
      const url = is_bet_builder
        ? '/user/bet-builders/outcomes'
        : '/user/outcomes';

      const outcomes = await this.$axios.$get(url, {params: {type}});
      commit('SET_OUTCOMES', outcomes);
    } catch (error) {
      console.log(error);
    }
  },
  async fetchPreMatchRules({commit}) {
    try {
      const rules = await this.$axios.$get('/user/rules/pre-match/');
      // console.log(rules);
      commit('SET_PRE_MATCH_RULES', rules);
    } catch (error) {
      console.log(error);
    }
  },

  async fetchInPlayRules({commit}) {
    try {
      const rules = await this.$axios.$get('/user/rules/in-play/');
      commit('SET_IN_PLAY_RULES', rules);
    } catch (error) {
      console.log(error);
    }
  },

  async fetchCountries({commit}) {
    try {
      const countries = await this.$axios.$get('/user/leagues/countries');
      commit('SET_COUNTRIES', countries);
    } catch (error) {
      console.log(error);
    }
  },

  async fetchFavoriteFixtures({commit}) {
    try {
      const favorite_fixtures = await this.$axios.$get(
        '/user/fixtures/favorite-fixtures'
      );
      commit('SET_FAVORITE_FIXTURES', favorite_fixtures);
    } catch (error) {
      console.log(error);
    }
  },

  async toggleFavoriteFixture({dispatch}, {fixture_id, addOrRemove}) {
    try {
      await this.$axios.$post('/user/fixtures/favorite-fixtures', {
        fixture_id,
        addOrRemove,
      });
      await dispatch('fetchFavoriteFixtures');
    } catch (error) {
      console.log(error);
    }
  },

  async clearFavoriteFixture({dispatch}) {
    try {
      await this.$axios.$delete('/user/fixtures/favorite-fixtures');
      await dispatch('fetchFavoriteFixtures');
    } catch (error) {
      console.log(error);
    }
  },
};

export const getters = {
  getPreMatchRuleById(state) {
    if (state.pre_match_rules) {
      return rulesAsObject(state.pre_match_rules);
    }
  },
  getInPlayRuleById(state) {
    if (state.in_play_rules) {
      return rulesAsObject(state.in_play_rules);
    }
  },
  getRuleById(state) {
    if (!state.in_play_rules && !state.pre_match_rules) {
      return null;
    }
    const in_play_rules = state.in_play_rules
      ? rulesAsObject(state.in_play_rules)
      : {};
    const pre_match_rules = state.pre_match_rules
      ? rulesAsObject(state.pre_match_rules)
      : {};
    return {...in_play_rules, ...pre_match_rules};
  },

  countries(state) {
    return state.countries;
  },
  leagues_raw(state) {
    return state.leagues_raw;
  },
  lookupLeaguesRaw(state) {
    return arrayToObject(state.leagues_raw, 'id');
  },
  is_pro_user(state) {
    const user = state.auth.user;
    if (user && user.subscription && user.subscription.trial != true) {
      return true;
    }
    return false;
  },
  is_seller(state) {
    return state.auth.user.is_seller === true;
  },
  is_expired(state) {
    const user = state.auth.user;
    return !user.subscription;
  },
  is_tester(state) {
    return (
      window.location.hostname == 'localhost' ||
      window.location.hostname == 'macbook.local' ||
      window.location.hostname == 'sandbox.footyamigo.com'
    );
  },
  getAvatar(state) {
    let avatar_id;
    if (state.auth && state.auth.user) {
      avatar_id = state.auth.user.avatar_id;
    } else {
      avatar_id = 0;
    }
    return `/svg/${avatar_id}.svg`;
  },
  outcome_choices(state) {
    return state.outcomes?.map((outcome) => {
      return {
        value: outcome._id,
        text: outcome.label,
      };
    });
  },
  // getInplayOutcomeOptions(state) {
  //   if (state.outcomes) {
  //     return state.outcomes
  //       .filter(
  //         (outcome) => outcome.type == 'in-play' || outcome.type == 'both'
  //       )
  //       .map((outcome) => {
  //         return {
  //           value: outcome._id,
  //           text: outcome.label,
  //         };
  //       });
  //   }
  // },
  // getPrematchOutcomeOptions(state) {
  //   if (state.outcomes) {
  //     return state.outcomes
  //       .filter(
  //         (outcome) => outcome.type == 'pre-match' || outcome.type == 'both'
  //       )
  //       .map((outcome) => {
  //         return {
  //           value: outcome._id,
  //           text: outcome.label,
  //         };
  //       });
  //   }
  // },
  previewPreMatch(state) {
    if (state.pre_match_rules) {
      return getPreMatchPreview(state.setting, state.pre_match_rules);
    }
  },
  previewInPlay(state) {
    if (state.in_play_rules) {
      return getInPlayPreview(state.setting_in_play, state.in_play_rules);
    }
  },
  subscriptionType(state) {
    if (state.auth.user && state.auth.user && state.auth.user.subscription) {
      if (state.auth.user.subscription.trial) {
        return 'trial';
      } else {
        return 'pro';
      }
    }
    // If user's subscription has expired, return null. user.subscription.end_date < Date.now()
    return null;
  },
  favoriteFixtures(state) {
    return state.favorite_fixtures;
  },
  window_width(state) {
    return state.window_width;
  },
  is_lg_screen(state) {
    return state.window_width > 992;
  },
};
