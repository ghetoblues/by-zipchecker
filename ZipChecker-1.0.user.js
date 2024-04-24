// ==UserScript==
// @name         ZipChecker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check zip codes using Back4App's US Zip Code API
// @author       Dispatch Service
// @match        https://by.smartlogistics.work/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define global variables
    let result;

    // Function to add the zip checker form and button
    function addZipChecker() {

        // Elements
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');

        // Styles
        result = document.createElement('div');
        input.setAttribute('data-v-9f2514a2', '');
        input.setAttribute('placeholder', 'ZIP');
        input.setAttribute('type', 'text');
        input.style.marginLeft = '1px';
        input.style.padding = '5px';
        input.style.borderRadius = '5px'; // Add rounded corners for better aesthetics
        input.style.border = '1px solid #ccc'; // Add a border for better visibility
        input.style.width = '200px'; // Increase width for easier tapping
        button.textContent = 'CHECK';
        button.setAttribute('data-v-c4b970ed', '');
        button.setAttribute('data-v-9f2514a2', '');
        button.setAttribute('class', 'l-icon-button button-effect size-xl ms-auto');
        button.style.fontSize = '16px';
        button.style.padding = '5px';
        button.style.marginLeft = '1px';
        button.style.marginTop = '10px';
        result.style.marginTop = '5px';
        result.style.cursor = 'pointer';
        result.style.marginLeft = '1px'

        // Append the button
        var target = document.querySelector('div[data-v-9f2514a2].col-span-6.flex.justify-end');
        if (target && target.previousElementSibling) {
            target.previousElementSibling.appendChild(input);
            target.previousElementSibling.appendChild(button);
            target.previousElementSibling.appendChild(result);
        } else {
        }

        console.log('Appended');

        // Event listener for form submission
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log('Clicked');
            result.textContent = '';

            const zipCode = input.value;

            // Fetch data from the API
            const response = await fetch(`https://parseapi.back4app.com/classes/US_Zip_Code?where={"US_Zip_Code":${zipCode}}`, {
                headers: {
                    'X-Parse-Application-Id': 'KUwuFHrQUHRS7nKUJJoGaGBVv2VzrLgskkzMJiwI',
                    'X-Parse-REST-API-Key': 'JWsPHN6Ii5cOKX23cQDVw6EDV5ZbVuCuKyKOxCHG'
                }
            });
            console.log('Fetching data...');

            const data = await response.json();
            console.log('Zip:', data);

            // Display result
            if (data.results.length > 0) {
                const { US_Zip_Code, Primary_city, State } = data.results[0];
                result.textContent = `${Primary_city}, ${State} ${US_Zip_Code}`;
            } else {
                result.textContent = 'Zip not found';
            }
        });

        // Add copy functionality to the result
        addCopyFunctionality();
    }

    // Function to add copy functionality to the result
    function addCopyFunctionality() {
        result.addEventListener('click', () => {

            // Select the text content of the result element
            const selectedText = result.textContent;

            // Create a temporary textarea element to copy the text
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = selectedText;
            tempTextarea.style.position = 'fixed'; // Ensure it's not visible
            document.body.appendChild(tempTextarea);

            // Select the text in the textarea
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, selectedText.length);

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Remove the temporary textarea element
            document.body.removeChild(tempTextarea);

        });
    }

    // Add the zip checker form and button when the page is fully loaded
    window.addEventListener('load', addZipChecker);

})();
