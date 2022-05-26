'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const input = document.querySelector('.input-country-name');

// Auxiliary functions /pomocnicze

//Render country
const renderCountry = function (data, classname) {
  const html = `<article class="country ${classname}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        data.population / 1000000
      ).toFixed(1)} Mln</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(data.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = '1';
};

// Throw errors
const throwError = function (error, message) {
  countriesContainer.style.opacity = 1;
  countriesContainer.insertAdjacentText('afterbegin', `${message} ${error}`);
};

//  Multiple neighbours
const renderNeighbour = function (data) {
  data.forEach(neighbour =>
    fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
      .then(response => response.json())
      .then(data => renderCountry(...data, 'neighbour'))
  );
};

//Consuming Promises

//
const getCountryDataM = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok) throw new Error('Country not found');
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      if (!data[0].borders) return;

      renderNeighbour(data[0].borders);
    })
    .catch(error => throwError(error, 'Something went wrong 💥💥💥'));
};

// Single neighbour Jonas

input.addEventListener('keypress', e => {
  if (e.key === 'Enter' && input.value) {
    countriesContainer.textContent = '';
    getCountryDataM(input.value);
  }
});
