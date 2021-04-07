import axios from "axios";
import { path } from "ramda";

const baseURL = 'http://54.180.141.109:8080'

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export const NETWORK_ERROR_CODE = 99999;
export const AUTH_ERROR_CODE = 1004;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const REQUEST_TIMEOUT = 408;
const INTERNAL_SERVER_ERROR = 500;
const GATEWAY_TIMEOUT = 504;

export function serializeParams (params) {
  const qs = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `?${qs}`;
}

export function apiGet (url, params, options = {}) {
  let u = url;

  if (params) {
    u = `${url}${serializeParams(params)}`;
  }

  return callApi(() => instance.get(u, options));
}

export function apiPost (url, params, options = {}) {
  return callApi(() => instance.post(url, params, options));
}

export function apiPut (url, params, options = {}) {
  return callApi(() => instance.put(url, params, options));
}

export function apiDelete (url, options = {}) {
  return callApi(() => instance.delete(url, options));
}

export function apiPatch (url, params, options = {}) {
  return callApi(() => instance.patch(url, params, options));
}

async function callApi (api) {
  try {
    const r = await api();

    return Promise.resolve(r.data);
  } catch (e) {
    const status = path(['response', 'status'])(e);
    const data = path(['response', 'data'])(e);

    if (e.code === 'ECONNABORTED') {
      // 타임아웃
      console.log('timeout!')
      // return Promise.reject(redirectTo('/timeout'));
    }

    switch (status) {
    case UNAUTHORIZED:
    case FORBIDDEN:
      break;

    case BAD_REQUEST:
    case INTERNAL_SERVER_ERROR:
    case NOT_FOUND:
      // 에러 코드에 따른 팝업
      // apiErrorHandler(data);
      return Promise.reject(data);

    case REQUEST_TIMEOUT:
    case GATEWAY_TIMEOUT:
      break;
      
    default:
      // 에러 코드에 따른 팝업
      // apiErrorHandler(data);
      return Promise.reject({code: NETWORK_ERROR_CODE, status});
    }
  }
}