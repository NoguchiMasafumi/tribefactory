/**
 * sitemap.js
 * Location: tribefactory-main/js/sitemap/
 * Purpose: Reads file_structure.json and generates a link list, calculating the RelativePath
 * directly from the FullName property in JavaScript.
 */

(function () {
    'use strict';

    // --- Configuration ---
    const OUTPUT_ELEMENT_ID = 'sitemap-links'; 
    const JSON_FILE_NAME = 'https://tribefactory.netlify.app/js/sitemap/file_structure.json';
    
    // 【重要】サイトのルート（tribefactory-main）のフルパス（絶対パス）
    // JavaScriptでこのパスを正確に取得するのは難しいため、PowerShellが設定した絶対パスの「ルート部分」を
    // 特定するための文字列を設定します。
    // 例: "C:\\Users\\user\\downloads\\github\\tribefactory-main"
    // このパスは、開発環境ごとに異なるため、以下の変数を使って特定します。
    
    // リンクパスの基点となるルートディレクトリ名
    const SITE_ROOT_FOLDER_NAME = 'tribefactory-main'; 

    // 除外する拡張子のリスト（小文字で定義）
    const EXCLUDED_EXTENSIONS = [
        '.jpg', '.png', '.svg', '.xml', '.css', 'json', '.webmanifest', '.ico', '.ダウンロード', '.js'
    ];
    
    /**
     * Helper function to check if a file name ends with any excluded extension.
     * @param {string} fileName - The name of the file.
     * @returns {boolean} True if the file should be excluded.
     */
    function isExcluded(fileName) {
        const lowerName = fileName.toLowerCase();
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }

    /**
     * Finds the base directory of the script to correctly construct the JSON path.
     * @returns {string} The base URL path to the script's directory (e.g., 'js/sitemap/').
     */
    function getScriptBaseUrl() {
        const scriptElement = document.querySelector('script[src*="' + JSON_FILE_NAME.split('.')[0] + '.js"]');
        if (scriptElement) {
             const fullSrc = scriptElement.src;
             return fullSrc.substring(0, fullSrc.lastIndexOf('/') + 1);
        }
        return 'js/sitemap/'; 
    }

    /**
     * Calculates the path relative to the SITE_ROOT_FOLDER_NAME.
     * @param {string} fullName - The full absolute path from the JSON (e.g., "C:\...\tribefactory-main\js\file.htm").
     * @returns {string} The calculated relative path (e.g., "js/file.htm").
     */
    function getRelativePathFromFullName(fullName) {
        // 1. パス区切り文字を正規化（Windowsの\を/に）
        const normalizedPath = fullName.replace(/\\/g, '/');
        
        // 2. ルートフォルダ名を探す
        const rootIndex = normalizedPath.indexOf(SITE_ROOT_FOLDER_NAME);
        
        if (rootIndex === -1) {
            console.warn('Sitemap Path Warning: Could not find site root folder "' + SITE_ROOT_FOLDER_NAME + '" in FullName.');
            return normalizedPath; // 見つからなければフルパスを返す (不正確だがフォールバック)
        }
        
        // 3. ルートフォルダ名以降を抽出
        // ルートフォルダ名とその次のスラッシュを含めて切り取る
        const startIndex = rootIndex + SITE_ROOT_FOLDER_NAME.length + 1;
        
        // パスがルートフォルダ名で終わっている場合（フォルダ自身の場合）、空文字列を返す
        if (startIndex >= normalizedPath.length) {
             return ''; 
        }

        return normalizedPath.substring(startIndex);
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
            
            // FullNameからRelativePathを動的に生成
            const relativePath = getRelativePathFromFullName(item.FullName);
            
            // ルートフォルダ自身（'tribefactory-main'）はスキップ
            if (relativePath === '') {
                return;
            }

            a.href = relativePath;
            a.textContent = item.Name; 
            a.setAttribute('title', relativePath); 

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
        const baseUrl = getScriptBaseUrl();
        const jsonPath = baseUrl + JSON_FILE_NAME; 
        
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