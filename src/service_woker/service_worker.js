// Check that service workers are registered
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js');
  });
};
