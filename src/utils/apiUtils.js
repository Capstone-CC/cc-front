import axios from "axios";
import { path } from "ramda";

const baseURL = 'http://3.36.250.224:8080'
// const baseURL = 'http://192.168.0.2:8080'

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export const NETWORK_ERROR_CODE = 99999;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

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
    console.log(r)
    return Promise.resolve(r.data);
  } catch (e) {
    console.log(e)
    const status = path(['response', 'status'])(e);
    const data = path(['response', 'data'])(e);

    switch (status) {
    case UNAUTHORIZED:
    case FORBIDDEN:
    case BAD_REQUEST:
    case INTERNAL_SERVER_ERROR:
    case NOT_FOUND:
      return Promise.reject(data);
      
    default:
      return Promise.reject({code: NETWORK_ERROR_CODE, status});
    }
  }
}