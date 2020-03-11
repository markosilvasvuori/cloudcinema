const headerNav = document.querySelector('#search');
const accountButton = document.querySelector('.account-button');
const mainSlider = document.querySelector('#main-slider');
const baseUrl = 'https://image.tmdb.org/t/p/'
const api = '93530160840d922e585f6b81bf62a7a0'
let searchValue = '';
let dataStorage = [];

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

// Check current page
const currentUrl = window.location.href;
let url = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);

// Homepage functions
if (url === 'index.html') {

    window.onload = () => {
        mainSliderMovies();
        getMovies('popular');
        getMovies('upcoming');
        getMovies('now_playing');
        switchSlides();
    }
}

// API
    function mainSliderMovies() {
        const mainSlider = document.querySelector('#main-slider');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.themoviedb.org/3/movie/upcoming?api_key=${api}&language=en-US&page=1`, true);

        xhr.onload = function() {
            if (xhr.status == 200) {
                const movies = JSON.parse(xhr.responseText);
                console.log(movies);

                for (let i = 0; i < 3; i += 1) {
                    let poster = `${baseUrl}original${movies.results[i].backdrop_path}`;

                    const div = document.createElement('div');
                    const overlay = document.createElement('div');
                    const infoDiv = document.createElement('div');
                    const title = document.createElement('p');
                    const rating = document.createElement('p');
                    const button = document.createElement('button');
                    div.classList.add('slide');
                    div.style.backgroundImage = `url(${poster})`
                    div.setAttribute(`id`, `slide-${[i]}`);
                    overlay.classList.add('overlay');
                    infoDiv.classList.add('slider-info');
                    title.classList.add('title');
                    title.textContent = movies.results[i].title;
                    rating.classList.add('rating');
                    rating.textContent = `${movies.results[i].vote_average} Rating`;
                    button.classList.add('btn');
                    button.textContent = 'Get Tickets';

                    infoDiv.appendChild(title);
                    infoDiv.appendChild(rating);
                    infoDiv.appendChild(button);
                    div.appendChild(overlay);
                    div.appendChild(infoDiv);
                    mainSlider.appendChild(div);
                }
            }
        }

        xhr.send();
    }

    // Main Slider
    function switchSlides() {
        window.setInterval(function() {
            mainSlider.style.transform = 'translate(-100%)';
        }, 5000);

        mainSlider.addEventListener('transitionend', function() {
            mainSlider.appendChild(mainSlider.firstElementChild);

            mainSlider.style.transition = 'none';
            mainSlider.style.transform = 'translate(0)';
            setTimeout(function() {
                mainSlider.style.transition = 'all 0.5s';
            })
        });
    }

    // Homepage movies (popular, upcoming, now playing)
    function getMovies(category) {
        const section = document.querySelector(`#${category} ul`);
        let output = '';

        const xhr = new XMLHttpRequest();
        xhr.open(`GET`, `https://api.themoviedb.org/3/movie/${category}?api_key=${api}&language=en-US&page=1`, true);

        xhr.onload = function() {
            if (xhr.status == 200) {
                const movies = JSON.parse(xhr.responseText);

                for (let i = 0; i < 6; i++) {
                    let poster = `${baseUrl}w500${movies.results[i].poster_path}`
                    // output += `<li><a href="movie.html"><img src="${poster}" alt=""></a></li>`
                    output += `
                    <li
                    data-title="${movies.results[i].title}"
                    data-release-date="${movies.results[i].release_date}"
                    data-rating="${movies.results[i].vote_average}"
                    data-overview="${movies.results[i].overview}"
                    data-backdrop="${baseUrl}original${movies.results[i].backdrop_path}"
                    data-poster="${baseUrl}w500${movies.results[i].poster_path}"
                    onclick="storeData(this)"
                    >
                    <a href="#">
                    <img src="${poster}" alt="">
                    </a>
                    </li>`
                }

                section.innerHTML += output;
            }
        }

        xhr.send();
    }

// Store data to build movie page
function storeData(e) {
    const movieDataArray = {
        title: e.getAttribute('data-title'),
        releaseDate: e.getAttribute('data-release-date'),
        rating: e.getAttribute('data-rating'),
        overview: e.getAttribute('data-overview'),
        backdrop: e.getAttribute('data-backdrop'),
        poster: e.getAttribute('data-poster')
    };

    sessionStorage.setItem('movieData', JSON.stringify(movieDataArray));
    window.location = 'movie.html';
}

// Movie page
if (url === 'movie.html') {

    // Load stored data
    window.onload = () => {
        let movieDataArray = sessionStorage.getItem('movieData');
        let movie = JSON.parse(movieDataArray);
        console.log(movie)

    // Build movie page
    const info = document.querySelector('.info-container');

    const title = document.createElement('h2');
    title.textContent = dataStorage[0];
    info.appendChild(title);
    }

} // !movie.html