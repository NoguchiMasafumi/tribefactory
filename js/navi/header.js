const header_contents=`
        <div class="header-inner-upper">
            Tribe Factory<img src="https://tribefactory.netlify.app/img/TF20_min.png" class="h24" alt="Tribe Factory" style="margin-left:5px;">
            <!-- navi -->
            <div style=display:inline;margin-left:100px;>top</div>
        </div>
        <hr />
        <div class="header-inner-lower">
            トライブファクトリー1
        </div>
`;
console.log("hi");
const elm_header = document.getElementById('header_container');
if (elm_header) {
  elm_header.innerHTML = header_contents;
}else{
  console.log("no");
}




