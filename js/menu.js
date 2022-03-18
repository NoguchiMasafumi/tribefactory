const params_menu = new URLSearchParams(window.location.search);
var str_school=params_menu.get("school");
var str_year=params_menu.get("year");
var str_semester=params_menu.get("semester");
var str_weak=params_menu.get("weak");
var str_status=params_menu.get("status");
var str_digit=params_menu.get("digit");

if (str_school=="" && str_year==""){str_year=3};
if(str_weak==1){str_weak=""}else{str_weak=1}

if(str_status==null){str_status=''}
if(str_digit==null){str_digit=''}

document.write(
    "<a href='year_select.htm'>年</a>　",
"<span @click='view_toggle()'>s</span>",
    "<a href='index.htm?school="+str_school+"&year="+str_year+"&semester="+str_semester+"&weak="+str_weak+"&status="+str_status+"&digit="+str_digit+"'>表示切替</a>　",
    "学期　",
    "パス"
)