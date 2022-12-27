$(function(){
  console.log("제이쿼리 준비 완료")

  $('.nav-btn').on('click',function(){
    $('.nav').toggleClass('menuOn')
  })
 
  $('.idx-darkBtn').on('click',function(){
    $('.idx-footer-darkBtn').toggleClass('darkOn')
  })

  indexToDo()
//********* 제이쿼리 끝 *********//
})
let indexToDo = function(d){
  let target = document.getElementById('content-container');
  let templete = '';
  target.innerHTML = '';
  for(var i in d){
    templete += `
    <div class="idx-chklist-box">
      <input type="checkbox" name="chklist_${}" id="chklist_${}" class="idx-chklist-inpChk">
      <label for="chklist_1" class="idx-chklist-labelChk">오늘 해야 할 일 1</label>
      <div class="idx-chklist-info">
        <span class="idx-chklist-goal">2022-12-26</span>
        <a href="#" class="idx-chklist-delete"><i class="ham-icons i-del">삭제하기</i></a>
      </div>
    </div>
    `
  }
  target.innerHTML = templete;
}
