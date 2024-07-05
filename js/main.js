import {createOption, createListItem} from './dom.js';
import {getRegions, getDepartments, getCities} from './geoApi.js';

const elements = {
    regionsList: document.querySelector('#regions-list'),
    departmentsList: document.querySelector('#departments-list'),
    citiesList: document.querySelector('#cities-list'),
    departmentForm: document.querySelector('#department-form'),
    errorText: document.querySelector('#error-text')
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRegions();
        await loadDepartments();
    } catch (error) {
        showError(error);
    }
});

elements.regionsList.addEventListener('change', async () => {
    try {
        await loadDepartments();
    } catch (error) {
        showError(error);
    }
});

elements.departmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        await loadCities();
    } catch (error) {
        showError(error);
    }
});

function showError(error) {
    elements.errorText.removeAttribute('hidden');
    elements.errorText.textContent = error.message;
}

async function loadRegions() {
    const regions = await getRegions();
    createOption("Toutes les régions", -1, elements.regionsList);
    regions.forEach(region => createOption(region.nom, region.code, elements.regionsList));
}

async function loadDepartments() {
    const codeRegion = Number(elements.regionsList.value) === -1 ? null : elements.regionsList.value;
    const departments = await getDepartments(codeRegion);
    elements.departmentsList.innerHTML = '';
    createOption("Tous les départements", -1, elements.departmentsList);
    departments.forEach(department => createOption(department.nom, department.code, elements.departmentsList));
}

async function loadCities() {
    const codeDepartment = Number(elements.departmentsList.value) === -1 ? null : elements.departmentsList.value;
    const codeRegion = Number(elements.regionsList.value) === -1 ? null : elements.regionsList.value;
    
    const cities = await getCities(codeDepartment, codeRegion);
    cities.sort(sortCitiesByPopulation);
    
    // Number formatter
    const formatter = new Intl.NumberFormat('fr-FR');
    
    // Html rendering
    elements.citiesList.innerHTML = '';
    cities.slice(0, 100).forEach(city => {
        const population = formatter.format(city.population);
        const content = `${city.nom} (${population})`;
        createListItem(content, elements.citiesList);
    });
}

function sortCitiesByPopulation(a, b) {
    if (!a.population) {
        return 1;
    }
    
    if (!b.population) {
        return -1;
    }
    
    return b.population - a.population;
}