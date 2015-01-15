var c = console;

var Mt = {
  dictMap : {
      tw: { "Login":"登入", "Logout":"登出", "Sign up":"申請帳號", "Help":"說明", "Language":"語言", "Home":"首頁",
	      "English":"英文", "English test":"單字測驗", "Translation":"翻譯", "Dictionary Editing":"字典編輯",
	      "Query":"查詢", "Save":"儲存", "Forget":"忘記", "queryResult":"查詢結果",
	      "correct":"正確", "wrong":"錯誤",
	      "Audio":"發音", "Submit":"送出", "Hint ! Press enter to submit, slash / to play audio!":"提示：按 Enter 送出答案, 按斜線 / 發音！", "The correct answer is: ":"正確的答案是：", "Start Testing":"開始測驗",
	      "Author":"作者", "License":"授權", "Email":"電子郵件", "Password":"密碼", "Remember me":"記住我", "User":"使用者", "Account":"帳號"
    },
    us: {}
  },
  lang:'tw',
}

Mt.dict=Mt.dictMap['tw'];

Mt.mt = function mt(e) {
  var v = Mt.dict[e];
  return (v===undefined)?e:v;
}

Mt.show = function show() {
  Mt.lang = window.localStorage["Mt_lang"];
  Mt.dict = Mt.dictMap[Mt.lang];
  $( "[data-mt]" ).each(function() {
    var e = $(this).data("mt");
    if ($(this).attr("placeholder") === undefined) {
      $(this).text(Mt.mt(e));
    } else {
      $(this).attr("placeholder", Mt.mt(e));
    }
  });
}

Mt.switchLang = function switchLang(pLang) {
  Mt.lang = pLang;
  Mt.dict = Mt.dictMap[Mt.lang];
  window.localStorage["Mt_lang"]=pLang;
  Mt.show();
}

var Account = {};

Account.init = function init() {
  c.log(window.localStorage);
  Mt.lang = window.localStorage['Mt_lang'];
  if (Mt.lang === undefined) Mt.lang='tw';
  Mt.switchLang(Mt.lang);
}

Account.login = function login(user, password) {
  window.localStorage["user"]=user;
  location.reload();
}

Account.logout = function logout() {
  delete window.localStorage["user"];
  location.reload();
}

var DB = { db: '', server: {} };

DB.set=function DB_set(name, obj) {
  window.localStorage.setItem(this.db+'.'+name, JSON.stringify(obj));
}

DB.get=function DB_get(name) {
  return window.localStorage.getItem(this.db+'.'+name);
}

DB.remove=function DB_remove(name) {
  window.localStorage.removeItem[this.db+'.'+name];
}


DB.getObj = function DB_getObj(name) {
   return JSON.parse(DB.get(name));
}

DB.server.load = function DB_server_load(name) {
  return $.ajax({
    type: "GET",
    url: "../db/"+DB.db+"/"+name,
    data: {}
  });
}

DB.server.save = function DB_server_save(name, obj) {
  $.ajax({
    type: "POST",
    url: "../db/"+DB.db+"/"+name,
    data: { obj: obj },
  })
  .done(function(data) {
    alert( "存檔完成!");
  })
  .fail(function() {
    alert( "存檔前請先登入！" );
  })
  .always(function() {
    //    alert( "complete" );
  });
}

DB.load = function DB_load(name,onSuccess) {
//   var obj = DB.getObj(name);
//   if (obj !==undefined) return obj;
   DB.server.load(name, function(text) {
     var obj = JSON.parse(text).obj;
     if (obj !==undefined) DB.set(name, obj);
     onSuccess(obj);
   });
}

DB.loadText = function DB_load(name,onSuccess) {
  return DB.server.load(name, function(text) {
    onSuccess(text);
  });
}

DB.save = function DB_save(name, obj) {
   DB.set(name, obj)
   DB.server.save(name, obj);
}


var Spa = {};

Spa.switchPanel = function switchPanel(name) {
  $(".panel" ).css( "display", "none" );
  $("#panel"+name).css("display", "block");
  $(".tab" ).removeClass("active");
  $("#tab"+name).addClass("active");
}
