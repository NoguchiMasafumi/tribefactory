/**
 * sidebar_sitemap.js
 * Purpose: Initializes sidebar with static content and appends dynamic sitemap links with plain text headers.
 */

(function () {
    'use strict';

    //************* 静的コンテンツ追加する場合 *********************
    const STATIC_CONTENTS = ``;

    // --- 2. Configuration & Element Setup ---
    const OUTPUT_ELEMENT_ID = 'sidebar_container'; 
    const JSON_URL = 'https://tribefactory.netlify.app/js/sitemap/file_structure.json';
    const SITE_ROOT_FOLDER_NAME = 'tribefactory-main'; 
    const EXCLUDED_EXTENSIONS = [
        '.jpg', '.png', '.svg', '.xml', '.css', '.json', '.webmanifest', '.ico', '.ダウンロード', '.js','.ps1','.bat' ,'.url'
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
     * ファイル直上のフォルダ名を取得（リンクテキスト用）
     */
    function getFolderName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) return '不明なフォルダ'; 

        const relativePath = normalizedPath.substring(rootIndex + SITE_ROOT_FOLDER_NAME.length + 1);
        const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        if (folderPath === '') return 'tribefactory.netlify.app'; 

        const lastSlashIndex = folderPath.lastIndexOf('/');
        if (lastSlashIndex === -1) return folderPath;

        return folderPath.substring(lastSlashIndex + 1);
    }

    // --- 4. Logic for Links Generation ---

    function generateLinks(data) {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');
        
        // スタイルの簡易設定（必要に応じてCSSで上書きしてください）
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';

        // フォルダごとにまとめるためパス順でソート
        const sortedData = data.sort((a, b) => {
            const pathA = a.FullName.replace(/\\/g, '/').toLowerCase();
            const pathB = b.FullName.replace(/\\/g, '/').toLowerCase();
            return pathA < pathB ? -1 : pathA > pathB ? 1 : 0;
        });

        let lastHeaderFolder = null; 

        sortedData.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            if (rootAbsolutePath === '') return;

            // --- 第一階層判定 ---
            const pathParts = rootAbsolutePath.split('/');
            let currentHeaderFolder = 'Root'; 

            // 第一階層のフォルダ名を取得
            if (pathParts.length > 2) {
                currentHeaderFolder = pathParts[1];
            }

            // フォルダが変わった場合のみ見出しを追加
            if (currentHeaderFolder !== lastHeaderFolder) {
                const headerLi = document.createElement('li');
                
                // 見出しのスタイル（文字のみ、少し強調）
                headerLi.style.fontWeight = 'bold';
                headerLi.style.marginTop = '15px';
                headerLi.style.marginBottom = '5px';
                headerLi.style.color = '#333';
                headerLi.style.borderBottom = '1px solid #ddd';
                
                // アイコン無し、文字のみセット
                headerLi.textContent = currentHeaderFolder; 
                
                ul.appendChild(headerLi);
                lastHeaderFolder = currentHeaderFolder;
            }

            // --- リンク生成（元の形式：フォルダ名/ファイル名） ---
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            const parentFolderName = getFolderName(item.FullName);

            a.href = rootAbsolutePath; 
            a.textContent = `${parentFolderName}/${item.Name}`; 
            a.setAttribute('title', item.FullName); 

            li.style.paddingLeft = '10px'; // 見出しより少しインデント

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputElement.appendChild(ul); 
        console.log('Sitemap: Generated grouped links (text headers only).');
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


