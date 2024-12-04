////// Add stylesheet dynamically
////const link = document.createElement("link");
////link.rel = "stylesheet";
////link.href = "/components/header-builder/style.css";
////link.type = "text/css";
////document.head.appendChild(link);
//

// Initialize HtmlWidget
const headerWidget = new HtmlWidget();

// Define header element IDs and track processed headers
const headerElements = ['home-header', 'offers-header', 'royalties-header', 'why-us-header', 'get-started-header' ];
const processedHeaders = new Set(); // Use a Set for faster lookups

// Function to render and append headers
async function appendHeaders() {
    try {
        // Retrieve the cached rendered header from sessionStorage
        let renderedHeader = sessionStorage.getItem('header-builder');

        // If not cached, render the header and cache it
        if (!renderedHeader) {
            const headerDOM = await headerWidget.renderFromFile('/components/header-builder/index.html', {});
            renderedHeader = headerDOM.element.outerHTML;
            if (renderedHeader) {
                sessionStorage.setItem('header-builder', renderedHeader);
            } else {
                console.error("Failed to render header content.");
                return;
            }
        }

        // Append the rendered header to all specified elements
        for (const headerId of headerElements) {
            if (!processedHeaders.has(headerId)) {
                const headerElement = document.getElementById(headerId);

                if (headerElement) {
                    processedHeaders.add(headerId); // Mark as processed
                    headerElement.innerHTML = renderedHeader; // Insert content
                } else {
                    //                    console.warn(`Header element with ID "${headerId}" not found.`);
                }
            }
        }
    } catch (error) {
        console.error("Error appending headers:", error);
    }
}

// Call the function to append headers
appendHeaders();
