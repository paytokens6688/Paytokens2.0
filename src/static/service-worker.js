/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

self.importScripts('/_nuxt/google_sw/workbox-sw.js');
self.importScripts(
  '/_nuxt/precache-manifest.js'
);
self.workbox.setConfig({
  debug: false
});

self.workbox.core.setCacheNameDetails({
  prefix: 'paytoken',
  suffix: 'v3'
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
// 静态目录加动态目录
self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.workbox.strategies.cacheFirst();

self.workbox.precaching.precacheAndRoute(self.__precacheManifest);
