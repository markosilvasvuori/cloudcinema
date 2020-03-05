const headerNav = document.querySelector('#search');
const accountButton = document.querySelector('.account-button');
let searchValue = '';

// Search elements
const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'search');
searchInput.setAttribute('placeholder', 'Search...');
searchInput.classList.add('search-input');
searchInput.style.display = 'none';
headerNav.appendChild(searchInput);

const searchButton = document.createElement('img');
searchButton.setAttribute('src', 'img/search-icon.svg');
searchButton.setAttribute('type', 'submit');
searchButton.classList.add('search-button');
headerNav.appendChild(searchButton);

searchButton.addEventListener('click', (e) => {
    accountButton.style.display = 'none';
    searchInput.style.display = 'block';
    searchInput.focus();
    e.preventDefault();
});

searchInput.onblur = function() {
    searchInput.style.display = 'none';
    accountButton.style.display = 'block';
    searchValue = searchInput.value;
    searchInput.value = '';
}