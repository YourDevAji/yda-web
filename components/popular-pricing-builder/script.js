import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const popularPricingWidget = new HtmlWidget();


export async function pouplarCard(data){
    //    const data = {
    //        "title": "ENTERPRISE",
    //        "description": "Best for large enterprises & teams.",
    //        "buttonText": "Contact sales",
    //        "price": "$300",
    //        "period": "/month",
    //        "inclusionTitle": "Plan includes:",
    //        "inclusions": [
    //            "Unlimited access",
    //            "24/7 support",
    //            "Dedicated account manager",
    //            "Custom solutions"
    //        ]
    //    };

    const renderedCard = await popularPricingWidget.renderFromFile('/components/popular-pricing-builder/index.html', data);
    return renderedCard;
}