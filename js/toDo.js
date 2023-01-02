//******** indexed DB ********//
window.onload = function () {
  installDB()
  getDB()
}

$(function () {
  $('.chk-content-title h3').text(`${today().year}년 ${today().month}월 ${today().today}일`);
  // 뒤로가기 버튼
  $('#backBtn').on('click', function () {
    history.back()
    return false;
  })
  //******** 체크리스트 페이지 인터렉션 ********//

  // 리스트 삭제
  $('.chk-content-item, .miss-item').on('click', '.chklist-delete', function () {
    let thisParents = $(this).closest('.chklist-wrap');
    if (confirm('삭제하시겠습니까?')) {
      thisParents.remove();
      id = thisParents.attr('data-id')
      delData(id)
      snackPopUp('del')
    }
    return false
  });
  // 전체 삭제
  $('#removeAll').on('click',function(){
    if(confirm('모두 삭제 하시겠습니까?')){
      let id = [];
      let target = $('#miss-container').children();
      for(i=0;i<target.length;i++){
        id.push($(target[i]).attr('data-id'))
      }
      delAllData(id)
      snackPopUp('del')
    }
    
    return false
  })
  // 체크리스트 체크시 인터렉션
  $('.chk-content-item, .miss-item').on('change', '.chklist-input', function () {
    $(this).next().toggleClass('complete');
    let updateDataTarget = $(this).closest('.chklist-wrap').attr('data-id')
    updateData(updateDataTarget)
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

//************** 제이쿼리 끝 **************//  
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
// db 데이터 가져오기
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
  pastToDo(pastData)
  addToDo(aliveData)
}
// db데이터 화면 출력하기
const addToDo = function (d) {
  if(d.length == 0){
    let target = document.getElementById('content-container');
    let templete = `
      <div class="placeholder">
        <p>일정이 없습니다. 일정을 추가 해보세요.</p>
      </div>
    `
    target.innerHTML = templete
  } else {
    let target = document.getElementById('content-container');
    let templete = '';
    target.innerHTML = '';
    for (var i in d) {
      let complete = (d[i].complete == 1) ? 'complete' : '';
      let checked = (d[i].complete == 1) ? 'checked' : '';
      templete += `
        <div class="chklist-wrap"  data-id="${d[i].id}" data-rdate="${d[i].regiDate}" data-tdate="${d[i].targetDate}">
          <div class="chklist-chkbox">
            <input type="checkbox" name="chklist_${d[i].id}" id="chklist_${d[i].id}" class="chklist-input" ${checked}>
            <label for="chklist_${d[i].id}" class="chklist-label ${complete}">${d[i].toDo}</label>
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
}
const pastToDo = function (d) {
  if(d.length == 0){
    let target = document.getElementById('miss-container');
    let templete = `
      <div class="placeholder">
        <p>지난 일정이 없습니다.</p>
      </div>
    `
    target.innerHTML = templete
  } else {
    let target = document.getElementById('miss-container');
    let templete = '';
    target.innerHTML = '';
    for (var i in d) {
      let complete = (d[i].complete == 1) ? 'complete' : '';
      let checked = (d[i].complete == 1) ? 'checked' : '';
      templete += `
        <div class="chklist-wrap" data-id="${d[i].id}" data-rdate="${d[i].regiDate}" data-tdate="${d[i].targetDate}">
        <div class="chklist-chkbox">
          <i class="chklist-warning ham-icons i-warning i-static"></i>
          <input type="checkbox" name="chklist_${d[i].id}" id="chklist_${d[i].id}" class="chklist-input" ${checked}>
          <label for="chklist_${d[i].id}" class="chklist-label ${complete}">${d[i].toDo}</label>
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
}
// 데이터 삭제 - 개별
let delData = function (id) {
  var db = null;
  var request = window.indexedDB.open('Hamker');

  request.onerror = function (e) {
    alert('hamker does not work in this browser');
  };
  request.onsuccess = function (e) {
    db = this.result;
    target = parseInt(id)
    const toDoStore = db.transaction("toDo", "readwrite").objectStore('toDo')
    toDoStore.delete(target).onsuccess = function (e) {
      getDB()
    };
  }
}
// 데이터 삭제 - 전체
let delAllData = function (id) {
  var db = null;
  var request = window.indexedDB.open('Hamker');

  request.onerror = function (e) {
    alert('hamker does not work in this browser');
  };
  request.onsuccess = function (e) {
    db = this.result;
    const toDoStore = db.transaction("toDo", "readwrite").objectStore('toDo')
    for(var i in id){
      target = parseInt(id[i])
      toDoStore.delete(target).onsuccess = function (e){
        getDB()
      }
    }
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