class HtmlWidget {
    constructor(defaultPlaceholderValue = '') {
        this.defaultPlaceholderValue = defaultPlaceholderValue;
        this.placeholderPattern = /{{(.*?)}}/g; // Matches {{key}}
        this.loopPattern = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g; // Matches {{#key}}...{{/key}}
    }

    render(template, params = {}) {
        // Handle loops (arrays)
        let rendered = template.replace(this.loopPattern, (match, key, innerTemplate) => {
            const array = params[key];
            if (Array.isArray(array)) {
                return array.map(item => {
                    // Replace the {{.}} inside the loop with the current item
                    const innerRendered = innerTemplate.replace(/{{\.(.*?)}}/g, (match, subKey) => {
                        return this.escapeHtml(item[subKey] || item); // Use the item if no subKey is specified
                    });
                    return innerRendered;
                }).join('');
            }
            console.warn(`Warning: Placeholder for array "${key}" is missing or not an array.`);
            return '';
        });

        // Handle regular placeholders
        rendered = rendered.replace(this.placeholderPattern, (match, key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                return this.escapeHtml(params[key]);
            }
            console.warn(`Warning: Placeholder "${key}" has no matching value. Using default.`);
            return this.defaultPlaceholderValue;
        });

        return rendered;
    }


    escapeHtml(value) {
        // Convert special HTML characters to their entity equivalents
        if (typeof value !== "string") return value; // Skip non-string values
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    async fetchHtmlFile(filePath) {
        try {
            const response = await fetch(filePath); // Fetch the file
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
            }
            return await response.text(); // Read the content as text
        } catch (error) {
            console.error("Error fetching HTML file:", error);
            return null;
        }
    }

    async renderFromFile(filePath, params = {}) {
        const htmlContent = await this.fetchHtmlFile(filePath);
        if (htmlContent) {
            return this.render(htmlContent, params);
        }
        console.error("Failed to render template from file.");
        return '';
    }
}

export default HtmlWidget;  // Export the class
