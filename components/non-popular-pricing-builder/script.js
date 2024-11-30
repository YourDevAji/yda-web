import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const nonPopularPricingWidget = new HtmlWidget();


export async function nonPouplarCard(data){
    const renderedCard = await nonPopularPricingWidget.renderFromFile('/components/non-popular-pricing-builder/index.html', data);
    return renderedCard;
}