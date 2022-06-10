import axios from "axios";

class BASE_API {
  constructor(basePath) {
    this.baseUrl = "/api/user" + basePath;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    this.axios = axios;
  }

  fetchMany(page, per_page) {
    return axios.get(`${this.baseUrl}`, {
      headers: this.headers,
      params: { page: page - 1, per_page },
    });
  }

  fetchOne(id) {
    return axios.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  createOne(item) {
    return axios.post(`${this.baseUrl}`, item, {
      headers: this.headers,
    });
  }

  updateOne(item) {
    return axios.put(`${this.baseUrl}/${item.id}`, item, {
      headers: this.headers,
    });
  }

  deleteOne(id) {
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.headers,
    });
  }
}

export default BASE_API;
