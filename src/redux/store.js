import { configureStore } from "@reduxjs/toolkit";
import requestsReducer from "./slices/requests";
import cardsReducer from "./slices/cards";

function loadState() {
  try {
    const serializedState = localStorage.getItem("appState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return console.error("Failed to load state from localStorage", err);
  }
}

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    requests: requestsReducer,
  },
  preloadedState: loadState(),
});
