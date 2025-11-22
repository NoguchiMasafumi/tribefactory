/**
 * sidebar_sitemap.js
 * Purpose: Sorts by folder first, then filename. Groups items clearly.
 */

(function () {
    'use strict';

    //************** 静的コンテンツはここ *******************
    const STATIC_CONTENTS = ``;

    // --- 2. Configuration ---
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

    // 表示用の親フォルダ名を取得
    function getFolderName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        if (rootIndex === -1) return '不明なフォルダ'; 

        const relativePath = normalizedPath.substring(rootIndex + SITE_ROOT_FOLDER_NAME.length + 1);
        const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        if (folderPath === '') return 'tribefactory.netlify.app'; // ルート直下の場合の表示名

        const lastSlashIndex = folderPath.lastIndexOf('/');
        if (lastSlashIndex === -1) return folderPath;

        return folderPath.substring(lastSlashIndex + 1);
    }

    // 第一階層のフォルダ名だけを取り出す（ソートとグルーピング用）
    function getFirstLevelFolderName(relativePath) {
        const pathParts = relativePath.split('/'); 
        // pathParts[0]は空文字、pathParts[1]が第一階層
        // 例: /tool/calc.html -> ["", "tool", "calc.html"] -> "tool"
        // 例: /index.html -> ["", "index.html"] -> "index.html" (フォルダではない)
        
        if (pathParts.length > 2) {
            return pathParts[1]; // フォルダ名を返す
        }
        return ""; // ルート直下のファイルは空文字扱いにして先頭に持ってくる
    }

    // --- 4. Logic for Links Generation ---

    function generateLinks(data) {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';

        // --- 【修正点】ソートロジックの強化 ---
        const sortedData = data.sort((a, b) => {
            const pathA = getRelativePathFromFullName(a.FullName).toLowerCase();
            const pathB = getRelativePathFromFullName(b.FullName).toLowerCase();

            const folderA = getFirstLevelFolderName(pathA);
            const folderB = getFirstLevelFolderName(pathB);

            // 1. まず第一階層のフォルダ名で比較する
            if (folderA < folderB) return -1;
            if (folderA > folderB) return 1;

            // 2. 同じフォルダ（または同じルート）内なら、パス全体で比較する
            if (pathA < pathB) return -1;
            if (pathA > pathB) return 1;
            return 0;
        });

        let lastHeaderFolder = null; // 見出し判定用

        sortedData.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            if (rootAbsolutePath === '') return;

            // グループ分けのためのフォルダ名取得
            // ルート直下なら "" が返り、フォルダなら "tool" などが返る
            let currentGroup = getFirstLevelFolderName(rootAbsolutePath);
            
            // 表示用の見出しテキスト作成
            // 空文字（ルート）の場合は "Root" などの表示名にする
            let displayHeader = currentGroup === "" ? "Root" : currentGroup;

            // フォルダ（第一階層）が変わったタイミングで見出しを入れる
            if (displayHeader !== lastHeaderFolder) {
                const headerLi = document.createElement('li');
                
                headerLi.style.fontWeight = 'bold';
                headerLi.style.marginTop = '20px'; // 少し間隔を空ける
                headerLi.style.marginBottom = '5px';
                headerLi.style.borderBottom = '1px solid #ccc';
                headerLi.style.color = '#333';
                
                headerLi.textContent = displayHeader; // 見出し（文字のみ）
                ul.appendChild(headerLi);

                lastHeaderFolder = displayHeader;
            }

            // リンクの生成
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            const parentFolderName = getFolderName(item.FullName);

            a.href = rootAbsolutePath; 
            a.textContent = `${parentFolderName}/${item.Name}`; 
            a.setAttribute('title', item.FullName); 

            li.style.paddingLeft = '10px';

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputElement.appendChild(ul); 
        console.log('Sitemap: Generated strongly grouped links.');
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


