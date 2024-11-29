import {nonPouplarCard} from '/components/non-popular-pricing-builder/script.js';
import {pouplarCard} from '/components/popular-pricing-builder/script.js';



async function loadCardContainer() {

    const container = document.getElementById('prices-viewer-container'); // Main container

    for(let i = 0; i < 1; i++){
        const card = await nonPouplarCard(); // Generate a new card each time
        const cardElement = document.createElement('div');
        cardElement.classList.add('prices-viewer-item');
        cardElement.innerHTML = card; // Insert the rendered HTML into a wrapper element
        container.appendChild(cardElement); // Append to the main container
    }

    for(let i = 0; i < 1; i++){
        const card = await pouplarCard(); // Generate a new card each time
        const cardElement = document.createElement('div');
        cardElement.classList.add('prices-viewer-item');
        cardElement.innerHTML = card; // Insert the rendered HTML into a wrapper element
        container.appendChild(cardElement); // Append to the main container
    }

    for(let i = 0; i < 2; i++){
        const card = await nonPouplarCard(); // Generate a new card each time
        const cardElement = document.createElement('div');
        cardElement.classList.add('prices-viewer-item');
        cardElement.innerHTML = card; // Insert the rendered HTML into a wrapper element
        container.appendChild(cardElement); // Append to the main container
    }

}

loadCardContainer();