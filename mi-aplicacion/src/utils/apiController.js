const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function fetchData(route, method = 'GET', data = null) {
    try {
        let url = new URL(route, BASE_URL);

        const fetchOptions = {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            for (const key in data) {
                url.searchParams.append(key, data[key]);
            }
        }

        console.log('Sending request to:', url.toString());
        console.log('Request data:', data);

        const response = await fetch(url.toString(), fetchOptions);
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('Parsed response data:', responseData);
            
            // Devolver la respuesta en el formato esperado
            return {
                success: true,
                data: responseData,
                status: response.status
            };

        } catch (e) {
            console.error('Error parsing JSON:', e);
            throw new Error('Invalid JSON response');
        }

    } catch (error) {
        console.error('Fetch error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function login(email, password) {
    return await fetchData('api/login', 'POST', { email, password });
}

async function verify2FA(tokenF2A, email) {
    return await fetchData('api/2fa/verify', 'POST', { tokenF2A, email });
}

async function getAllClients() {
    return await fetchData('/api/client/all');
}

async function getLandingPageData() {
    return await fetchData('/api/landing-page/all');
}

async function getClientData() {
    return await fetchData('/api/client/data');
}

export {
    login,
    getAllClients,
    verify2FA,
    getLandingPageData,
    getClientData
};