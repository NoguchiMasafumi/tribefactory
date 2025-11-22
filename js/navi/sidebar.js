/**
 * sidebar_sitemap.js
 * Purpose: Initializes sidebar with static content and appends dynamic sitemap links with folder headers.
 */

(function () {
    'use strict';

    // --- 1. Static Content Definition ---
    const STATIC_CONTENTS = `
1<br />
tool<br> 
blog<br> 
bookmarklet<br> 
play_ground<br> 
saved_web<br> 
<br />
`;

    // --- 2. Configuration & Element Setup ---
    const OUTPUT_ELEMENT_ID = 'sidebar_container'; 
    const JSON_URL = 'https://tribefactory.netlify.app/js/sitemap/file_structure.json';
    const SITE_ROOT_FOLDER_NAME = 'tribefactory-main'; 
    const EXCLUDED_EXTENSIONS = [
        '.jpg', '.png', '.svg', '.xml', '.css', '.json', '.webmanifest', '.ico', '.ダウンロード', '.js','.ps1','.bat'
    ];
    
    // 出力要素を取得
    const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);

    // 要素が存在しない場合は処理を中断
    if (!outputElement) {
        console.error('Sitemap Error: Output element with ID "' + OUTPUT_ELEMENT_ID + '" not found.');
        return;
    }
    
    // 最初のステップ: 静的コンテンツを挿入
    outputElement.innerHTML = STATIC_CONTENTS; 

    // --- 3. Helper Functions ---
    
    function isExcluded(fileName) {
        const lowerName = fileName.toLowerCase();
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }
    
    function getRelativePathFromFullName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) {
            return normalizedPath; 
        }
        
        const startIndex = rootIndex + SITE_ROOT_FOLDER_NAME.length + 1;
        
        if (startIndex >= normalizedPath.length) {
            return ''; 
        }

        const relative = normalizedPath.substring(startIndex);
        return '/' + relative;
    }

    // --- 4. Logic for Links Generation ---

    /**
     * Generates a link list grouped by top-level folders.
     */
    function generateLinks(data) {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');
        // 見出しを見やすくするための簡易CSS（必要に応じてstyle.css等に移動してください）
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';

        // [重要] フォルダごとにまとめるため、パス順でソートします
        const sortedData = data.sort((a, b) => {
            const pathA = a.FullName.replace(/\\/g, '/').toLowerCase();
            const pathB = b.FullName.replace(/\\/g, '/').toLowerCase();
            return pathA < pathB ? -1 : pathA > pathB ? 1 : 0;
        });

        let lastFolder = null; // 直前に処理した第一階層フォルダ名を記録

        sortedData.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            
            if (rootAbsolutePath === '') return;

            // --- 階層グループ化ロジック ---
            // パスを分解 (例: /blog/2023/page.html -> ["", "blog", "2023", "page.html"])
            const pathParts = rootAbsolutePath.split('/');
            
            // 第一階層のフォルダ名を取得
            // pathParts[1] が "blog" や "tool" に該当します
            // ルート直下のファイルの場合はファイル名が入るため、フォルダ扱いしないように区別します
            let currentFolder = 'Root'; // デフォルト（ルート直下）
            
            if (pathParts.length > 2) { 
                // スラッシュで分割して3要素以上ある＝フォルダの中にあるファイル
                // ["", "tool", "file.html"] (length 3)
                currentFolder = pathParts[1]; 
            }

            // フォルダが変わったタイミングで見出し(li)を挿入
            if (currentFolder !== lastFolder) {
                const headerLi = document.createElement('li');
                
                // 見出しのデザイン調整
                headerLi.style.fontWeight = 'bold';
                headerLi.style.marginTop = '10px';
                headerLi.style.color = '#666'; // グレー文字など
                headerLi.style.borderBottom = '1px solid #ccc'; // 下線など
                
                headerLi.textContent = `📂 ${currentFolder}`; // 見出しテキスト
                ul.appendChild(headerLi);

                lastFolder = currentFolder; // 記録を更新
            }
            // ---------------------------

            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = rootAbsolutePath; 
            // 見出しがあるので、リンクテキストはファイル名だけでも良いですが、
            // もとの要望に合わせて「直上のフォルダ名/ファイル名」などの形式も維持可能です。
            // ここではシンプルにファイル名、あるいは以前のロジックに近い表示にします。
            
            // 以前のロジック：直上のフォルダ名/ファイル名
            // 今回は第一階層で見出しを出しているので、リンク自体は少しシンプルにしても良いかもしれません。
            // とりあえずファイル名＋補足程度にします。
            a.textContent = item.Name; 
            
            a.setAttribute('title', item.FullName); 

            // インデントをつける（見出しより右にずらす）
            li.style.paddingLeft = '1em';

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputElement.appendChild(ul); 
        console.log('Sitemap: Generated grouped links.');
    }

    // --- 5. Main Process ---
    
    function loadSitemapData() {
        const jsonPath = JSON_URL; 
        
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok. ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                generateLinks(data);
            })
            .catch(error => {
                console.error('Sitemap Fetch Error:', error);
                const errorP = document.createElement('p');
                errorP.style.color = 'red';
                errorP.textContent = 'Sitemap loading failed.';
                outputElement.appendChild(errorP); 
            });
    }

    loadSitemapData();

})();
