// Initialize HtmlWidget
const statWidget = new HtmlWidget();


export async function statViewer(data){
    const renderedCard = await statWidget.renderFromFile('/components/stat-builder/index.html', data);
    return renderedCard.element;
}