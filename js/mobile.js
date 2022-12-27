$(function(){
  console.log("제이쿼리 준비 완료")

  $('.nav-btn').on('click',function(){
    $('.nav').toggleClass('menuOn')
  })
 
  $('.idx-darkBtn').on('click',function(){
    $('.idx-footer-darkBtn').toggleClass('darkOn')
  })

  getDB()

  $('#content-container').on('click','.idx-chklist-delete',function(){
    let thisParents = $(this).closest('.idx-chklist-box');
    if(confirm('삭제하시겠습니까?')){
      thisParents.remove();
      id = thisParents.attr('data-id')
      delData(id)
    }
  });
//********* 제이쿼리 끝 *********//
})

const getDB = function(){
  var db = null;
  // indexedDB 오픈
  if(!window.indexedDB) {
    window.alert ("hamker does not work in this browser")
  } else {
    var request = window.indexedDB.open('Hamker');
    request.onsuccess = function(e){
      db = this.result;
      const toDoStore = db.transaction("toDo", "readonly").objectStore("toDo");
      toDoStore.onerror = function(e){
        console.log("DataBase Error: "+e.target.errorCode)
      }
      toDoStore.getAll().onsuccess = function(e){
        var result = e.target.result;
        return addToDo(result);
      };
    }
  }
}

let addToDo = function(d){
  let target = document.getElementById('content-container');
  let templete = '';
  target.innerHTML = '';
  for(var i in d){
    templete += `
    <div class="idx-chklist-box" data-complete="${d[i].complete}" data-regidate="${d[i].regiDate}" data-id="${d[i].id}">
      <input type="checkbox" name="chklist_${d[i].id}" id="chklist_${d[i].id}" class="idx-chklist-inpChk">
      <label for="chklist_${d[i].id}" class="idx-chklist-labelChk">${d[i].toDo}</label>
      <div class="idx-chklist-info">
        <span class="idx-chklist-goal">${d[i].targetDate}</span>
        <a href="#" class="idx-chklist-delete"><i class="ham-icons i-del">삭제하기</i></a>
      </div>
    </div>
    `
  }
  target.innerHTML = templete;
}

// 삭제하면 db에서도 삭제시키기
let delData = function(id){
  var db = null;
  var request = window.indexedDB.open('Hamker');

  request.onerror = function(e) {
    alert('hamker does not work in this browser');
  };
  request.onsuccess = function(e){
    db = this.result;
    target = parseInt(id)
    const toDoStore = db.transaction("toDo", "readwrite").objectStore('toDo')
    toDoStore.delete(target).onsuccess = function(e){
      getDB()
    };
  }
}