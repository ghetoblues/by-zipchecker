// ==UserScript==
// @name         ZipChecker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Check zip codes using Back4App US Zip Code API
// @author       Dispatch Service
// @match        https://by.smartlogistics.work/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define global variables
    let zipResult;
    let cityResult;

    // Function to add the zip checker form and button
    function addZipChecker() {

        // Elements for zip code checker
        const zipForm = document.createElement('form');
        zipForm.style.display = 'flex'; // Make the form flex container
        zipForm.style.alignItems = 'center'; // Align items to the center

        const zipInput = document.createElement('input');
        zipInput.setAttribute('data-v-9f2514a2', '');
        zipInput.setAttribute('placeholder', 'ZIP');
        zipInput.setAttribute('type', 'text');
        zipInput.style.padding = '5px';
        zipInput.style.borderRadius = '5px';
        zipInput.style.border = '1px solid #ccc';
        zipInput.style.width = '200px';

        const zipButton = document.createElement('button');
        zipButton.textContent = 'CHECK';
        zipButton.setAttribute('data-v-c4b970ed', '');
        zipButton.setAttribute('data-v-9f2514a2', '');
        zipButton.setAttribute('class', 'l-icon-button button-effect size-xl ms-auto');
        zipButton.style.fontSize = '16px';
        zipButton.style.padding = '5px';

        // Create a span for the zip result
        zipResult = document.createElement('span');
        zipResult.style.cursor = 'pointer';
        zipResult.style.marginLeft = '5px';

        // Append elements to the zip code checker form
        zipForm.appendChild(zipInput);
        zipForm.appendChild(zipResult);
        zipForm.appendChild(zipButton);

        // Append the zip code checker form
        var zipTarget = document.querySelector('div[data-v-9f2514a2].col-span-6.flex.justify-end');
        if (zipTarget && zipTarget.previousElementSibling) {
            zipTarget.previousElementSibling.appendChild(zipForm);
        }

        // Event listener for zip code checker button
        zipButton.addEventListener('click', async (event) => {
            event.preventDefault();
            zipResult.textContent = '';

            let zipCode = zipInput.value;

            // Check if the zip code starts with a zero
            const hasLeadingZero = zipCode.startsWith('0');

            // If the zip code starts with a zero, remove it
            if (hasLeadingZero) {
                zipCode = zipCode.substring(1);
            }

            // Fetch data from the API
            const apiUrl = `https://parseapi.back4app.com/classes/US_Zip_Code?where={"US_Zip_Code":${zipCode}}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'X-Parse-Application-Id': 'KUwuFHrQUHRS7nKUJJoGaGBVv2VzrLgskkzMJiwI',
                    'X-Parse-REST-API-Key': 'JWsPHN6Ii5cOKX23cQDVw6EDV5ZbVuCuKyKOxCHG'
                }
            });

            const data = await response.json();

            // Display result
            if (data.results.length > 0) {
                const { US_Zip_Code, Primary_city, State } = data.results[0];
                const formattedZipCode = hasLeadingZero ? '0' + US_Zip_Code : US_Zip_Code;
                zipResult.textContent = `${Primary_city}, ${State} ${formattedZipCode}`;
            } else {
                zipResult.textContent = 'Zip not found';
            }
        });

        // Elements for city to zip code converter
        const cityForm = document.createElement('form');
        cityForm.style.display = 'flex'; // Make the form flex container
        cityForm.style.alignItems = 'center'; // Align items to the center

        const cityInput = document.createElement('input');
        cityInput.setAttribute('data-v-9f2514a2', '');
        cityInput.setAttribute('placeholder', 'CITY');
        cityInput.setAttribute('type', 'text');
        cityInput.style.padding = '5px';
        cityInput.style.borderRadius = '5px';
        cityInput.style.border = '1px solid #ccc';
        cityInput.style.width = '200px';

        const cityButton = document.createElement('button');
        cityButton.textContent = 'CHECK';
        cityButton.setAttribute('data-v-c4b970ed', '');
        cityButton.setAttribute('data-v-9f2514a2', '');
        cityButton.setAttribute('class', 'l-icon-button button-effect size-xl ms-auto');
        cityButton.style.fontSize = '16px';
        cityButton.style.padding = '5px';

        // Create a span for the city result
        cityResult = document.createElement('span');
        cityResult.style.cursor = 'pointer';
        cityResult.style.marginLeft = '5px';

        // Append elements to the city to zip code converter form
        cityForm.appendChild(cityInput);
        cityForm.appendChild(cityResult);
        cityForm.appendChild(cityButton);

        // Append the city to zip code converter form
        var cityTarget = document.querySelector('div[data-v-9f2514a2].col-span-6.flex.justify-end');
        if (cityTarget && cityTarget.previousElementSibling) {
            cityTarget.previousElementSibling.appendChild(cityForm);
        }

        // Event listener for city to zip code converter button
        cityButton.addEventListener('click', async (event) => {
            event.preventDefault();
            cityResult.textContent = '';

            let cityName, stateName;

            // Parse the input to extract city and state
            const input = cityInput.value.trim(); // Trim excess whitespace
            const parts = input.split(',').map(part => part.trim());
            if (parts.length === 2) {
                cityName = parts[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                stateName = parts[1].toUpperCase();
            } else if (parts.length === 1) {
                const words = parts[0].split(' ');
                if (words.length > 1) {
                    cityName = words.slice(0, -1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                    stateName = words[words.length - 1].toUpperCase();
                } else {
                    cityName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
                }
            }

            // Fetch data from the API
            const response = await fetch(`https://parseapi.back4app.com/classes/US_Zip_Code?where={"Primary_city":"${cityName}","State":"${stateName}"}`, {
                headers: {
                    'X-Parse-Application-Id': 'KUwuFHrQUHRS7nKUJJoGaGBVv2VzrLgskkzMJiwI',
                    'X-Parse-REST-API-Key': 'JWsPHN6Ii5cOKX23cQDVw6EDV5ZbVuCuKyKOxCHG'
                }
            });

            const data = await response.json();

            // Display result
            if (data.results.length > 0) {
                const { US_Zip_Code, Primary_city, State } = data.results[0];
                // Pad zip code with leading zeros if necessary
                const paddedZipCode = String(US_Zip_Code).padStart(5, '0');
                cityResult.textContent = `${Primary_city}, ${State} ${paddedZipCode}`;
            } else {
                cityResult.textContent = 'City not found';
            }
        });

        // Add copy functionality to the zip result
        addCopyFunctionality(zipResult);

        // Add copy functionality to the city result
        addCopyFunctionality(cityResult);
    }

    // Function to add copy functionality to the result
    function addCopyFunctionality(resultElement) {
        resultElement.addEventListener('click', () => {

            // Select the text content of the result element
            const selectedText = resultElement.textContent;

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
