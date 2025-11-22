/**
 * sidebar_sitemap.js
 * Purpose: Initializes sidebar with static content and appends dynamic sitemap links with grouped headers.
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
    
    const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);

    if (!outputElement) {
        console.error('Sitemap Error: Output element with ID "' + OUTPUT_ELEMENT_ID + '" not found.');
        return;
    }
    
    outputElement.innerHTML = STATIC_CONTENTS; 

    // --- 3. Helper Functions ---
    
    function isExcluded(fileName) {
        const lowerName = fileName.toLowerCase();
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }
    
    function getRelativePathFromFullName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) return normalizedPath; 
        
        const startIndex = rootIndex + SITE_ROOT_FOLDER_NAME.length + 1;
        if (startIndex >= normalizedPath.length) return ''; 

        const relative = normalizedPath.substring(startIndex);
        return '/' + relative;
    }

    /**
     * 元のコードにあった関数：直上のフォルダ名を取得（リンクテキスト表示用）
     */
    function getFolderName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) return '不明なフォルダ'; 

        const relativePath = normalizedPath.substring(rootIndex + SITE_ROOT_FOLDER_NAME.length + 1);
        const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        if (folderPath === '') return 'tribefactory.netlify.app'; // ルートの場合

        const lastSlashIndex = folderPath.lastIndexOf('/');
        if (lastSlashIndex === -1) return folderPath;

        return folderPath.substring(lastSlashIndex + 1);
    }

    // --- 4. Logic for Links Generation ---

    function generateLinks(data) {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');
        
        // 見た目の調整（必要に応じてCSSファイルへ移動してください）
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';

        // フォルダごとに固めるためパス順でソート
        const sortedData = data.sort((a, b) => {
            const pathA = a.FullName.replace(/\\/g, '/').toLowerCase();
            const pathB = b.FullName.replace(/\\/g, '/').toLowerCase();
            return pathA < pathB ? -1 : pathA > pathB ? 1 : 0;
        });

        let lastHeaderFolder = null; // 見出し判定用の変数を初期化

        sortedData.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            if (rootAbsolutePath === '') return;

            // --- 【変更点1】第一階層（ルート直後のフォルダ）が変わったら見出しを出す ---
            const pathParts = rootAbsolutePath.split('/');
            let currentHeaderFolder = 'Root'; 

            // pathParts[1] が第一階層のフォルダ名 (例: /tool/calc.html -> "tool")
            if (pathParts.length > 2) {
                currentHeaderFolder = pathParts[1];
            }

            // 前回のループと違う第一階層フォルダなら、見出し(li)を追加
            if (currentHeaderFolder !== lastHeaderFolder) {
                const headerLi = document.createElement('li');
                headerLi.style.fontWeight = 'bold';
                headerLi.style.marginTop = '15px';
                headerLi.style.marginBottom = '5px';
                headerLi.style.color = '#333';
                headerLi.style.borderBottom = '1px solid #ddd';
                
                // 見出しテキスト
                headerLi.textContent = `📂 ${currentHeaderFolder}`; 
                ul.appendChild(headerLi);

                lastHeaderFolder = currentHeaderFolder;
            }

            // --- 【変更点2】リンク自体は元のロジック（フォルダ名/ファイル名）を維持 ---
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            // 直上のフォルダ名を取得（リンクテキスト用）
            const parentFolderName = getFolderName(item.FullName);

            a.href = rootAbsolutePath; 
            // ここを元の「フォルダ名/ファイル名」に戻しました
            a.textContent = `${parentFolderName}/${item.Name}`; 
            a.setAttribute('title', item.FullName); 

            // インデントを入れて見出しと区別しやすくする
            li.style.paddingLeft = '10px';

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputElement.appendChild(ul); 
        console.log('Sitemap: Generated grouped links with full names.');
    }

    // --- 5. Main Process ---
    function loadSitemapData() {
        fetch(JSON_URL)
            .then(response => response.ok ? response.json() : Promise.reject(response.status))
            .then(data => generateLinks(data))
            .catch(error => {
                console.error('Sitemap Error:', error);
                const p = document.createElement('p');
                p.style.color = 'red';
                p.textContent = 'Error loading sitemap.';
                outputElement.appendChild(p);
            });
    }

    loadSitemapData();

})();
