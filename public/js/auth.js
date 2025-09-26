let userManager = null;

const config = {
    authority: 'https://CUSTOM_DOMAIN',
    client_id: 'CLIENT_ID', // Your Client ID from Zitadel
    redirect_uri: 'http://localhost:4000', // Redirect URI you set in Zitadel
    post_logout_redirect_uri: 'http://localhost:4000', // Optional logout redirect URL
    response_type: 'code',
    scope: 'openid profile email', // Scopes you want
    code_challenge_method: 'S256'
};

function initAuth() {
    userManager = new oidc.UserManager(config);
}


// Function to start the login process
function login() {
    userManager.signinRedirect();
}

// Function to handle the callback response after login
const handleCallback = async ()  => {
    try {
        await userManager.signinRedirectCallback();
        removeQueryStringParametersFromCurrentURL();
    } catch (error) {
        console.error('Error during callback handling: ', error);
    }
}

// Function to check if user is authenticated
const getUser = async () => {
    return await userManager.getUser();
}

// Function to log the user out
const logout = () => {
    userManager.signoutRedirect();
}

function removeQueryStringParametersFromCurrentURL() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Create a URL object from the current URL
    const urlObj = new URL(currentUrl);

    // Remove the query string by setting search to an empty string
    urlObj.search = '';

    // Use history.pushState() to update the address bar without reloading the page
    window.history.pushState({}, '', urlObj.toString());
}

function decodeJWT(jwt) {
    // Split the JWT into its three parts: header, payload, and signature
    const parts = jwt.split('.');

    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    // The payload is the second part (index 1)
    const payloadBase64 = parts[1];

    // Decode the base64-encoded payload
    const decodedPayload = atob(payloadBase64.replace(/_/g, '/').replace(/-/g, '+'));

    // Parse the JSON string into an object
    const payloadObj = JSON.parse(decodedPayload);

    return payloadObj;
}