
const contentContainer = document.getElementById('content-container')
const loginForm = document.getElementById('login-form')
const searchForm = document.getElementById('search-form')

const baseEndpoint = "http://localhost:8000/api"
if (loginForm) {
    // handle this login form
    loginForm.addEventListener('submit', handleLogin)
}
if (searchForm) {
    // handle this search form
    searchForm.addEventListener('submit', handleSearch)
}

function handleLogin(event) {
    event.preventDefault()
    const loginEndpoint = `${baseEndpoint}/token/`
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyStr = JSON.stringify(loginObjectData)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyStr
    }
    fetch(loginEndpoint, options)
    .then(response=>{
        return response.json()
    })
    .then(authData => {
        handleAuthData(authData, getProductList)
    })
    .catch(err=> {
        console.log('err', err)
    })
}

function handleSearch(event) {
    event.preventDefault()
    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)
    const endpoint = `${baseEndpoint}/search/?${searchParams}`
    const headers = {
        "Content-Type": "application/json"
    }
    const authToken = localStorage.getItem('access')
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }
    const options = {
        method: "GET",
        headers: headers
    }
    fetch(endpoint, options)
    .then(response=>{
        return response.json()
    })
    .then(data => {
        const validData = isTokenNotValid(data)
        if (validData && contentContainer){
            contentContainer.innerHTML = ""
            if (data && data.hits) {
                let htmlStr = ""
                for (let result of data.hits) {
                    htmlStr += "<li>" + result.title + "</li>"
                }
                contentContainer.innerHTML = htmlStr
                if (data.hits.length === 0) {
                    contentContainer.innerHTML = "<p>No results found</p>"
                }
            }else {
                contentContainer.innerHTML = "<p>No results found</p>"
            }
        }
    })
    .catch(err=> {
        console.log('err', err)
    })
}

function handleAuthData(authData, callback) {
    console.log('Auth Data:', authData); // Debugging line
    if (authData.access && authData.refresh) {
        localStorage.setItem('access', authData.access)
        localStorage.setItem('refresh', authData.refresh)
        if (callback) {
            callback()
        }
    } else {
        console.error('Invalid auth data received:', authData);
    }
}


function writeToContainer(data) {
    if (contentContainer) {
        contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
    }
}

function getFetchOptions(method, body){
    const token = localStorage.getItem('access');
    console.log('Token:', token); // Debugging line
    return {
        method: method === null ? "GET" : method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body : null
    } 
}

function isTokenValid(jsonData) {
    if (jsonData.code && jsonData.code === "token_not_valid"){
        // run a refresh token
        alert("Please login again")
        return false
    }
    return true
}

function getProductList() {
    const endpoint = `${baseEndpoint}/products/`
    const options = getFetchOptions('GET')
    fetch(endpoint, options)
    .then(response=>{
        console.log(response) // Log the full response
        return response.json()
    })
    .then(data=> {
        const validData = isTokenValid(data)
        if (validData) {
            writeToContainer(data)
        }
    })
    .catch(err => {
        console.error('Error fetching product list:', err);
    });
}

function isTokenNotValid (jsonData) {
    if (jsonData.code && jsonData.code === "token_not_valid"){
        alert ("Please login again")
        return false
    }
    return true
}

function validateJWTToken() {
    // fetch
    const endpoint = `${baseEndpoint}/token/verify/`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: localStorage.getItem('access')
        })
    }
    fetch(endpoint, options)
    .then(response => response.json())
    .then(x => {
        console.log(x)
    })
}

function refreshToken() {
    const refreshEndpoint = `${baseEndpoint}/token/refresh/`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh: localStorage.getItem('refresh') })
    }
    fetch(refreshEndpoint, options)
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem('access', data.access)
            getProductList() // Retry the original request
        } else {
            console.error('Failed to refresh token:', data)
        }
    })
    .catch(err => {
        console.error('Error refreshing token:', err)
    })
}


validateJWTToken()
// getProductList()


const searchClient = algoliasearch('2YMI0WUHR6', '7a8ef64c6ca67655f430e911b16fa8ab');

const search = instantsearch({
    indexName: 'nesti_Product',
    searchClient,
});

search.addWidgets([
    instantsearch.widgets.searchBox({
    container: '#searchbox',
    }),

    instantsearch.widgets.clearRefinements({
    container: "#clear-refinements"
    }),

    instantsearch.widgets.searchBox({
        container: "#user-list",
        attribute: "user"
    }),

    instantsearch.widgets.searchBox({
        container: "#public-list",
        attribute: "public"
    }),

    instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        item: 
            `<div>
                <div>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</div>
                <div>{{#helpers.highlight}}{ "attribute": "content" }{{/helpers.highlight}}</div>
                <p>{{user}}</p><p>\${{price}}</p>
            </div>`
    }

    })
]);

search.start();
