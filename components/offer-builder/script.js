import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const offerWidget = new HtmlWidget();


export async function offerViewer(data){
    const renderedCard = await offerWidget.renderFromFile('/components/offer-builder/index.html', data);
    return renderedCard;
}