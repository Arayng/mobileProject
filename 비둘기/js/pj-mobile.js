$(document).ready(function () {
  Calender();
  total();

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
// 상세보기 접기
  $(".cont-close").on('click', function () {
    onOffDetail('btn')
  });
// 상세보기 열기
  $(".acctb-day").on('dblclick', function () {
    onOffDetail('dblclick')
  })
  $(".plus").on('click',function(){
    date = $('.clickOn').attr('data-date')
    $(".acctb-modal-container").removeClass("modalOff");
  })
// 모달 닫기
  $(".modal-close").on('click', function () {
    $(".acctb-modal-container").addClass("modalOff");
  })

  $(document).on('mouseup', e => {
    let modalPopup = $('.acctb-modal-container')
    if (modalPopup.has(e.target).length == 0) { // 클릭한 곳이 modal-popup이 아닌 경우
      modalPopup.addClass("modalOff");
    }
  })

  $("#record").on('click',function(){
    modalVali();
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
                <div class="day-in-total"><span>-</span></div>
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
  function onOffDetail(e) {
    if (e == 'dblclick') {
      // 상세보기
      $(".acctb-content-right").stop().show().removeClass("offContent")
      $(".acctb-content-left").stop().animate({ width: "1200px" }, 400)
    } else {
      // 상세보기 닫기
      $(".acctb-content-right").stop().hide(200).addClass("offContent")
      $(".acctb-content-left").stop().animate({ width: "100%" }, 700)
    }
  }
  function changeNote(date) {
    dateShow = date.split("-")
    $(".acctb-detail-date h3").text(`${dateShow[0]}년 ${dateShow[1]}월 ${dateShow[2]}일`)
  }
  function modalVali(){
    let type = $("#type").attr('data-selected');
    let category = $('#category').attr('data-selected');
    let amount = $('#input-amount').val();
    let memo = $('#input-memo').val();

    let focusing = (!type)? '#type':(!category)? '#category':(!amount)? '#input-amount':'#input-memo';
    $(focusing).on('blur',function(){
      $(this).removeClass('errFocus')
    })
    if(category && type && amount && memo){
      let t = (type == '수입')? 'income':'expend';
      let c = (category == '카드')? 'card':'cash'; 
      let inputDate = {
        type : t,
        category : c,
        amount : numToMoney(amount),
        memo : memo,
      }

      $(`.acctb-detail-${inputDate.type}`).append(
        `<div class="detail-item" data-category="${inputDate.category}" data-type="${inputDate.type}">
            <div class="${inputDate.type}-detail-reason">
              <b class="detail-name">${memo}</b>
              <p class="detail-category">${category}</p>
            </div>
            <div class="${inputDate.type}-detail-amount">
              <span class="${inputDate.type}-detail detail-amount">${inputDate.amount}</span>
              <p class="${inputDate.type}-detail-unit">원</p>
            </div>
          </div>`
      )
      total('re',inputDate.type)
      let clickOn = $(".clickOn").find('.day-in-total');
      clickOn = clickOn.find('span')
      let inc = Number(moneyToNum($(".acctb-summary-income .summary-total").text()));
      let exp = Number(moneyToNum($(".acctb-summary-expend .summary-total").text()));
      (inc-exp == 0)? clickOn.text('-'):(inc-exp > 0)? clickOn.css({color:'#5694f0'}).text(`+ ${numToMoney(inc-exp)}`):clickOn.css({color:'#f7323f'}).text(`- ${numToMoney(exp - inc)}`)
      $('.acctb-modal-container').addClass('modalOff');
    }else{
      $(focusing).focus().addClass("errFocus");
    }
  }
  function total(e,type) {
    switch (e){
      case 're' :
        let cardTotal = totalCalc(type,'card')
        let cashTotal = totalCalc(type,'cash')
        $(`.acctb-summary-${type} .summary-total`).text(numToMoney(cardTotal + cashTotal));
        $(`.acctb-summary-${type} .card`).text(numToMoney(cardTotal));
        $(`.acctb-summary-${type} .cash`).text(numToMoney(cashTotal));
      break;

      default: 
        let iCardTotal = totalCalc('income','card')
        let iCashTotal = totalCalc('income','cash')
    
        $(".acctb-summary-income .summary-total").text(numToMoney(iCardTotal + iCashTotal));
        $(".acctb-summary-income .cash").text(numToMoney(iCashTotal));
        $(".acctb-summary-income .card").text(numToMoney(iCardTotal));
    
        let eCardTotal = totalCalc('expend','card')
        let eCashTotal = totalCalc('expend','cash')
    
        $(".acctb-summary-expend .summary-total").text(numToMoney(eCardTotal + eCashTotal));
        $(".acctb-summary-expend .cash").text(numToMoney(eCashTotal));
        $(".acctb-summary-expend .card").text(numToMoney(eCardTotal));
      break;
    }
  }
  function totalCalc(type, category){
    calcTarget = $(`.detail-item[data-type='${type}'][data-category='${category}']`)
    result = 0;
    for(i=0;i<calcTarget.length;i++){
      result += Number(moneyToNum(calcTarget.eq(i).find(".detail-amount").text()))
    }
    return result;
  }
  function numToMoney(input){
    if(input >= 0){
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
  function moneyToNum(input){
    return input.replace(/,/g, '');
  }
  // ************ 제이쿼리 끝 ************ //
});