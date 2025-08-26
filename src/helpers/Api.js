import axios from "axios";
import { message } from "ant-design-vue";

import { config } from "@/config/index.js";

const handleError =
  (fn) =>
  async (...params) => {
    try {
      return await fn(...params);
    } catch (error) {
      if (error.response) {
        message.error(`${error.response.status}: ${error.response.statusText}`);
      } else {
        message.error("Network error");
      }
      // Re-throw if you want caller to handle it too
      throw error;
    }
  };

export const api = {
  login: handleError(async (payload) => {
    payload.email = payload.email.toLowerCase();
    const res = await axios.post(config.baseURL + "auth/", payload);
    return res.data;
  }),
};
