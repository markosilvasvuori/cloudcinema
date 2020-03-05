const headerNav = document.querySelector('#search');
const accountButton = document.querySelector('.account-button');
const baseUrl = 'https://image.tmdb.org/t/p/'
const api = '93530160840d922e585f6b81bf62a7a0'
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

// API
window.onload = () => {
    getUpcomingMovies();
    getPopularMovies();
    getNowPlayingMovies();
}

function getUpcomingMovies() {
    const upcomingMovies = document.querySelector('#upcoming ul');
    let output = '';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.themoviedb.org/3/movie/upcoming?api_key=${api}&language=en-US&page=1`, true);

    xhr.onload = function() {
        if (xhr.status == 200) {
            const movies = JSON.parse(xhr.responseText);
            console.log(movies)

            for (let i = 0; i < 5; i += 1) {
                let poster = baseUrl + 'w500' + movies.results[i].poster_path
                output += `<li><img src="${poster}" alt=""></li>`
            }

            upcomingMovies.innerHTML += output;
        }
    }

    xhr.send();
}

function getPopularMovies() {
    const popularMovies = document.querySelector('#popular ul');
    let output = '';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.themoviedb.org/3/movie/popular?api_key=${api}&language=en-US&page=1`, true);

    xhr.onload = function() {
        if (xhr.status == 200) {
            const movies = JSON.parse(xhr.responseText);
            console.log(movies);

            for (let i = 0; i < 5; i += 1) {
                let poster = `${baseUrl}w500${movies.results[i].poster_path}`;
                output += `<li><img src="${poster}" alt=""></li>`;
            }

            popularMovies.innerHTML += output;
        }
    }

    xhr.send();
}

function getNowPlayingMovies() {
    const nowPlayingMovies = document.querySelector('#now-playing ul');
    let output = '';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.themoviedb.org/3/movie/now_playing?api_key=${api}&language=en-US&page=1`, true);

    xhr.onload = function() {
        if (xhr.status == 200) {
            const movies = JSON.parse(xhr.responseText);
            console.log(movies);

            for (let i = 0; i < 5; i += 1) {
                let poster = `${baseUrl}w500${movies.results[i].poster_path}`;
                output += `<li><img src="${poster}" alt=""></li>`;
            }

            nowPlayingMovies.innerHTML += output;
        }
    }

    xhr.send();
}