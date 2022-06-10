import BASE_API from "./base-api";
class API extends BASE_API {
  constructor() {
    super("/value-bets");
  }
  fetchCombo(skip, odds_stack) {
    return this.axios.get(`${this.baseUrl}`, { params: { odds_stack, skip } });
  }
}
export const ValueBetsApi = new API();
