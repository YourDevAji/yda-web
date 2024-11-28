import supabaseClient from '/scripts/supabaseClient.js'

// Get the input element and output paragraph
const categoryText = document.getElementById('left-search');
const typeText = document.getElementById('middle-search');

let currentCategory;

// Add an event listener for the 'categoryText' event
categoryText.addEventListener('input', function(event) {
    // Get the current value of the input
    const inputValue = event.target.value;

    // Call function to fetch categories from db
    fetchCategories(inputValue);
});

// Add an event listener for the 'typeText' event
typeText.addEventListener('input', function(event) {
    // Get the current value of the input
    const inputValue = event.target.value;

    // Call function to fetch types from db

    // Display the value in the popup
    console.log(inputValue);
});


// Function to fetch categories based on user input
async function fetchCategories(inputValue) {
    if(inputValue.length === 0){
        clearContent('.left-content');
        return;
    }
    populateLoading('.left-content',true);
    const { data, error } = await supabaseClient
        .from('category_table')  // Replace with your actual table name
        .select('*')
        .ilike('category_identity', `%${inputValue}%`);  // Adjust column name as needed
    populateLoading('.left-content',false);
    if (error) {
        console.error('Error fetching categories:', error);
    } else if(data.length > 0) {
        populateCategorySearchResults('.left-content',data);
    }else{
        //        Empty Result
    }
}

function populateLoading(containerClass,show){
    const container = document.querySelector(containerClass);
    clearContent(containerClass);

    if(show){
        styledPopulation('.left-search',true);
        container.classList.add('visible');
        container.classList.remove('hidden');
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('loader-popup');
        container.appendChild(loadingDiv);
    }
}

function styledPopulation(containerClass,show){
    const container = document.querySelector(containerClass);
    if(show){
        container.classList.add('populate-content-border');
        container.classList.remove('no-content-border');
    }else{
        container.classList.add('no-content-border');
        container.classList.remove('populate-content-border');
    }
}

function clearContent(containerClass){
    const container = document.querySelector(containerClass);
    styledPopulation('.left-search',false);
    container.classList.remove('visible');
    container.classList.add('hidden');
    container.innerHTML = ''; // Clear previous results
}

// Helper function to create and append result items
function populateCategorySearchResults(containerClass, data) {
    const container = document.querySelector(containerClass);

    clearContent(containerClass);
    styledPopulation('.left-search',true);
    container.classList.add('visible');
    container.classList.remove('hidden');
    data.forEach(item => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-popup-result');
        resultDiv.innerText = item['category_identity']; // Show either category_identity or type_identity

        // You can add click event if needed to select a result
        resultDiv.addEventListener('click', () => {
            categoryText.value = item['category_identity'];
            currentCategory = item;
            clearContent(containerClass);
        });

        container.appendChild(resultDiv);
    });
}

export async function startSearch(param){
    //    console.log(supabaseClient);
}
