import HtmlWidget from '/components/html-widget.js';


// Add stylesheet dynamically
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/components/shimmer-builder/style.css";
link.type = "text/css";
document.head.appendChild(link);



export function shimmerShape(style) {
    const shimmerWidget = new HtmlWidget();
    const shimmerContainer = document.createElement('div');

    // Render HTML string and assign it to the container's innerHTML
    shimmerContainer.innerHTML = shimmerWidget.render(`
        <div class="${style} shimmer-shape"></div>
    `);

    // Return the first child of the container, which is the actual shimmer shape node
    return shimmerContainer.firstElementChild;
}

