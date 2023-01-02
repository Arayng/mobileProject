$(function(){
  installDB()
  getDB()
  //******** 체크리스트 페이지 인터렉션 ********//
    
  // 체크리스트 체크시 인터렉션
  $('#content-container').on('change', '.idx-chklist-inpChk', function () {
    $(this).next().toggleClass('complete');
    let updateDataTarget = $(this).closest('.idx-chklist-box').attr('data-id')
    updateData(updateDataTarget)
  });

  // 삭제
  $('#content-container').on('click','.idx-chklist-delete',function(){
    let thisParents = $(this).closest('.idx-chklist-box');
    if(confirm('삭제하시겠습니까?')){
      thisParents.remove();
      id = thisParents.attr('data-id')
      delData(id)
      snackPopUp('del')
    }
  });

  //************************** addModal 인터렉션 **************************//
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

  function snackPopUp(action) {
    $(`.snackBar.${action}`).clearQueue().stop().slideDown(300).delay(800).fadeOut(300)
  }
//********* 제이쿼리 끝 *********//
})
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


const installDB = function(){
  var db = null;
  var request = window.indexedDB.open('Hamker');
  request.onerror = function(e) {
    alert('hamker does not work in this browser');
    console.log(e.target.errorCode)
  };
  request.onupgradeneeded = function(e) {
    db = request.result;
    let objectStore = db.createObjectStore('toDo',{keyPath: 'id',autoIncrement: true})
    objectStore.createIndex("toDo", "toDo", { unique: false });
    objectStore.createIndex("regiDate", "regiDate", { unique: false })
    objectStore.createIndex("targetDate", "targetDate", { unique: false })
    objectStore.createIndex("complete", "complete", { unique: false })
    console.log('indexedDB Loaded')
  }
}
let writeData = function (t, d) {
  return {
    toDo: t,
    regiDate: today().fullDate,
    targetDate: d,
    complete: 0
  };
}

// 데이터 쓰기
const writeDB = function (writeData) {
  var db = null;
  // indexedDB 오픈
  if (!window.indexedDB) {
    window.alert("hamker does not work in this browser")
  } else {
    var request = window.indexedDB.open('Hamker');
    request.onerror = function (e) {
      alert('hamker does not work in this browser');
    };
    request.onsuccess = function (e) {
      db = this.result;
      const toDoStore = db.transaction("toDo", "readwrite").objectStore("toDo");
      request = toDoStore.add(writeData);
      request.oncomplete = function () {

      }
      toDoStore.onerror = function (e) {
        console.log("DataBase Error: " + e.target.errorCode)
      }
      // getDB 호출해서 화면 새로고침하기
      getDB()
    }
  }
}
// 데이터 가져오기
const getDB = function () {
  var db = null;
  if (!window.indexedDB) {
    window.alert("hamker does not work in this browser")
  } else {
    var request = window.indexedDB.open('Hamker');
    request.onsuccess = function (e) {
      db = this.result;
      const toDoStore = db.transaction("toDo", "readonly").objectStore("toDo");
      toDoStore.onerror = function (e) {
        console.log("DataBase Error: " + e.target.errorCode)
      }
      toDoStore.getAll().onsuccess = function (e) {
        var result = e.target.result;
        return classifyData(result);
      };
    }
  }
}

// 데이터 분류
const classifyData = function (d) {
  let today = new Date().setHours(0, 0, 0, 0);
  let aliveData = [];
  let pastData = [];

  for (var i in d) {
    var targetDate = new Date(d[i].targetDate).setHours(0,0,0,0)
    if (targetDate >= today) {
      aliveData.push(d[i])
    } else {
      pastData.push(d[i])
    }
  }
  addToDo(aliveData)
}

let addToDo = function(d){
  let target = document.getElementById('content-container');
  let templete = '';
  target.innerHTML = '';
  for(var i in d){
    let complete = (d[i].complete == 1) ? 'complete' : '';
    let checked = (d[i].complete == 1) ? 'checked' : '';
    templete += `
    <div class="idx-chklist-box" data-complete="${d[i].complete}" data-regidate="${d[i].regiDate}" data-id="${d[i].id}">
      <input type="checkbox" name="chklist_${d[i].id}" id="chklist_${d[i].id}" class="idx-chklist-inpChk" ${checked}>
      <label for="chklist_${d[i].id}" class="idx-chklist-labelChk ${complete}">${d[i].toDo}</label>
      <div class="idx-chklist-info">
        <span class="idx-chklist-goal">${d[i].targetDate}</span>
        <a href="#" class="idx-chklist-delete"><i class="ham-icons i-del">삭제하기</i></a>
      </div>
    </div>
    `
  }
  target.innerHTML = templete;
}

// 데이터 삭제 - 개별
const delData = function(id){
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

// 데이터 업데이트(완료 체크 on&off)
const updateData = function (id) {
  var db = null;
  var request = window.indexedDB.open('Hamker');

  request.onerror = function (e) {
    alert('hamker does not work in this browser');
  };
  request.onsuccess = function (e) {
    db = this.result;
    target = parseInt(id);
    const toDoStore = db.transaction("toDo", "readwrite").objectStore('toDo');
    toDoStore.get(target).onsuccess = function (e) {
      var data = e.target.result;
      data.complete = (data.complete == 0)? 1:0;
      toDoStore.put(data)
    }
  }
}


const today = function () {
let date = new Date()
let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
date = {
  year: date.getFullYear(),
  month: ((date.getMonth() + 1) < 10)? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
  monthToString: month[date.getMonth()],
  today: (date.getDate() < 10)? '0'+date.getDate() : date.getDate(),
  fullDate: `${date.getFullYear()}-${((date.getMonth() + 1) < 10)? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${(date.getDate() < 10)? '0'+date.getDate() : date.getDate()}`,
}
return date;
}