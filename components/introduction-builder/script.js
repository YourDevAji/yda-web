// Initialize HtmlWidget
const introductionWidget = new HtmlWidget();


export async function introductionViewer(data){
    const renderedCard = await introductionWidget.renderFromFile('/components/introduction-builder/index.html', data);
    return renderedCard.element;
}