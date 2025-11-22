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


const preTags = document.querySelectorAll('pre');
preTags.forEach(pre => {

        //****************** translation-tableだけは除外 ********************* */
        if (pre.closest('.translation-table')) {
            return;
        }


        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.className = 'copy-btn-auto'; // CSSクラスを付与

        button.addEventListener('click', () => {
                const code = pre.querySelector('code'); // preの中のcodeタグを取得
                const text = code.innerText;

                navigator.clipboard.writeText(text).then(() => {
                        button.innerText = 'Copied!';
                        setTimeout(() => { button.innerText = 'Copy'; }, 2000);
                });
        });
        pre.appendChild(button);
});

