$(function(){
    //********** addModal 인터렉션 *********//
    $('.addModal-date').attr({
      'data-placeholder': `${today().monthToString} ${today().today}`,
      min: today().fullDate,
      value: today().fullDate
    });
    // 날짜 선택
    $('.addModal-date').on('change', function () {
      $(this).attr('data-placeholder', dateReplace($(this).val()));
    });
    // 모달 온오프
    $('#addModal').on('click', function () {
      $('.addModal').css('display', 'flex');
      $('.addModal #addModal-add').focus();
      return false;
    });
    $('.addModal-close').on('click', function () {
      $('.addModal').css('display', 'none');
      return false;
    });
    // 외부영역 클릭하면 닫히는 이벤트
    $(document).on('mouseup', e => {
      if ($('.addModal-bg').has(e.target).length == 0) {
        $('.addModal').css('display', 'none');
      };
    });
    // submit 이벤트
    $('.addModal-submit').on('click', function () {
      $('.addModal').css('display', 'none');
      let toDo = $('#addModal-add').val();
      let date = $('#addModal-date').val();
      let data = writeData(toDo, date)
      writeDB(data)
      modalReset()
      snackPopUp('add')
      return false;
    })
  
    // 모달창 리셋 함수
    function modalReset() {
      $('.addModal-add').val('');
      $('.addModal-date').val(today().fullDate).attr('data-placeholder', dateReplace(today().fullDate));
    }
    // 테스트용
    // $('.i-alert').click(function(){
    //   snackPopUp('add')
    // })
    // 스낵알람
    function snackPopUp(action) {
      $(`.snackBar.${action}`).clearQueue().stop().slideDown(300).delay(800).fadeOut(300)
    }
})

const today = function () {
  let date = new Date()
  let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  date = {
    fullDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    monthToString: month[date.getMonth()],
    today: date.getDate()
  }
  return date;
}