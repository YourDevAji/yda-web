// Initialize HtmlWidget
const loginWidget = new HtmlWidget();

export async function loginDOM(data){
    const rendered = await loginWidget.renderFromFile('/components/login-builder/index.html', data);
    return rendered;
}