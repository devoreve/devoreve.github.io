const baseUrl = 'https://geo.api.gouv.fr';

function sendRequest(endpoint) {
    return fetch(`${baseUrl}${endpoint}`).then(response => {
        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`Geo service not available`);
                    break;
                default:
                    throw new Error("An error occured. Please contact the developer");
            }
        }
        
        return response.json();
    });
}

export function getRegions() {
    return sendRequest('/regions');
}

export function getDepartments(codeRegion = null) {
    if (codeRegion === null) {
        return getAllDepartments();
    } else {
        return getDepartmentsFromRegion(codeRegion);
    }
}

export function getCities(codeDepartment = null, codeRegion = null) {
    if (codeDepartment !== null) {
        return getCitiesFromDepartment(codeDepartment);
    }
    
    if (codeRegion !== null) {
        return getCitiesFromRegion(codeRegion)
    } else {
        return getAllCities();
    }
}

function getDepartmentsFromRegion(codeRegion) {
    return sendRequest(`/regions/${codeRegion}/departements`);
}

function getAllDepartments() {
    return sendRequest(`/departements`);
}

function getCitiesFromDepartment(codeDepartment) {
    return sendRequest(`/departements/${codeDepartment}/communes`);
}

function getCitiesFromRegion(codeRegion) {
    return sendRequest(`/communes?codeRegion=${codeRegion}`);
}

function getAllCities() {
    return sendRequest(`/communes`);
}