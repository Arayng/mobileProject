
window.onload = function(){
  if(!window.indexedDB) {
    window.alert ("hamker does not work in this browser")
  } else {
    installDB()
  }
}
const installDB = function(){
  var db = null;
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