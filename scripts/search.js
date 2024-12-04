import supabaseClient from '/scripts/supabaseClient.js';

// Get input elements and button
const categoryInput = document.getElementById('left-search');
const typeInput = document.getElementById('middle-search');
const searchButton = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container');
const searchOverlay = document.getElementById('search-modal-overlay');
const categorySearchClear = document.getElementById('left-search-clear');
const typeSearchClear = document.getElementById('middle-search-clear');

let selectedCategory = null;
let selectedType = null;

// Event listeners for category and type inputs
categoryInput.addEventListener('input', (event) => handleCategoryInput(event.target.value));
typeInput.addEventListener('input', (event) => handleTypeInput(event.target.value));
categoryInput.addEventListener('focus', () => handleCategoryFocusChange(true));
categoryInput.addEventListener('blur', () => handleCategoryFocusChange(false));
typeInput.addEventListener('focus', () => handleTypeFocusChange(true));
typeInput.addEventListener('blur', () => handleTypeFocusChange(false));
searchOverlay.addEventListener('click', () => handleOutsideTap());
categorySearchClear.addEventListener('click', () => handleCategoryClear());
typeSearchClear.addEventListener('click', () => handleTypeClear());


function handleCategoryClear(){
    typeInput.value = '';
    selectedCategory = null;
    selectedType = null;
    if(categoryInput.value.length === 0){
        clearContainer('.left-content', '.left-search-entry');
        controlSearchClear(categorySearchClear,false);
    }else{
        categoryInput.value = '';
        categoryInput.focus();
    }
    enableSearchButtonIfReady();
}

function handleTypeClear(){
    selectedType = null;
    if(typeInput.value.length === 0){
        clearContainer('.middle-content', '.middle-search-entry');
        controlSearchClear(typeSearchClear,false);
    }else{
        typeInput.value = '';
        typeInput.focus();
    }
    enableSearchButtonIfReady();
}

function handleOutsideTap(){
    clearContainer('.middle-content', '.middle-search-entry');
    clearContainer('.left-content', '.left-search-entry');
    controlSearchClear(categorySearchClear,false);
    controlSearchClear(typeSearchClear,false);
    enableSearchButtonIfReady();
}

const handleCategoryFocusChange = (isFocused) => {
    if (isFocused) {
        clearContainer('.middle-content', '.middle-search-entry');
        controlSearchClear(categorySearchClear,true);
        controlSearchClear(typeSearchClear,false);
        if(categoryInput.value.length === 0){
            handleCategoryInput('%');
        }else{
            handleCategoryInput(categoryInput.value);
        }
    }
};

const handleTypeFocusChange = (isFocused) => {
    if (isFocused) {
        clearContainer('.left-content', '.left-search-entry');
        controlSearchClear(typeSearchClear,true);
        controlSearchClear(categorySearchClear,false);
        if(typeInput.value.length === 0){
            handleTypeInput('%');
        }else{
            handleTypeInput(typeInput.value);
        }
    }
};


// Handles input changes for category
async function handleCategoryInput(inputValue) {
    if (isInputEmpty(inputValue)) {
        resetCategorySelection();
        resetTypeSelection();
        return;
    }
    if(selectedCategory != null && inputValue != selectedCategory['category_identity']){
        selectedCategory = null;
        enableSearchButtonIfReady();
    }
    await fetchAndDisplayResults({
        inputValue,
        fetchFunction: fetchCategories,
        resultContainer: '.left-content',
        stylingClass: '.left-search-entry',
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

    if(selectedType != null && inputValue != selectedType['type_identity']){
        selectedType = null;
        enableSearchButtonIfReady();
    }
    await fetchAndDisplayResults({
        inputValue,
        fetchFunction,
        resultContainer: '.middle-content',
        stylingClass: '.middle-search-entry',
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
    clearContainer('.left-content', '.left-search-entry');
    disableSearchButton();
}

// Resets the selected type
function resetTypeSelection() {
    selectedType = null;
    clearContainer('.middle-content', '.middle-search-entry');
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

//Control Overlay Visilibity
function controlSearchClear(container,show){
    if(show){
        container.style.display = "flex";
    }else{
        container.style.display = "none";
    }
}

//Control Overlay Visilibity
function controlSearchOverlay(show){
    if(show){
        searchOverlay.style.display = "block";
        searchOverlay.style.zIndex = 1001;
        searchContainer.style.zIndex = 2000;
    }else{
        searchOverlay.style.display = "none";
        searchOverlay.style.zIndex = 1;
        searchContainer.style.zIndex = 1;
    }
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

    controlSearchOverlay(true);
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

    clearContainer('.left-content', '.left-search-entry');
    controlSearchClear(categorySearchClear,false);
    enableSearchButtonIfReady();
}

// Handles type selection
function handleTypeSelection(type) {
    typeInput.value = type['type_identity'];
    selectedType = type;
    if (!selectedCategory && type['category_table']) {
        selectedCategory = type['category_table'];
        categoryInput.value  = selectedCategory['category_identity'];
        clearContainer('.left-content', '.left-search-entry');
        controlSearchClear(categorySearchClear,false);
    }
    clearContainer('.middle-content', '.middle-search-entry');
    controlSearchClear(typeSearchClear,false);
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
    controlSearchOverlay(true);
}

// Hides the loading indicator
function hideLoadingIndicator(containerSelector, stylingClass) {
    applyContainerStyling(stylingClass, false);
    controlSearchOverlay(false);
}

// Clears the container and removes styling
function clearContainer(containerSelector, stylingClass) {
    const container = document.querySelector(containerSelector);
    applyContainerStyling(stylingClass, false);
    controlSearchOverlay(false);
    container.classList.add('hidden');
    container.classList.remove('visible');
    container.innerHTML = '';
}

// Applies or removes styling to a container
function applyContainerStyling(stylingClass, isPopulated) {
    const elements = document.querySelectorAll(stylingClass); // Select all matching elements
    elements.forEach(element => { // Iterate over each element
        element.classList.toggle('populate-content-border', isPopulated); // Toggle class based on `isPopulated`
        element.classList.toggle('no-content-border', !isPopulated); // Toggle the opposite class
    });
}


export async function startSearch(params) {
    //    console.log('Starting search with params:', params);
}
