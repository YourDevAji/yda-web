import { loginDOM } from '/components/login-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';


const params = {
    title: "Welcome back",
    message: "Sign in into account",
    accounts: [
        {
            accountType: 'developer',
            buttonId: 'developer-button',
            buttonClass: 'get-started-login-button developer-button',
            inputClass: 'active',
            inputId: 'developer-radio-button',
            accountTitle: 'Developer'
        },
        {
            accountType: 'employer',
            buttonId: 'employer-button',
            buttonClass: 'get-started-login-button employer-button',
            inputClass: 'normal',
            inputId: 'employer-radio-button',
            accountTitle: 'Employer'
        }
    ],
    warner: "Password is required",
    warnerDisplay: 'get-started-no-warner',
    actionHolder: "Don't have an account?",
    actionText: "Sign Up",
    terms: "#",
    privacy: "#"
};


const loginContainer = document.getElementById('get-started-left-content');
const developerButton = document.getElementById('developer-button');
const employerButton = document.getElementById('employer-button');

const loginViever = await loginDOM(params);
loginContainer.appendChild(loginViever.element);



// To update the accountTitle dynamically:
setTimeout(() => {
    // Update the accountTitle of the first account
    //    params.accounts[0].accountTitle = 'Super Developer';

    // Update the template with the new accountTitle
    loginViever.update({ accounts: params.accounts });

    console.log('Updated accountTitle:', params.accounts[0].accountTitle);
}, 2000);

