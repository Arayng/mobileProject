$(document).ready(function () {
  Calender();
  let targetDate;
  $(".acctb-calender td").on('click',function(e){
    $('.acctb-calender td').removeClass("clickOn");
    target = $(e.target);
    target.addClass("clickOn");
    targetDate = (target.attr("data-date")).split("-");
    $(".acctb-detail-date h3").text(`${targetDate[0]}년 ${targetDate[1]}월 ${targetDate[2]}일`)
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
        (sameDate(sFullDate, today))? " today" : ""
      ];
      weekendChk = (sFullDate.getDay() === 0 || sFullDate.getDay() === 6) ? " weekend" : "";
      
      (tdClass == "cellDisable") ?
        tr.eq(i).append(
          `<td data-date="${dateFormat(sFullDate)}" class="acctb-day${weekendChk}${tdClass[0]}${tdClass[1]}">
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
                <div class="day-in-income"><span>수입</span><i>10,000</i></div>
                <div class="day-in-expenses"><span>지출</span><i>10,000</i></div>
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

function dateFormat(date){
  let y = date.getFullYear();
  let m = date.getMonth()+1;
  let d = date.getDate();

  return `${y}-${m}-${d}`;
}
function sameDate(date1, date2){
  return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate())
}
})
