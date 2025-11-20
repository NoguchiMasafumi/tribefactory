/**
 * sidebar_sitemap.js
 * Purpose: Initializes sidebar with static content and appends dynamic sitemap links.
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
        '.jpg', '.png', '.svg', '.xml', '.css', '.json', '.webmanifest', '.ico', '.ダウンロード', '.js'
    ];
    
    // 出力要素を取得
    const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);

    // 要素が存在しない場合は処理を中断
    if (!outputElement) {
        console.error('Sitemap Error: Output element with ID "' + OUTPUT_ELEMENT_ID + '" not found.');
        return;
    }
    
    // 最初のステップ: 静的コンテンツを挿入（既存の内容を上書きし、マージの基点とする）
    outputElement.innerHTML = STATIC_CONTENTS; 

    // --- 3. Helper Functions ---
    
    /**
     * Helper function to check if a file name ends with any excluded extension.
     */
    function isExcluded(fileName) {
        const lowerName = fileName.toLowerCase();
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }
    
    /**
     * Calculates the path relative to the SITE_ROOT_FOLDER_NAME.
     */
    function getRelativePathFromFullName(fullName) {
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) {
            console.warn('Sitemap Path Warning: Could not find site root folder "' + SITE_ROOT_FOLDER_NAME + '" in FullName.');
            return normalizedPath; 
        }
        
        const startIndex = rootIndex + SITE_ROOT_FOLDER_NAME.length + 1;
        
        if (startIndex >= normalizedPath.length) {
            return ''; 
        }

        const relative = normalizedPath.substring(startIndex);
        // サイトルートからの絶対パスにするため、先頭にスラッシュを追加
        return '/' + relative;
    }

    /**
     * 新規追加: ファイルのFullNameから、直上のフォルダ名を取得します。
     * 例: "C:\...\tribefactory-main\js\pages\file.htm" -> "pages"
     * ファイルがサイトルート直下の場合 (例: "C:\...\tribefactory-main\index.htm") -> "サイトルート直下" 
     * @param {string} fullName - The full absolute path from the JSON.
     * @returns {string} The name of the immediate parent folder.
     */
    function getFolderName(fullName) {
        // パス区切り文字を正規化し、SITE_ROOT_FOLDER_NAME以降の相対パスを取得
        const normalizedPath = fullName.replace(/\\/g, '/');
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) {
            return '不明なフォルダ'; 
        }

        const relativePath = normalizedPath.substring(rootIndex + SITE_ROOT_FOLDER_NAME.length + 1);

        // 最後のファイル名部分を除去
        const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        if (folderPath === '') {
            // ルートフォルダ直下の場合
            return 'サイトルート直下';
        }

        // フォルダパスの最後のスラッシュ以降（＝直上のフォルダ名）を抽出
        const lastSlashIndex = folderPath.lastIndexOf('/');
        
        if (lastSlashIndex === -1) {
            // ルート直下のフォルダの場合
            return folderPath;
        }

        return folderPath.substring(lastSlashIndex + 1);
    }

    /**
     * Generates a link list from the file structure data and appends it to the output element.
     */
    function generateLinks(data) {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');

        let linkCount = 0;

        // フォルダと除外拡張子を除外
        data.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            
            if (rootAbsolutePath === '') {
                return;
            }
            
            // **修正箇所1: フォルダ名を取得**
            const folderName = getFolderName(item.FullName);

            a.href = rootAbsolutePath; 
            // **修正箇所2: リンクテキストにフォルダ名を含める**
            a.textContent = `[${folderName}] ${item.Name}`; 
            a.setAttribute('title', item.FullName); 

            li.appendChild(a);
            ul.appendChild(li);
            linkCount++;
        });

        // 最終ステップ: 既存のコンテンツ（STATIC_CONTENTS）の**後ろに**動的なリストを追記（マージ）
        outputElement.appendChild(ul); 
        console.log('Sitemap: Successfully generated ' + linkCount + ' links and appended to ' + OUTPUT_ELEMENT_ID + '.');
    }

    // --- 4. Main Process ---
    
    /**
     * Fetches the JSON file and initiates link generation.
     */
    function loadSitemapData() {
        const jsonPath = JSON_URL; 
        
        console.log('Sitemap: Attempting to load JSON from: ' + jsonPath);

        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok. HTTP Status: ' + response.status + ' (URL: ' + jsonPath + ')');
                }
                return response.json();
            })
            .then(data => {
                generateLinks(data);
            })
            .catch(error => {
                console.error('Sitemap Fetch Error:', error);
                // エラーメッセージも静的コンテンツの後ろに追記
                const errorP = document.createElement('p');
                errorP.style.color = 'red';
                errorP.textContent = 'Error loading sitemap data. Check console for details. (Possible causes: File not found or CORS restriction)';
                outputElement.appendChild(errorP); 
            });
    }

    // 処理を開始
    loadSitemapData();
})();