$(document).ready(function () {
  Calender();
  let targetDate = ($(".today").attr("data-date"));
  $(".acctb-calender td").on('click', function (e) {
    if (!$(this).hasClass("clickOn")) {
      $('.acctb-calender td').removeClass("clickOn");
    }
    target = $(this);
    target.addClass("clickOn");
    targetDate = target.attr("data-date");
    changeNote(targetDate)
  })

  $(".cont-close").on('click', function () {
    resizeWindow()
  });

  $(".acctb-day").on('dblclick', function () {
    date = $(this).attr('data-date')
    $(".acctb-modal-container").removeClass("modalOff");
  })

  $(".modal-close").on('click', function () {
    $(".acctb-modal-container").addClass("modalOff");
  })

  $(document).on('mouseup', e => {
    let modalPopup = $('.acctb-modal-container')
    if (modalPopup.has(e.target).length == 0) { // 클릭한 곳이 modal-popup이 아닌 경우
      modalPopup.addClass("modalOff");
    }
  })

  $(".modal-submit").on('click',function(){
    modalVali()
  })













  //***********  함수 모음  ***********//
  function Calender() {
    const today = new Date();
    const nYear = today.getFullYear();
    const nMonth = today.getMonth();
    const tBody = $('.acctb-calender tbody');
    const prev = new Date(nYear, nMonth, 0); // 이전 달
    const pDay = prev.getDay();
    const nfDate = new Date(nYear, nMonth, 1); // 이번달의 첫번째 날짜
    const nlDate = new Date(nYear, nMonth + 1, 0); // 이번달의 마지막 날짜
    const nWeek = Math.ceil((nfDate.getDay() + nlDate.getDate()) / 7);
    for (i = 1; i <= nWeek; i++) {
      tBody.append(`<tr></tr>`);
    };
    let tr = tBody.children();
    for (i = 0; i < nWeek; i++) {
      for (k = 0; k < 7; k++) {
        sDate = (pDay === 6) ? 1 + (i * 7) + k : -pDay + (i * 7) + k;
        sFullDate = new Date(nYear, nMonth, sDate);
        tdClass = [
          (sFullDate.getMonth() < nMonth || sFullDate.getMonth() > nMonth) ? " cellDisable" : "",
          (sameDate(sFullDate, today)) ? " today clickOn" : ""
        ];
        weekendChk = (sFullDate.getDay() === 0 || sFullDate.getDay() === 6) ? " weekend" : "";

        (tdClass == "cellDisable") ?
          tr.eq(i).append(
            `<td data-date="${dateFormat(sFullDate)}" class="acctb-day${weekendChk}${tdClass[0]}${tdClass[1]} clickOn">
            <div class="acctb-day-in">
              <span class="day-in-date">${sFullDate.getDate()}</span>
            </div>          
          </td>`
          ) :
          tr.eq(i).append(
            `<td data-date="${dateFormat(sFullDate)}" class="acctb-day${weekendChk}${tdClass[0]}${tdClass[1]}">
            <div class="acctb-day-in">
              <span class="day-in-date">${sFullDate.getDate()}</span>
              <div>
                <div class="day-in-income"><span>수입</span><i></i></div>
                <div class="day-in-expenses"><span>지출</span><i></i></div>
              </div>
            </div>          
          </td>`
          );
      };
    };
    // 년 월 입력
    $(".acctb-year h3").text(`${nYear}년 ${nMonth + 1}월`);
    $(".acctb-detail-date h3").text(`${nYear}년 ${nMonth + 1}월 ${today.getDate()}일`);
  };

  function dateFormat(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    return `${y}-${m}-${d}`;
  }
  function sameDate(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate())
  }
  function resizeWindow() {
    if ($(".acctb-content-right").hasClass("offContent")) {
      $(".acctb-content-right").stop().removeClass("offContent").animate({ width: "calc(100% - 1200px)" }, 400).show()
      $(".acctb-content-left").stop().animate({ width: "1200px" }, 400)
    } else {
      $(".acctb-content-right").stop().hide(400).addClass("offContent").animate({ width: 0 }, 700, 'linear')
      $(".acctb-content-left").stop().animate({ width: "100%" }, 400)
    }
  }

  function changeNote(date) {
    dateShow = date.split("-")
    $(".acctb-detail-date h3").text(`${dateShow[0]}년 ${dateShow[1]}월 ${dateShow[2]}일`)
  }

  function modalVali(){
    let category = $('#category').attr('data-selected');
    let type = $("#type").attr('data-selected');
    let amount = $('#input-amount').val();
    let memo = $('#input-memo').val();

    let focusing = (!category)? '#category':(!type)? '#type':(!amount)? '#input-amount':'#input-memo';
    $(focusing).on('blur',function(){
      $(this).removeClass('errFocus')
    })
    if(category && type && amount && memo){
      dataInput(category,type,amount,memo)
    }else{
      $(focusing).focus().addClass("errFocus");
    }
  }

  function dataInput(category,type,amount,memo){
    let wirteDate = {
      category : category,
      type : type,
      amount : amount,
      memo : memo
    }
  }
  // ************ 제이쿼리 끝 ************ //
});