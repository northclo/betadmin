import axios from "axios";
import { message } from "ant-design-vue";

import { config } from "@/config/index.js";

/**
 * @summary
 * This feature checks response of axios is success.
 * If result is success, return response data from backend and if result is failed, return error message.
 *
 * @param {function} fn
 */
const handleError =
  (fn) =>
  async (...params) => {
    try {
      return await fn(...params);
    } catch (error) {
      if (error.response) {
        message.error(`${error.response.data.message}`);
        return {
          status: false,
        };
      } else {
        message.error("Network error");
        return {
          status: false,
        };
      }
    }
  };

export const postData = handleError(async (url, data = {}) => {
  const res = await axios.post(`${config.baseURL}${url}`, data, {
    timeout: 5000,
  });

  return {
    status: true,
    message: res.data.message,
    data: res.data.data,
  };
});
