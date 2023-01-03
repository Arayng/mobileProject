const sCacheName = "hamker"; // 캐시 제목
const aFilesToCache = [ // 캐시할 파일 지정
  './',
  './manifest.json', 
  './favicon.ico',
];
// 서비스워커 실행 & 캐시파일 저장
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

// 고유 번호 할당받은 서비스 워커 동작 시작
self.addEventListener('activate', pEvent => {
  console.log('Service worker operation started!');
});

// 고유 번호를 할당 받은 서비스워커 작동
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
    