import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const nonPopularPricingWidget = new HtmlWidget();


export async function nonPouplarCard(){
    const data = {
        "title": "ENTERPRISE",
        "description": "Best for large enterprises & teams.",
        "buttonText": "Contact sales",
        "price": "$300",
        "period": "/month",
        "inclusionTitle": "Plan includes:",
        "inclusions": [
            "Unlimited access",
            "24/7 support",
            "Dedicated account manager",
            "Custom solutions"
        ]
    };

    const renderedCard = await nonPopularPricingWidget.renderFromFile('components/non-popular-pricing-builder/index.html', data);
    return renderedCard;
}