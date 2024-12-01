import { offerViewer } from '/components/offer-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

const contentEnd = document.getElementById('offers-content-end');
const container = document.getElementById('offers-content-container');
const offerSearchInput = document.getElementById('offers-search');
const offerSearchClear = document.getElementById('offers-search-clear');

let cache = new Map(); // Cache for offers, keyed by type_id
let displayed = 0;
let isLoading = false;
let afterOffer = ''; // Tracks the last item for pagination
let afterFilter = null; // Tracks the last item for pagination
let currentFilter = ''; // Tracks current search input
const BATCH_SIZE = 20;

// Event listeners for input and focus/blur
offerSearchInput.addEventListener('input', (event) => handleDebouncedInput(event.target.value));
offerSearchInput.addEventListener('focus', () => handleCategoryFocusChange(true));
offerSearchInput.addEventListener('blur', () => handleCategoryFocusChange(false));
offerSearchClear.addEventListener('click', handleOfferClear);

function handleCategoryFocusChange(isFocused) {
}


async function fetchOffers(requiredBatchSize = BATCH_SIZE) {
    if (isLoading || requiredBatchSize <= 0) return;
    isLoading = true;
    handleLoading(true);

    const { data: offers, error } = await supabaseClient
        .from('type_table')
        .select('*')
        .ilike('type_identity', `%${currentFilter}%`)
        .order('type_identity')
        .gte('type_identity',  afterFilter || afterOffer)
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
    if(!fetch){
        afterOffer = (offers.length !== 0) ? offers[offers.length - 1].type_identity : '';}
    else{
        afterFilter = (offers.length !== 0) ? offers[offers.length - 1].type_identity : '';
    }
    let contentHtml = '';
    for (const offer of offers) {
        const param = {
            title: offer.type_identity,
            description: offer.type_description || 'Sample description content for layout testing.'
        };
        const view = await offerViewer(param);
        contentHtml += view;
    }
    container.innerHTML = contentHtml;

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
    afterFilter = null;
    renderOffers([...cache.values()]);
}

function handleLoading(show) {
    contentEnd.innerHTML = show ? '<div class="loader-popup"></div>' : '';
}

function displayError(message) {
    alert(message); // Customize error handling as needed
}

// Debounce function for input handling
let debounceTimeout;
function handleDebouncedInput(value) {
    if (value.length === 0){
        afterFilter = null;
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
