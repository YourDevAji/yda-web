// Initialize HtmlWidget
const projectWidget = new HtmlWidget();


export async function projectCard(data){
    const renderedCard = await projectWidget.renderFromFile('/components/project-builder/index.html', data);
    return renderedCard.element;
}