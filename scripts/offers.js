import { offerViewer } from '/components/offer-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';



async function fetchOffers(){
    let testHtml = '';
    const container = document.getElementById('offers-content-container'); // Main container

    for(let i =0; i<20;i++){
        const param = {
            title: `Title ${i+1}`,
            description: `Sample description content ${i+1}  goes here to test layout and spacing for responsiveness.`
        };
        testHtml += await offerViewer(param)
        container.innerHTML = testHtml;
    }
}

fetchOffers();