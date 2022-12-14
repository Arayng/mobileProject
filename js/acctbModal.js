$(function () {
  modalSelector()

  function modalSelector() {
    $(".modal-select-btn").on('click', function() {
      let modalOptionList = $(this).next();
      modalOptionList.toggleClass("active");
    })

  // 외부영역 클릭하면 닫히는 이벤트
    $(document).on('mouseup', e => {
      let modalSelect = $('.modal-select')
      let modalOptionList = $(".modal-option-list")
      if (modalSelect.has(e.target).length == 0) { // 클릭한 곳이 modalOptionList가 아닌 경우
        modalOptionList.removeClass("active");
      }
    })
    
    // 옵션 선택 시 이벤트
    $(".modal-option").on('click', function() {
      let modalSelect = $(this).closest($('.modal-select'))
      let modalOptionList = $(this).parent()
      let e = $(this).text();
      modalOptionList.prev().attr('data-selected', e).text(e); // 부모요소의 이전
      modalOptionList.removeClass("active"); // 부모요소
      modalSelect.css('background-color', '#ffae9141')
    })
  }
})