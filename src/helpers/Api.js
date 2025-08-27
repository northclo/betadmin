import axios from "axios";
// import { message } from "ant-design-vue";

import { config } from "@/config/index.js";

export const api = {
  login: async (payload) => {
    payload.email = payload.email.toLowerCase();
    const res = await axios.post(config.baseURL + "auth/", payload);
    return res.data;
  },
};
