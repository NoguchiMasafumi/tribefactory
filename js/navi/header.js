const header_contents=`
        <div class="header-inner-upper">
            Tribe Factory<img src="https://tribefactory.netlify.app/img/TF20_min.png" class="h24" alt="Tribe Factory" style="margin-left:5px;">
            <!-- navi -->
        </div>
        <hr />
        <div class="header-inner-lower">
            トライブファクトリー
        </div>
`;
console.log("hi");
const elm_header = document.getElementById('header_container');
if (elm_header) {
  elm_header.innerHTML = header_contents;
}else{
  comsole.log("no");
;}

