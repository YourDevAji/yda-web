import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const popularPricingWidget = new HtmlWidget();

export async function pouplarCard(data){
    const renderedCard = await popularPricingWidget.renderFromFile('/components/pricing-builder/index.html', data);
    return renderedCard.element;
}