import { createStore } from "redux";

let store = null;

export const getStore = (reducer, enhancer) => {
  if (!store) {
    store = createStore(reducer, enhancer);
  }

  return store;
};