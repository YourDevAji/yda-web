import { offerViewer } from '/components/offer-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

const contentEnd = document.getElementById('offers-content-end');
const container = document.getElementById('offers-content-container');

let displayed = 0;
let isLoading = false;

async function fetchOffers() {
    if (isLoading || displayed > 70) return; // Prevent multiple fetches
    isLoading = true;

    if(displayed >= 20){
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
    }
    let testHtml = '';

    for (let i = displayed; i < displayed + 20; i++) {
        const param = {
            title: `Title ${i + 1}`,
            description: `Sample description content ${i + 1} goes here to test layout and spacing for responsiveness.`
        };
        testHtml += await offerViewer(param);
    }

    container.insertAdjacentHTML('beforeend', testHtml); // Append content
    displayed += 20;
    isLoading = false;
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading) {
        fetchOffers();
    }
}, {
    rootMargin: '0px',
    threshold: 1.0
});

observer.observe(contentEnd);

// Initial Fetch
fetchOffers();
