import axios from "axios";
import { path } from "ramda";
import { pushToast } from "../common/commonAction";
import { getStore } from "./storeUtils";

const baseURL = 'https://cauconnect.com/api'

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
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

export function apiPostBinary (url, binary, options = {}) {
  const data = new FormData();
  data.append('file', binary);

  const opt = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'multipart/form-data',
    },
  };

  return callApi(() => instance.post(url, data, opt));
}

async function callApi (api) {
  const {dispatch} = getStore()
  try {
    const r = await api();
    const data = path(['data', 'value'])(r);
    const message = path(['data', 'description'])(r);
    const isSuccess = path(['data', 'result'])(r);
    if(isSuccess) return Promise.resolve(data);
    return Promise.reject(message)
  } catch (e) {
    const status = path(['response', 'status'])(e);
    const message = path(['response', 'data', 'description'])(e);

    switch (status) {
    case NETWORK_ERROR_CODE:
      dispatch(pushToast('서버가 재부팅되었습니다.'))
      window.location.href = '/login'
      return 
    case UNAUTHORIZED:
    case FORBIDDEN:
      dispatch(pushToast('세션이 만료되었습니다.'))
      window.location.href = '/login'
      return 
    case BAD_REQUEST:
    case INTERNAL_SERVER_ERROR:
    case NOT_FOUND:
      return Promise.reject(message);
      
    default:
      return Promise.reject({code: NETWORK_ERROR_CODE, status});
    }
  }
}
