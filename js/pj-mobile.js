$(document).ready(function () {

  Calender();


























//***********  함수 모음  ***********//
function Calender() {
  const today = new Date();
  let nYear = today.getFullYear();
  let nMonth = today.getMonth();
  let tBody = $('.acctb-calender tbody');
  let prev = new Date(nYear, nMonth, 0); // 이전 달
  let pDay = prev.getDay();
  let nfDate = new Date(nYear, nMonth, 1); // 이번달의 첫번째 날짜
  let nlDate = new Date(nYear, nMonth + 1, 0); // 이번달의 마지막 날짜
  let nWeek = Math.ceil((nfDate.getDay() + nlDate.getDate()) / 7);
  $(".acctb-year h3").text(`${nYear}년 ${nMonth + 1}월`);
  for (i = 1; i <= nWeek; i++) {
    tBody.append(`<tr></tr>`);
  };
  let tr = tBody.children();
  for (i = 0; i < nWeek; i++) {
    for (k = 0; k < 7; k++) {
      sDate = (pDay === 6) ? 1 + (i * 7) + k : -pDay + (i * 7) + k;
      sFullDate = new Date(nYear, nMonth, sDate);
      tdClass = (sFullDate.getMonth() < nMonth || sFullDate.getMonth() > nMonth) ? "cellDisable" : "";
      weekendChk = (sFullDate.getDay() === 0 || sFullDate.getDay() === 6) ? "weekend" : "";
      (tdClass == "cellDisable") ?
        tr.eq(i).append(
          `<td data-date="${dateFormat(sFullDate)}" class="acctb-day${" "+weekendChk}${" "+tdClass}">
            <div class="acctb-day-in">
              <span class="day-in-date">${sFullDate.getDate()}</span>
            </div>          
          </td>`
        ) :
        tr.eq(i).append(
          `<td data-date="${dateFormat(sFullDate)}" class="acctb-day${" "+weekendChk}${" "+tdClass}">
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
};

function dateFormat(date){
  let y = date.getFullYear();
  let m = date.getMonth()+1;
  let d = date.getDate();

  return `${y}-${m}-${d}`
}

})
