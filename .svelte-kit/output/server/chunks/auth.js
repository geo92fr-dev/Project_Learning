import { w as writable } from "./index2.js";
const authStore = writable({
  user: null,
  loading: false,
  error: null
});
const currentUser = writable(null);
const isAuthenticated = writable(false);
authStore.subscribe((state) => {
  currentUser.set(state.user);
  isAuthenticated.set(!!state.user);
});
const user = currentUser;
const loading = writable(false);
authStore.subscribe((state) => {
  loading.set(state.loading);
});
export {
  authStore as a,
  currentUser as c,
  isAuthenticated as i,
  loading as l,
  user as u
};
