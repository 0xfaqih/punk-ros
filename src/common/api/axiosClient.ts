import axios from "axios";

import { config } from "@/config/config";
import { getAuthToken } from "@/features/auth/authStore";
import { faker } from "@faker-js/faker";

const getRandomUserAgent = (): string => faker.internet.userAgent();

export const axiosInstance = axios.create({
  baseURL: config.baseURL,
});

axiosInstance.interceptors.request.use(
  async (cfg) => {
    if (cfg.url?.endsWith("/user/login")) {
      return cfg;
    }
    const token = await getAuthToken();
    if (cfg.headers) {
      cfg.headers["User-Agent"] = getRandomUserAgent();
      cfg.headers["Origin"] = "https://testnet.pharosnetwork.xyz";
      cfg.headers["Content-Type"] = "application/json";
      cfg.headers["Referer"] = "https://testnet.pharosnetwork.xyz/";
      cfg.headers["Accept"] = "*/*";
      if (token) cfg.headers["Authorization"] = `Bearer ${token}`;
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);
