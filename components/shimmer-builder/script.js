// Add stylesheet dynamically
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/components/shimmer-builder/style.css";
link.type = "text/css";
document.head.appendChild(link);



export function shimmerShape(style,inner = '') {
    const shimmerWidget = new HtmlWidget();
    // Render HTML string and assign it to the container's innerHTML
    return shimmerWidget.render(`
        <div class="${style} shimmer-shape">
        ${inner}
        </div>
    `).element;
}

