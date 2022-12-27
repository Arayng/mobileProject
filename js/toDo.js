$(function () {
  $('.chk-content-title h3').text(`${today().year}년 ${today().month}월 ${today().today}일`);
// 뒤로가기 버튼
  $('#backBtn').on('click',function(){
    history.back()
  })
//******** 체크리스트 인터렉션 ********//

// 리스트 삭제
  $('.chk-content-item').on('click','.chklist-delete',function(){
    let thisParents = $(this).closest('.chklist-wrap');
    if(confirm('삭제하시겠습니까?')){
      thisParents.remove();
      id = thisParents.attr('data-id')
      delData(id)
    }
  });

// 체크리스트 체크시 인터렉션
  $('.chk-content-item').on('change','.chklist-input',function(){
    $(this).next().toggleClass('complete');
  });

//******** addModal 인터렉션 ********//
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
    modalReset()
  });
  $('.addModal-close').on('click', function () {
    $('.addModal').css('display', 'none');
    modalReset()
  });
// 외부영역 클릭하면 닫히는 이벤트
  $(document).on('mouseup', e => {
    if ($('.addModal-bg').has(e.target).length == 0) {
      $('.addModal').css('display', 'none');
      modalReset()
    };
  });
// submit 이벤트
  $('.addModal-submit').on('click', function () {
    $('.addModal').css('display', 'none');
    let toDo = $('#addModal-add').val();
    let date = $('#addModal-date').val();
    let data = writeData(toDo,date)
    writeDB(data)
    modalReset()
  })

  // 모달창 리셋 함수
  function modalReset() {
    $('.addModal-add').val('');
    $('.addModal-date').val(today().fullDate).attr('data-placeholder', dateReplace(today().fullDate));
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

const dateReplace = function (e) {
  if (e == "") {
    value = "";
  } else {
    let date = new Date(e);
    let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OC', 'NOV', 'DEC'];
    value = `${month[date.getMonth()]} ${date.getDate()}`
  }
  return value;
}

//******** indexed DB ********//
window.onload = function() {
  installDB()
  getDB()
}
const installDB = function(){
  var db = null;
  if(!window.indexedDB) {
    window.alert ("hamker does not work in this browser")
  } else {
    var request = window.indexedDB.open('Hamker');
    request.onerror = function(e) {
      alert('hamker does not work in this browser');
    };
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      var objectStore = db.createObjectStore('toDo',{keyPath: 'id',autoIncrement: true})
      objectStore.createIndex("toDo", "toDo", { unique: false });
      objectStore.createIndex("regiDate", "regiDate", { unique: false })
      objectStore.createIndex("targetDate", "targetDate", { unique: false })
      objectStore.createIndex("complete", "complete", { unique: false })
      console.log('완료 onupgradeneeded')
    }
  }
}
// 데이터 쓰기
const writeDB = function(writeData) {
  var db = null;
  // indexedDB 오픈
  if(!window.indexedDB) {
    window.alert ("hamker does not work in this browser")
  } else {
    var request = window.indexedDB.open('Hamker');
    request.onerror = function(e) {
      alert('hamker does not work in this browser');
    };
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      var objectStore = db.createObjectStore('toDo',{keyPath: 'id',autoIncrement: true})
      objectStore.createIndex("toDo", "toDo", { unique: false });
      objectStore.createIndex("regiDate", "regiDate", { unique: false })
      objectStore.createIndex("targetDate", "targetDate", { unique: false })
      objectStore.createIndex("complete", "complete", { unique: false })
    }
    request.onsuccess = function(e){
      db = this.result;
      const toDoStore = db.transaction("toDo", "readwrite").objectStore("toDo");
      request = toDoStore.add(writeData);
      request.oncomplete = function(){
        alert('추가 완료')
      }
      toDoStore.onerror = function(e){
        console.log("DataBase Error: "+e.target.errorCode)
      }
      // getDB 호출해서 화면 새로고침하기
      getDB()
    }
  }
}
// db 데이터 가져오기
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
// db데이터 화면 출력하기
let addToDo = function(d){
  let target = document.getElementById('content-container');
  let templete = '';
  target.innerHTML = '';
  for(var i in d){
    templete += `
      <div class="chklist-wrap" data-complete="${d[i].complete}" data-regidate="${d[i].regiDate}" data-id="${d[i].id}">
        <div class="chklist-chkbox">
          <input type="checkbox" name="chklist_${d[i].id}" id="chklist_${d[i].id}" class="chklist-input">
          <label for="chklist_${d[i].id}" class="chklist-label">${d[i].toDo}</label>
        </div>
        <div class="chklist-info">
          <span class="chklist-goal">${d[i].targetDate}</span>
          <a href="#" class="chklist-delete"><i class="ham-icons i-del">삭제하기</i></a>
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



// 데이터 변환 -> 56번째 줄에서 사용
let writeData = function(t,d){
    return {
    toDo : t,
    regiDate : today().fullDate,
    targetDate : d,
    complete: 0
  };
}