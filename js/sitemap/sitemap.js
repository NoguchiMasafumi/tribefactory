/**
 * sitemap.js
 * Location: tribefactory-main/js/sitemap/
 * Purpose: Reads file_structure.json and generates a link list based on the 'Name' property, excluding specific file types.
 */

(function () {
    'use strict';

    // --- Configuration ---
    const JSON_PATH = 'js/sitemap/file_structure.json'; 
    const OUTPUT_ELEMENT_ID = 'sitemap-links'; 
    
    // 除外する拡張子のリスト（小文字で定義）
    const EXCLUDED_EXTENSIONS = [
        '.jpg', '.png', '.svg', '.xml', '.webmanifest', '.ico', '.ダウンロード', '.js'
    ];
    
    /**
     * Helper function to check if a file name ends with any excluded extension.
     * @param {string} fileName - The name of the file (e.g., 'style.css').
     * @returns {boolean} True if the file should be excluded.
     */
    function isExcluded(fileName) {
        // ファイル名を小文字に変換して比較
        const lowerName = fileName.toLowerCase();
        return EXCLUDED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    }

    /**
     * Finds the base directory of the script to correctly construct the JSON path.
     * @returns {string} The base URL path to the script's directory (e.g., 'js/sitemap/').
     */
    function getScriptBaseUrl() {
        const scriptElement = document.querySelector('script[src*="sitemap.js"]');
        if (scriptElement) {
             const fullSrc = scriptElement.src;
             return fullSrc.substring(0, fullSrc.lastIndexOf('/') + 1);
        }
        return 'js/sitemap/'; 
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

        // 1. フィルタリング処理の追加
        data.filter(item => 
            // 1. フォルダではないこと
            !item.PSIsContainer && 
            // 2. 除外拡張子ではないこと
            !isExcluded(item.Name)
        ).forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = item.RelativePath;
            a.textContent = item.Name; 
            a.setAttribute('title', item.RelativePath); 

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