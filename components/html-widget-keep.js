class HtmlWidget {
    constructor(defaultPlaceholderValue = '', cacheLimit = 100, cacheExpirationMs = 60000) {
        this.defaultPlaceholderValue = defaultPlaceholderValue;
        this.placeholderPattern = /{{(.*?)}}/g; // Matches {{key}}
        this.loopPattern = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g; // Matches {{#key}}...{{/key}}
        this.conditionalPattern = /{{#if (.*?)}}([\s\S]*?){{\/if}}/g; // Matches {{#if condition}}...{{/if}}

        // Cache configurations
        this.cacheLimit = cacheLimit;
        this.cacheExpirationMs = cacheExpirationMs;

        this.templateCache = new Map(); // Template cache
        this.renderedCache = new Map(); // Rendered output cache
    }

    // Main rendering function
    render(template, params = {}) {
        const cacheKey = this.generateCacheKey(template, params);

        // Check rendered cache
        if (this.renderedCache.has(cacheKey)) {
            const { value, timestamp } = this.renderedCache.get(cacheKey);

            // Check if cached item is still valid
            if (Date.now() - timestamp < this.cacheExpirationMs) {
                return value; // Return cached value
            } else {
                this.renderedCache.delete(cacheKey); // Expired, remove from cache
            }
        }

        // Process the template
        template = template.replace(this.conditionalPattern, (match, condition, innerContent) => {
            const result = this.evaluateCondition(condition, params);
            return result ? innerContent : '';
        });

        template = template.replace(this.loopPattern, (match, key, innerTemplate) => {
            const array = params[key];
            if (Array.isArray(array)) {
                return array.map(item => this.render(innerTemplate, typeof item === 'object' ? item : { '.': item })).join('');
            }
            console.warn(`Warning: Placeholder for array "${key}" is missing or not an array.`);
            return '';
        });

        template = template.replace(this.placeholderPattern, (match, key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                return this.escapeHtml(params[key]);
            }
            console.warn(`Warning: Placeholder "${key}" has no matching value. Using default.`);
            return this.escapeHtml(this.defaultPlaceholderValue);
        });

        // Cache rendered output
        this.setCache(this.renderedCache, cacheKey, template);

        return template;
    }

    // Fetch and cache HTML templates
    async fetchHtmlFile(filePath) {
        // Check cache first
        if (this.templateCache.has(filePath)) {
            const { value, timestamp } = this.templateCache.get(filePath);

            // Check if cached item is still valid
            if (Date.now() - timestamp < this.cacheExpirationMs) {
                return value;
            } else {
                this.templateCache.delete(filePath); // Expired, remove from cache
            }
        }

        // Fetch the template
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
            }
            const template = await response.text();

            // Cache fetched template
            this.setCache(this.templateCache, filePath, template);

            return template;
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

    // Set item in cache with auto-clearing
    setCache(cache, key, value) {
        if (cache.size >= this.cacheLimit) {
            const firstKey = cache.keys().next().value; // Get the first inserted key
            cache.delete(firstKey); // Remove least recently used
        }
        cache.set(key, { value, timestamp: Date.now() }); // Add to cache with timestamp
    }

    // Generate a unique cache key for template and params
    generateCacheKey(template, params) {
        const paramsKey = JSON.stringify(params, Object.keys(params).sort());
        return `${template}|${paramsKey}`;
    }

    evaluateCondition(condition, params) {
        condition = condition.replace(/(\w+)/g, (match, key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                return `params["${key}"]`;
            }
            return match;
        });

        try {
            return new Function('params', `return ${condition};`)(params);
        } catch (error) {
            console.error("Error evaluating condition:", error);
            return false;
        }
    }

    escapeHtml(value) {
        if (typeof value !== "string") return value;
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
}
export default HtmlWidget;
