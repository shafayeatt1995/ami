// head() {
//   return {
//     title: this.title,
//     meta: [
//       // hid is used as unique identifier. Do not use `vmid` for it as it will not work
//       {
//         hid: 'description',
//         name: 'description',
//         content: 'My custom description'
//       }
//     ]
//   }
// }

// Main Dashboard - https://dashboard.footyamigo.com/dashboard

// PreMatch Alerts - https://dashboard.footyamigo.com/pre-match-alerts

// InPlay Alerts - https://dashboard.footyamigo.com/in-play-alerts

// Fixtures - https://dashboard.footyamigo.com/fixtures

// Streaks - https://dashboard.footyamigo.com/streaks

// Betting Systems - https://dashboard.footyamigo.com/betting-systems

// Bet Builder - https://dashboard.footyamigo.com/bet-builder

// Payment Success - http://dashboard.footyamigo.com/payment/success
const title_suffix = " | FootyAmigo";
const titles = {
  dashboard: "Main Dashboard" + title_suffix,
  fixtures: "Fixtures" + title_suffix,
  streaks: "Streaks" + title_suffix,
  betting_systems: "Betting Systems" + title_suffix,
  bet_builder: "Bet Builder" + title_suffix,
  payment_success: "Payment Success" + title_suffix,
  payment_failed: "Payment Failed" + title_suffix,
  payment_status: "Payment Status" + title_suffix,
  login: "Login" + title_suffix,
  signup: "Signup" + title_suffix,
  forgot: "Forgot" + title_suffix,
  change_password: "Change Password" + title_suffix,
  pre_match_strategies: "Pre-Match Strategies" + title_suffix,
  in_play_strategies: "In-Play Strategies" + title_suffix,
  pre_match_explore_strategies: "Pre-Match Explore Strategies" + title_suffix,
  in_play_explore_strategies: "In-Play Explore Strategies" + title_suffix,
  pre_match_preset_strategies: "Pre-Match Preset Strategies" + title_suffix,
  in_play_preset_strategies: "In-Play Preset Strategies" + title_suffix,
  pre_match_create_strategy: "Pre-Match Create Strategy" + title_suffix,
  in_play_create_strategy: "In-Play Create Strategy" + title_suffix,
  pre_match_edit_strategy: "Pre-Match Edit Strategy" + title_suffix,
  in_play_edit_strategy: "In-Play Edit Strategy" + title_suffix,
  value_bets: "Value Bets" + title_suffix,
  profile: (type) => {
    return `${type}` + title_suffix;
  },
};

export default titles;
