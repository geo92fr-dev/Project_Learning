const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/dashboard"))
    ;
  return resolve(event);
};
export {
  handle
};
