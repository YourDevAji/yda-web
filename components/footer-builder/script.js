// Initialize HtmlWidget
const footerWidget = new HtmlWidget();

// Define footer element IDs and track processed footers
const footerElements = ['home-footer', 'offers-footer', 'royalties-footer', 'why-us-footer', ];
const processedfooters = new Set(); // Use a Set for faster lookups

// Function to render and append footers
async function appendfooters() {
    try {
        // Retrieve the cached rendered footer from sessionStorage
        let renderedFooter = sessionStorage.getItem('footer-builder');

        // If not cached, render the footer and cache it
        if (!renderedFooter) {
            const footerDOM = await footerWidget.renderFromFile('/components/footer-builder/index.html', {});
            renderedFooter = footerDOM.element.outerHTML;
            if (renderedFooter) {
                sessionStorage.setItem('footer-builder', renderedFooter);
            } else {
                console.error("Failed to render footer content.");
                return;
            }
        }

        // Append the rendered footer to all specified elements
        for (const footerId of footerElements) {
            if (!processedfooters.has(footerId)) {
                const footerElement = document.getElementById(footerId);

                if (footerElement) {
                    processedfooters.add(footerId); // Mark as processed
                    footerElement.innerHTML = renderedFooter; // Insert content
                } else {
                    //                    console.warn(`footer element with ID "${footerId}" not found.`);
                }
            }
        }
    } catch (error) {
        console.error("Error appending footers:", error);
    }
}

// Call the function to append footers
appendfooters();

