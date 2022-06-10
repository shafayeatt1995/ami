/* eslint-disable require-jsdoc */
function rounded_percentage(value, total) {
  return Math.round((value * 10000) / total) / 100;
}
function rounded_average(value, total) {
  return Math.round((value * 100) / total) / 100;
}

class H2HFormatter {
  constructor(fixtures) {
    this.fixtures = fixtures;
  }

  process_fixture(fixture) {
    let result = {
      home_id: fixture['localteam_id'],
      away_id: fixture['visitorteam_id'],
      home_name: fixture['localTeam']['data']['name'],
      away_name: fixture['visitorTeam']['data']['name'],
      winner: fixture['winner_team_id'],
      ht_score: fixture['scores']['ht_score'],
      score: fixture['scores']['ft_score'],
      home_goals: fixture['scores']['localteam_score'],
      away_goals: fixture['scores']['visitorteam_score'],
      date: fixture['time']['starting_at']['date'],
      time: fixture['time']['starting_at']['time'],
      date_time: fixture['time']['starting_at']['date_time'],
    };
    const partial = {
      home_win: result['winner'] == result['home_id'],
      away_win: result['winner'] == result['away_id'],
      draw: result['winner'] == null,
      total_goals: result['home_goals'] + result['away_goals'],
      btts: result['home_goals'] > 0 && result['away_goals'] > 0,
    };
    result = {...result, ...partial};
    result['over_15'] = result['total_goals'] >= 2;
    result['over_25'] = result['total_goals'] >= 3;
    result['events'] = [
      ...this.process_all_fixture_events(fixture, result['home_id']),
    ];
    return result;
  }
  *get_all_fixture_events(fixture) {
    for (const fixture_event_type of ['goal', 'corner']) {
      for (var fixture_event of fixture[fixture_event_type + 's']['data']) {
        if (
          fixture_event_type == 'corner' &&
          fixture_event['comment'].toLowerCase().includes('race to')
        ) {
          continue;
        }
        fixture_event['type'] = fixture_event_type;
        yield fixture_event;
      }
    }
    for (var fixture_event of fixture['events']['data']) {
      if (fixture_event['type'] == 'yellowcard') {
        yield fixture_event;
      }
    }
  }

  process_fixture_event(fixture_event, home_id) {
    const result = {
      id: fixture_event['id'],
      team: fixture_event['team_id'] == home_id ? 'home' : 'away',
      type: fixture_event['type'],
      minute: fixture_event['minute'],
      percentage: Math.round(
        Math.min((fixture_event['minute'] / 90) * 100, 100),
        2
      ),
    };
    return result;
  }
  *process_all_fixture_events(fixture, home_id) {
    const sorted_fixture_events = [...this.get_all_fixture_events(fixture)];
    console.log('this', sorted_fixture_events);
    sorted_fixture_events.sort(function (a, b) {
      const keyA = parseInt(a);
      const keyB = parseInt(b);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    for (const fixture_event of sorted_fixture_events) {
      yield this.process_fixture_event(fixture_event, home_id);
    }
  }
  *process_all_fixtures(fixtures) {
    for (const fixture of fixtures) {
      yield this.process_fixture(fixture);
    }
  }
  overall_stats(fixtures) {
    const games = fixtures.length;
    const processed_fixtures = [...this.process_all_fixtures(fixtures)];
    const keys = [
      'total_goals',
      'btts',
      'over_15',
      'over_25',
      'home_win',
      'away_win',
      'draw',
    ];
    const data = {};
    keys.forEach((key) => {
      data[key] = 0;
      for (const fixture of processed_fixtures) {
        data[key] += fixture[key];
      }
    });

    const totals = {
      games: games,
      total_goals: rounded_average(data['total_goals'], games),
      btts: rounded_percentage(data['btts'], games),
      over_15: rounded_percentage(data['over_15'], games),
      over_25: rounded_percentage(data['over_25'], games),
      home_win: rounded_percentage(data['home_win'], games),
      away_win: rounded_percentage(data['away_win'], games),
      draw: rounded_percentage(data['draw'], games),
    };
    return {
      results: processed_fixtures,
      totals: totals,
    };
  }
}

module.exports = H2HFormatter;
