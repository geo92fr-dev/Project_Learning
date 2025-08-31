import { d as derived, w as writable } from "./index.js";
const user = writable(null);
const loading = writable(false);
const error = writable(null);
const isAuthenticated = derived(
  user,
  ($user) => $user !== null
);
export {
  error as e,
  isAuthenticated as i,
  loading as l,
  user as u
};
