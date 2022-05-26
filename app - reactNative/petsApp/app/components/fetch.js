const apiURL = "http://10.0.2.2:3000"

export const FetchFunctionPost = (endpoint, body, headers) => {
    const URL = `${apiURL}${endpoint}`;
    return fetch(URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    }).then((res) => res.json());
}

export const FetchFunctionPut = (endpoint, body, headers) => {
    const URL = `${apiURL}${endpoint}`;
    return fetch(URL, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    }).then((res) => res.json());
}

export const FetchFunctionPostForm = (endpoint, body, headers) => {
    const URL = `${apiURL}${endpoint}`;
    return fetch(URL, {
        method: 'POST',
        headers: headers,
        body: body
    }).then((res) => res.json());
}

export const FetchFunctionGet = (endpoint, headers) => {
    const URL = `${apiURL}${endpoint}`;
    return fetch(URL, {
        method: 'GET',
        headers: headers,
    }).then((res) => res.json());
}

export const FetchFunctionDelete = (endpoint, headers) => {
    const URL = `${apiURL}${endpoint}`;
    return fetch(URL, {
        method: 'DELETE',
        headers: headers,
    }).then((res) => res.json());
}