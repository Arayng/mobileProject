var mainPage = new Swiper(".mySwiper", {
  direction: 'horizontal',		// 가로 슬라이드
  slidesPerView: 1,			// 한 영역에 보이는 슬라이드 수
  pagination: {
    el: ".idx-cont-pager",
    clickable : true
  },
});