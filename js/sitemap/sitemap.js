/**
 * sitemap.js
 * Location: tribefactory-main/js/sitemap/
 * Purpose: Reads file_structure.json via ABSOLUTE URL and generates site-root relative links.
 */

(function () {
    'use strict';

    // --- Configuration ---
    const OUTPUT_ELEMENT_ID = 'sitemap-links'; 
    
    // サイトマップJSONの絶対URLを設定 (修正なしでそのまま使用)
    const JSON_URL = 'https://tribefactory.netlify.app/js/sitemap/file_structure.json';
    
    // リンクパスの基点となるルートディレクトリ名
    const SITE_ROOT_FOLDER_NAME = 'tribefactory-main'; 

    // 除外する拡張子のリスト（小文字で定義）
    const EXCLUDED_EXTENSIONS = [
        '.jpg', '.png', '.svg', '.xml', '.css', '.json', '.webmanifest', '.ico', '.ダウンロード', '.js'
    ];
    
    /**
     * Helper function to check if a file name ends with any excluded extension.
     * @param {string} fileName - The name of the file.
     * @returns {boolean} True if the file should be excluded.
     */
    function isExcluded(fileName) {
        const lowerName = fileName.toLowerCase();
        // 修正: json の前にドットがないミスを修正
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }
    
    // getScriptBaseUrl 関数は使用しないため削除します

    /**
     * Calculates the path relative to the SITE_ROOT_FOLDER_NAME and adds a leading slash (/).
     * This makes the link absolute relative to the site root, so it works from any hierarchy.
     * @param {string} fullName - The full absolute path from the JSON (e.g., "C:\...\tribefactory-main\js\file.htm").
     * @returns {string} The calculated root-absolute path (e.g., "/js/file.htm").
     */
    function getRelativePathFromFullName(fullName) {
        // 1. パス区切り文字を正規化（Windowsの\を/に）
        const normalizedPath = fullName.replace(/\\/g, '/');
        
        // 2. ルートフォルダ名を探す
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) {
            console.warn('Sitemap Path Warning: Could not find site root folder "' + SITE_ROOT_FOLDER_NAME + '" in FullName.');
            return normalizedPath; 
        }
        
        // 3. ルートフォルダ名以降を抽出
        const startIndex = rootIndex + SITE_ROOT_FOLDER_NAME.length + 1;
        
        if (startIndex >= normalizedPath.length) {
             return ''; 
        }

        const relative = normalizedPath.substring(startIndex);
        
        // 4. サイトルートからの絶対パスにするため、先頭にスラッシュを追加
        return '/' + relative;
    }

    /**
     * Generates a link list from the file structure data.
     * @param {Array<Object>} data - Array of file objects read from JSON.
     */
    function generateLinks(data) {
        const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);
        if (!outputElement) {
            console.error('Sitemap Error: Output element with ID "' + OUTPUT_ELEMENT_ID + '" not found.');
            return;
        }

        outputElement.innerHTML = ''; 

        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');

        let linkCount = 0;

        // フィルタリング処理: フォルダを除外し、除外拡張子も除外
        data.filter(item => 
            !item.PSIsContainer && 
            !isExcluded(item.Name)
        ).forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            // 修正: サイトルートからの絶対パスを生成
            const rootAbsolutePath = getRelativePathFromFullName(item.FullName);
            
            if (rootAbsolutePath === '') {
                return;
            }

            a.href = rootAbsolutePath; // 例: "/js/page1.htm"
            a.textContent = item.Name; 
            a.setAttribute('title', item.FullName); 

            li.appendChild(a);
            ul.appendChild(li);
            linkCount++;
        });

        outputElement.appendChild(ul);
        console.log('Sitemap: Successfully generated ' + linkCount + ' links.');
    }

    /**
     * Fetches the JSON file and initiates link generation.
     */
    function loadSitemapData() {
        // 修正: JSON_URL を直接使用し、getScriptBaseUrl を使わない
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
                const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);
                if (outputElement) {
                     outputElement.innerHTML = '<p style="color:red;">Error loading sitemap data. Check console for details. (Possible causes: File not found or CORS restriction)</p>';
                }
            });
    }

    // Start the process when the script loads
    loadSitemapData();
})();