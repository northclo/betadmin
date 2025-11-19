import axios from "axios";
import { message } from "ant-design-vue";
import httpStatusCodes from 'http-status-codes';
import router from '@/Router'
import { config } from "@/config/index.js";
import { routeLink } from '@/utils/route-link.js';

const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currency');
  localStorage.removeItem('pass');
  localStorage.removeItem('permissions');
  localStorage.removeItem('partnerRole');
  
  try {
    const store = require('../store').default;
    if (store && store.commit) {
      store.commit('clearPermissions');
      store.commit('clearPartnerRole');
    }
  } catch (e) {
    console.error('Error clearing auth data:', e);
  }
};

const handleError =
  (fn) =>
    async (...params) => {
      try {
        return await fn(...params);
      } catch (error) {
        if (error.response) {
          // in the case of unautherized user
          if (error.response.status == httpStatusCodes.UNAUTHORIZED) {
            clearAuthData();
            router.push(routeLink.login.link);
            message.error(`${error.response.data.message}`);
          }
          // clearAuthData();
          // router.push(routeLink.login.link);
          // message.error(`${error.response.data.message}`);
          return {
            status: false,
          };
        } else {
          // clearAuthData();
          // router.push(routeLink.login.link);
          // message.error(enLang.no_response_from_server);
          return {
            status: false,
          };
        }
      }
    };

export const getData = handleError(async (url) => {
  let token = localStorage.getItem('token');
  console.log(`${config.baseURL}${url}`)

  const res = await axios.get(`${config.baseURL}${url}`, {
    headers: {
      authorization: token
    },
    timeout: 20000
  })

  return {
    status: true,
    message: res.data.message,
    data: res.data.data
  }
})

export const postData = handleError(async (url, data = {}) => {
  let token = localStorage.getItem('token');

  const res = await axios.post(`${config.baseURL}${url}`, data, {
    headers: {
      authorization: token
    },
    timeout: 20000,
  });

  return {
    status: true,
    message: res.data.message,
    data: res.data.data,
  };
});

export const putData = handleError(async (url, data = {}) => {
  let token = localStorage.getItem('token');

  const res = await axios.put(`${config.baseURL}${url}`, data, {
    headers: {
      authorization: token
    },
    timeout: 20000,
  });

  return {
    status: true,
    message: res.data.message,
    data: res.data.data,
  };
});

export const deleteData = handleError(async (url) => {
  let token = localStorage.getItem('token');

  const res = await axios.delete(`${config.baseURL}${url}`, {
    headers: {
      authorization: token
    },
    timeout: 20000
  })

  return {
    status: true,
    message: res.data.message,
    data: res.data.data,
  };
})
