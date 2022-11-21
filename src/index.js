import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const textInput = document.querySelector('input')
const countryList = document.querySelector('ul')

textInput.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY))
let markup

function getCountry(event) {
    const countryToSearch = event.target.value.trim()
    if(countryToSearch !== '') {
        fetchCountries(countryToSearch)
    }
}

function fetchCountries(name) {
fetch(`https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`)
.then(response => {
    responseNoCountry(response)
    return response.json()})
.then(data => {
    countryList.innerHTML=''
    manyFounds(data)
    severalFounds(data)
    onlyOneFound(data)
    } 
)
.catch(error => {
    errorNoCountry(error)
    console.log(error)
});
}

function errorNoCountry(error) {
    if(error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return}
}

function responseNoCountry(response) {
    if (!response.ok) {
        throw new Error(response.status)
    }
}

function manyFounds(data) {
    if (data.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
    }
}

function severalFounds(data) {
    if (data.length <= 10 && data.length > 1) {
        markup = data.map(country => 
        `<li style="list-style: none">            
        <p style="font-size:32px"><img src='${country.flags.svg}' width="50" alt="${country.name} flag" style='margin-right: 20px'/><b>${country.name}<b/></p>   
        </li>`
        ).join('')
        countryList.insertAdjacentHTML('afterbegin', markup);
    } 
}

function onlyOneFound(data) {
    if (data.length === 1) {
        markup = data.map(country => 
            `<li style="list-style: none">                         
            <p style="font-size:60px"><img src='${country.flags.svg}' width="75" alt="${country.name} flag" style='margin-right: 20px'/><b>${country.name}<b/></p>
            <p>Capital: <span style='color: gray'>${country.capital}</span></p>
            <p>Population: <span style='color: gray'>${country.population}</span></p>
            <p>Languages: <span style='color: gray'>${country.languages.map(language => language.name).join(', ')}</span></p>
                 
            </li>`
            ).join('')
            countryList.insertAdjacentHTML('afterbegin', markup);
    } 
}