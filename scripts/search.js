import supabaseClient from '/scripts/supabaseClient.js';

// Get input elements and button
const categoryInput = document.getElementById('left-search');
const typeInput = document.getElementById('middle-search');
const searchButton = document.getElementById('search-button');

let selectedCategory = null;
let selectedType = null;

// Event listeners for category and type inputs
categoryInput.addEventListener('input', (event) => handleCategoryInput(event.target.value));
typeInput.addEventListener('input', (event) => handleTypeInput(event.target.value));
categoryInput.addEventListener('focus', () => handleCategoryFocusChange(true));
typeInput.addEventListener('focus', () => handleTypeFocusChange(true));

const handleCategoryFocusChange = (isFocused) => {
    if (isFocused) {
        clearContainer('.middle-content', '.middle-search');
        handleCategoryInput('%');
    }
};

const handleTypeFocusChange = (isFocused) => {
    if (isFocused) {
        clearContainer('.left-content', '.left-search');
        handleTypeInput('%');
    }
};


// Handles input changes for category
async function handleCategoryInput(inputValue) {
    if (isInputEmpty(inputValue)) {
        resetCategorySelection();
        resetTypeSelection();
        return;
    }
    await fetchAndDisplayResults({
        inputValue,
        fetchFunction: fetchCategories,
        resultContainer: '.left-content',
        stylingClass: '.left-search',
        onSelect: handleCategorySelection,
    });
}

// Handles input changes for type
async function handleTypeInput(inputValue) {
    if (isInputEmpty(inputValue)) {
        resetTypeSelection();
        return;
    }
    const fetchFunction = selectedCategory
    ? (value) => fetchTypesByCategory(value, selectedCategory.category_id)
    : fetchAllTypes;

    await fetchAndDisplayResults({
        inputValue,
        fetchFunction,
        resultContainer: '.middle-content',
        stylingClass: '.middle-search',
        onSelect: handleTypeSelection,
    });
}

// Utility to check if input is empty
function isInputEmpty(value) {
    return value.trim().length === 0;
}

// Resets the selected category
function resetCategorySelection() {
    selectedCategory = null;
    typeInput.value = '';
    clearContainer('.left-content', '.left-search');
    disableSearchButton();
}

// Resets the selected type
function resetTypeSelection() {
    selectedType = null;
    clearContainer('.middle-content', '.middle-search');
    disableSearchButton();
}

// Fetches categories matching input
async function fetchCategories(inputValue) {
    return supabaseClient
        .from('category_table')
        .select('*')
        .ilike('category_identity', `%${inputValue}%`);
}

// Fetches types for a specific category
async function fetchTypesByCategory(inputValue, categoryId) {
    return supabaseClient
        .from('type_table')
        .select('*')
        .eq('category_id', categoryId)
        .ilike('type_identity', `%${inputValue}%`);
}

// Fetches all types matching input
async function fetchAllTypes(inputValue) {
    return supabaseClient
        .from('type_table')
        .select('*,category_table(*)')
        .ilike('type_identity', `%${inputValue}%`);
}

// Displays results and manages the loading state
async function fetchAndDisplayResults({
    inputValue,
    fetchFunction,
    resultContainer,
    stylingClass,
    onSelect,
}) {
    showLoadingIndicator(resultContainer, stylingClass);
    const { data, error } = await fetchFunction(inputValue);
    hideLoadingIndicator(resultContainer, stylingClass);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    if (data?.length > 0) {
        populateResults(resultContainer, data, stylingClass, onSelect);
    } else {
        clearContainer(resultContainer, stylingClass);
    }
}

// Populates the results container with data
function populateResults(containerSelector, data, stylingClass, onSelect) {
    const container = document.querySelector(containerSelector);
    clearContainer(containerSelector, stylingClass);
    applyContainerStyling(stylingClass, true);

    data.forEach((item) => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-popup-result');
        resultDiv.textContent = item['category_identity'] || item['type_identity'];
        resultDiv.addEventListener('click', () => onSelect(item));
        container.appendChild(resultDiv);
    });

    container.classList.add('visible');
    container.classList.remove('hidden');
}

// Handles category selection
function handleCategorySelection(category) {
    categoryInput.value = category['category_identity'];
    selectedCategory = category;
    resetTypeSelection();
    clearContainer('.left-content', '.left-search');
    enableSearchButtonIfReady();
}

// Handles type selection
function handleTypeSelection(type) {
    typeInput.value = type['type_identity'];
    selectedType = type;

    if (!selectedCategory && type['category_table']) {
        handleCategorySelection(type['category_table']);
    }
    clearContainer('.middle-content', '.middle-search');
    enableSearchButtonIfReady();
}

// Enables the search button if both category and type are selected
function enableSearchButtonIfReady() {
    searchButton.disabled = !(selectedCategory && selectedType);
}

// Disables the search button
function disableSearchButton() {
    searchButton.disabled = true;
}

// Shows a loading indicator
function showLoadingIndicator(containerSelector, stylingClass) {
    clearContainer(containerSelector, stylingClass);
    applyContainerStyling(stylingClass, true);

    const container = document.querySelector(containerSelector);
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loader-popup');
    container.appendChild(loadingIndicator);

    container.classList.add('visible');
    container.classList.remove('hidden');
}

// Hides the loading indicator
function hideLoadingIndicator(containerSelector, stylingClass) {
    applyContainerStyling(stylingClass, false);
}

// Clears the container and removes styling
function clearContainer(containerSelector, stylingClass) {
    const container = document.querySelector(containerSelector);
    applyContainerStyling(stylingClass, false);
    container.classList.add('hidden');
    container.classList.remove('visible');
    container.innerHTML = '';
}

// Applies or removes styling to a container
function applyContainerStyling(stylingClass, isPopulated) {
    const element = document.querySelector(stylingClass);
    element.classList.toggle('populate-content-border', isPopulated);
    element.classList.toggle('no-content-border', !isPopulated);
}

export async function startSearch(params) {
    console.log('Starting search with params:', params);
}
