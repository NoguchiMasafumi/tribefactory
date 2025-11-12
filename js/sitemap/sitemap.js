/**
 * sitemap.js
 * Location: tribefactory-main/js/sitemap/
 * Purpose: Reads file_structure.json and generates a link list based on the 'Name' property.
 */

(function () {
    'use strict';

    // --- Configuration ---
    // The JSON file is located in the same directory as this script: js/sitemap/file_structure.json
    const JSON_FILE_NAME = 'file_structure.json';
    const OUTPUT_ELEMENT_ID = 'sitemap-links'; // The ID of the HTML element where the links will be inserted

    /**
     * Finds the base directory of the script to correctly construct the JSON path.
     * Uses querySelector to find the script tag that loaded this file (sitemap.js).
     * @returns {string} The base URL path to the script's directory (e.g., 'js/sitemap/').
     */
    function getScriptBaseUrl() {
        // Find the script tag by looking for its known filename
        const scriptElement = document.querySelector('script[src*="sitemap.js"]');
        if (scriptElement) {
             const fullSrc = scriptElement.src;
             // Return the path excluding the script name itself
             return fullSrc.substring(0, fullSrc.lastIndexOf('/') + 1);
        }
        // Fallback for extremely unusual loading scenarios
        // This assumes the script is always loaded from 'js/sitemap/' relative to the site root
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

        // リンク生成前に "Loading sitemap..." のテキストを削除
        outputElement.innerHTML = ''; 

        const ul = document.createElement('ul');
        ul.setAttribute('class', 'sitemap-list');

        // Filter and process files that are NOT containers (i.e., actual files)
        data.filter(item => !item.PSIsContainer).forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            // Link target uses the RelativePath property (relative to the tribefactory-main root)
            a.href = item.RelativePath;
            a.textContent = item.Name; // Display the file name
            a.setAttribute('title', item.RelativePath); 

            li.appendChild(a);
            ul.appendChild(li);
        });

        outputElement.appendChild(ul);
        console.log('Sitemap: Successfully generated ' + data.filter(item => !item.PSIsContainer).length + ' links.');
    }

    /**
     * Fetches the JSON file and initiates link generation.
     */
    function loadSitemapData() {
        // 1. JSONパスを動的に解決
        const baseUrl = getScriptBaseUrl();
        const jsonPath = baseUrl + JSON_FILE_NAME;
        
        console.log('Sitemap: Attempting to load JSON from: ' + jsonPath);

        // 2. Fetch APIでJSONを読み込み
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    // エラーメッセージをより詳細に表示
                    throw new Error('Network response was not ok. HTTP Status: ' + response.status + ' (URL: ' + jsonPath + ')');
                }
                return response.json();
            })
            .then(data => {
                generateLinks(data);
            })
            .catch(error => {
                console.error('Sitemap Fetch Error:', error);
                // Display error message in the output element
                const outputElement = document.getElementById(OUTPUT_ELEMENT_ID);
                if (outputElement) {
                     outputElement.innerHTML = '<p style="color:red;">Error loading sitemap data. Check console for details. (Possible causes: File not found or CORS restriction)</p>';
                }
            });
    }

    // Start the process when the script loads
    loadSitemapData();
})();