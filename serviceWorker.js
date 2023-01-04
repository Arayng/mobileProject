const sCacheName = "hamker";
const aFilesToCache = [
  './',
  './manifest.json', 
  './favicon.ico',
];

self.addEventListener("install", pEvent => {
      console.log("Service worker installed");
      pEvent.waitUntil(
        caches.open(sCacheName)
        .then(pCache => {
          console.log("Save file to cache done!");
          return pCache.addAll(aFilesToCache);
        })
      );
    });

self.addEventListener('activate', () => {
  console.log('Service worker operation started!');
});

self.addEventListener('fetch', pEvent => {
  pEvent.respondWith(
    caches.match(pEvent.request)
    .then(response => {
      if(!response){
        console.log("Requesting data over the network!", pEvent.request)
        return fetch(pEvent.request)
      }
      console.log("Request data from cache!", pEvent.request)
      return response;
    }).catch(err => console.log(err))
  );
});
    

