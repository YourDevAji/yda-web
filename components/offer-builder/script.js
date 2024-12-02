import HtmlWidget from '/components/html-widget.js';


// Initialize HtmlWidget
const offerWidget = new HtmlWidget();


export async function offerViewer(data){
    const renderedCard = await offerWidget.renderFromFile('/components/offer-builder/index.html', data);
    if(renderedCard.state.title === "2D Games"){
        setTimeout(() => {
            renderedCard.update({description: "Testing"});
            console.log(renderedCard.state.title);
        }, 5000);
    }
    return renderedCard.element;
}
