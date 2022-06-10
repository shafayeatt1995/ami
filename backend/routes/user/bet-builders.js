const express = require('express');
const router = express.Router();
// const { Op } = require("sequelize");
const {BetBuilder, Outcome, Fixture} = require('@backend/db');
const isProOrTrial = require('@backend/middlewares/isProOrTrial');

// const types = new Set(["last_25", "last_10", "last_7", "last_5"]);
const matches = new Set(['played_overall', 'played_home', 'played_away']);

const NodeCache = require('node-cache');
const myCache = new NodeCache({stdTTL: 600});

/**
 *
 * @param {object} rule
 * @param {string} type
 * @return {object}
 */
function parseBetBuilderRule(rule, type) {
  let {team, location, value, code, comparator, category} = rule;
  const equations = {
    '<=': '$lte',
    '>=': '$gte',
  };
  // console.log("TYPE", type);
  const equation = equations[comparator];
  let key;
  let last_x = '';
  switch (category) {
    case 'probability':
      key = `probability.${code}`;
      break;

    default:
      code = rule[location];
      if (type != 'all') {
        if (matches.has(code)) {
          value = type.split('_')[1];
        }
        last_x = type + '.';
      }

      if (team == 'both') {
        const home_key = `home.${last_x}${code}`;
        const away_key = `away.${last_x}${code}`;
        return {
          $and: [
            {[home_key]: {[equation]: Number(value)}},
            {[away_key]: {[equation]: Number(value)}},
          ],
        };
      } else {
        key = `${team}.${last_x}${code}`;
      }
  }
  const query = {[key]: {[equation]: Number(value)}};
  return query;
}
/**
 *
 * @param {object} rules
 * @param {string} type
 * @return {object}
 */
function parseBetBuilderRules(rules, type) {
  return rules.map((rule) => {
    return parseBetBuilderRule(rule, type);
  });
}

// async function fetchBetBuilderFixtures(query, outcome) {
//   const fixtures = await Fixture.fetchBetBuilders(query, outcome, limit);

//   return fixtures.map(fixture => getRequiredFixtureData(fixture, outcome));
// }

// function getRequiredFixtureData(fixture, outcome) {
//   const { fixture_id } = fixture;
//   const { pre_odds } = fixture;
//   return {
//     key: outcome + "_" + fixture_id,
//     [outcome]: pre_odds[outcome],
//     ...fixture
//   };
// }
/**
 *
 * @param {object} rules
 * @param {string} type
 * @return {object}
 */
function formatRules(rules, type) {
  const teams = {
    home: 'Home Team',
    away: 'Away Team',
    both: 'Both',
  };
  const locations = {
    home: 'H',
    away: 'A',
    overall: 'All',
  };
  const comparators = {
    '>=': '+',
    '<=': '-',
  };

  return rules.map((rule) => {
    let team;
    let location;
    let {id, label, code} = rule;
    let value = rule.value;
    if (rule.category == 'probability') {
      team = 'Probability';
      location = '';
      value = Math.round(value) + '%';
    } else {
      team = teams[rule.team];
      location = ` (${locations[rule.location]})`;
      if (code.endsWith('_per')) {
        value = Math.round(value) + '%';
      }
    }
    value += comparators[rule.comparator];
    if (type != 'all') {
      // console.log(label);
      if (label == 'Matches Played') {
        value = Number(type.split('_')[1]);
        label = 'Last Played';
      }
    }
    label += location;

    return [team, value, label, id];
  });
}

/**
 *
 * @param {string} type
 * @param {number} limit
 * @return {object}
 */
async function fetchBetBuilders(type, limit) {
  const cacheKey = 'bet_builders.' + type + '.' + limit;
  if (!myCache.has(cacheKey)) {
    const bet_builders = await BetBuilder.findActive();
    // console.log(JSON.stringify(bet_builders, null, 2));

    const bet_builders_formatted = [];
    for (const bet_builder of bet_builders) {
      const {rules, title, outcome, probabilities} = bet_builder;

      rules.push(...probabilities);
      const formatted = formatRules(rules, type);
      const query = parseBetBuilderRules(rules, type);
      // console.log(await fetchBetBuilderFixtures({ rules, rule_maps }))
      const fixtures = await Fixture.fetchBetBuilders(query, outcome, limit);
      // console.log(fixtures);
      bet_builders_formatted.push({
        title,
        outcome,
        rules: formatted,
        data: fixtures,
      });
    }
    // console.log("FORMATTED", bet_builders_formatted);
    const result = Object.assign(
      {},
      ...bet_builders_formatted.map((bet) => {
        return {[bet.outcome]: bet};
      })
    );
    myCache.set(cacheKey, result, 60);
  }
  return myCache.get(cacheKey);
}
router.use('/', isProOrTrial);

router.get('/', async (req, res) => {
  try {
    const {type} = req.query;
    let limit;
    if (req.user.is_trial) {
      limit = 2;
    }
    const bet_builders = await fetchBetBuilders(type, limit);
    res.json(bet_builders);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/outcomes', async function (req, res, next) {
  try {
    const outcomes = await Outcome.findBetBuilders();
    res.send(outcomes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({success: false, message: 'Interval server error occured'});
  }
});

module.exports = router;
