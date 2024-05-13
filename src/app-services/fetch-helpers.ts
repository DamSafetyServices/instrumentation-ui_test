const API_ROOT = import.meta.env.VITE_API_URL as string;

interface OptsType extends RequestInit {
    isFormData?: boolean;
}

interface CommonItems {
    root: string;
}

export const commonFetch = async (root: string, path: string, options: OptsType): Promise<JSON> => {
    const res = await fetch(`${root}${path}`, options);

    if (res.status === 204) return {} as JSON;
    else if (!res.ok) throw new Error(res.statusText);

    return (await res.json()) as JSON;
};

const getCommonItems = (): CommonItems => ({
    root: API_ROOT,
});

const defaultHeaders = () => {
    const token = sessionStorage.getItem('accessToken') as string;

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const apiFetch = (path: string, options: OptsType) => {
    const { root } = getCommonItems();

    options.headers = { ...defaultHeaders() };
    return fetch(`${root}${path}`, options);
};

export const apiGet = (path: string) => {
    const { root } = getCommonItems();
    const options = { method: 'GET' } as OptsType;

    options.headers = { ...defaultHeaders() };
    return commonFetch(root, path, options);
};

export const apiPut = (path: string, payload: JSON) => {
    const { root } = getCommonItems();
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    } as OptsType;

    options.headers = {
        ...options.headers,
        ...defaultHeaders(),
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    return commonFetch(root, path, options);
};

/**
 * Function to send a POST request to the api.
 * @param {String} path - The URI of the request, will be appended to base path.
 * @param {JSON | FormData} payload - The payload of the request. If FormData, request will be sent with Content-Type: multipart/form-data
 * @param {OptsType} opts - Options provided to the function to alter the request.
 * @returns
 */
export const apiPost = (path: string, payload: JSON | FormData, opts?: OptsType) => {
    const { root } = getCommonItems();
    const { isFormData } = opts || {};

    const options = {
        method: 'POST',
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
        },
    } as OptsType;

    options.headers = {
        ...options.headers,
        ...defaultHeaders(),
    };

    if (payload) {
        options.body = (isFormData ? payload : JSON.stringify(payload)) as BodyInit;
    }

    return commonFetch(root, path, options);
};

export const apiPatch = (path: string, payload: JSON | FormData) => {
    const { root } = getCommonItems();
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    } as OptsType;

    options.headers = {
        ...options.headers,
        ...defaultHeaders(),
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    return commonFetch(root, path, options);
};

export const apiDelete = (path: string) => {
    const { root } = getCommonItems();
    const options = {
        method: 'DELETE',
    } as OptsType;

    options.headers = { ...defaultHeaders() };

    return commonFetch(root, path, options);
};
