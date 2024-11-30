import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const skillWidget = new HtmlWidget();


export async function skillViewer(data){
    const renderedCard = await skillWidget.renderFromFile('/components/skill-builder/index.html', data);
    return renderedCard;
}