// Matched static assets bypass this script (run_worker_first: false).
// Unmatched requests use the Static Assets binding's real 404 response.
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
