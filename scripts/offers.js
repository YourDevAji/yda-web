import { offerViewer } from '/components/offer-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

const contentEnd = document.getElementById('offers-content-end');
const container = document.getElementById('offers-content-container');
const offerSearchInput = document.getElementById('offers-search');
const offerSearchClear = document.getElementById('offers-search-clear');

let cache = new Map(); // Cache for offers, keyed by type_id
let displayed = 0;
let debounceTimeout;
let isLoading = false;
let afterOffer = ''; // Tracks the last item for pagination
let afterFilter = null; // Tracks the last item for pagination
let beforeFilter = null; // Tracks the last item for pagination
let currentFilter = ''; // Tracks current search input
const BATCH_SIZE = 20;

// Event listeners for input and focus/blur
offerSearchInput.addEventListener('input', (event) => handleDebouncedInput(event.target.value));
offerSearchClear.addEventListener('click', handleOfferClear);




async function fetchOffers(requiredBatchSize = BATCH_SIZE) {
    if (isLoading || requiredBatchSize <= 0) return;
    isLoading = true;
    handleLoading(true);
    const { data: offers, error } = await supabaseClient
        .from('type_table')
        .select('*')
        .ilike('type_identity', `%${currentFilter}%`)
        .order('type_identity')
        .gte('type_identity',   afterOffer)
        .limit(requiredBatchSize);

    if (error) {
        displayError("Error loading offers.");
        console.error("Error fetching offers", error);
        isLoading = false;
        return;
    }

    handleLoading(false);
    if (offers.length > 0) {
        for (const offer of offers) {
            if (!cache.has(offer.type_id)) {
                cache.set(offer.type_id, offer);
            }
        }
        displayed += offers.length;
    }

    renderOffers([...cache.values()].filter((offer) =>
    offer.type_identity.toLowerCase().includes(currentFilter.toLowerCase())
    ));

    isLoading = false;
}

async function renderOffers(offers,fetch = false) {

    if(offerSearchInput.value.length === 0 && beforeFilter != null){
        afterOffer = beforeFilter ;
        beforeFilter = null;
    }else{
        afterOffer = (offers.length !== 0) ? offers[offers.length - 1].type_identity : '';
    }
    const fragment = document.createDocumentFragment();

    for (const offer of offers) {
        const param = {
            title: offer.type_identity,
            description: offer.type_description || 'Sample description content for the layout testing.'
        };
        const view = await offerViewer(param);
        fragment.appendChild(view);
    }

    container.innerHTML = '';
    container.appendChild(fragment);

    // Infinite scroll control based on visible items
    const visibleOffers = container.children.length;
    if (visibleOffers >= BATCH_SIZE) {
        observer.observe(contentEnd);
    } else {
        observer.unobserve(contentEnd);
    }
}

async function handleOfferInput(inputValue) {
    currentFilter = inputValue.trim();
    const filteredOffers = [...cache.values()].filter((offer) =>
    offer.type_identity.toLowerCase().includes(currentFilter.toLowerCase())
    );

    renderOffers(filteredOffers,true);

    const remainingToFetch = BATCH_SIZE - filteredOffers.length;
    if (remainingToFetch > 0 && filteredOffers.length !== 0) {
        await fetchOffers(remainingToFetch,filteredOffers[filteredOffers.length - 1]['type_identity']);
    }else if (filteredOffers.length === 0){
        fetchOffers();
    }
}

function handleOfferClear() {
    offerSearchInput.value = '';
    offerSearchClear.style.display = 'none';
    currentFilter = '';
    renderOffers([...cache.values()]);
}

function handleLoading(show) {
    contentEnd.innerHTML = show ? '<div class="loader-popup"></div>' : '';
}

function displayError(message) {
    alert(message); // Customize error handling as needed
}

// Debounce function for input handling
function handleDebouncedInput(value) {
    if(beforeFilter == null){
        beforeFilter = afterOffer;
    }
    offerSearchClear.style.display = (value.length !== 0) ? 'block' : 'none';

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() =>
    handleOfferInput(value)
        , 300);
}

// Intersection Observer for infinite scroll
const observer = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            fetchOffers();
        }
    },
    {
        rootMargin: '0px',
        threshold: 1,
    }
);

observer.observe(contentEnd);

// Initial fetch on page load
fetchOffers();
