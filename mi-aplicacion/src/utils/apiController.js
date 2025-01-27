const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function fetchData(route, method = 'GET', data = null) {
    try {
        let url = new URL(route, BASE_URL);
        // console.log('URL completa:', url.toString());
        const token = localStorage.getItem('token');

        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        }

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            for (const key in data) {
                url.searchParams.append(key, data[key]);
            }
        }

        console.log('Fetching:', url.toString(), fetchOptions);

        const response = await fetch(url.toString(), fetchOptions);
        console.log("response", response)
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Error en la peticiÃ³n');
        }

        return {
            success: true,
            data: responseData
        };
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


export {
    login
};