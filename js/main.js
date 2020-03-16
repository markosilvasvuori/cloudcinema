const accountButton = document.querySelector('.account-button');
const mainSlider = document.querySelector('#main-slider');
const baseUrl = 'https://image.tmdb.org/t/p/'
const api = '93530160840d922e585f6b81bf62a7a0'
let searchValue = '';
let dataStorage = [];

// Search
    const searchForm = document.querySelector('#search')
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    searchInput.style.display = 'none';

    window.addEventListener('click', (e) => {
        // Check if we clicked inside Search Form
        if (searchForm.contains(e.target)) {
            // Show search input
            if (searchInput.value === '') {
                e.preventDefault();
                accountButton.style.display = 'none';
                searchInput.style.display = 'block';
                searchInput.focus();
            // Commit search if search input has value
            } else if (searchButton.contains(e.target) || e.keyCode === 13) {
                e.preventDefault();
                searchValue = searchInput.value;
                sessionStorage.setItem('searchTerm', searchValue);
                window.location = 'search.html'
            }
        } else {
            // If we clicked outside Search Form, hide search input
            searchInput.style.display = 'none';
            accountButton.style.display = 'block';
            searchValue = searchInput.value;
            searchInput.value = '';
        }
    });

    function search() {
        const searchTerm = sessionStorage.getItem('searchTerm');
        const section = document.querySelector('.movie-list ul');
        const noResults = document.querySelector('.no-results');
        let output = '';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=${api}&language=en-US&query=${searchTerm}&page=1&include_adult=false`, true);

        xhr.onload = function() {
            if (xhr.status == 200) {
                const movies = JSON.parse(xhr.responseText);

                for (let i = 0; i < movies.results.length; i++) {
                    let poster = `${baseUrl}w185${movies.results[i].poster_path}`

                    if (movies.results[i].poster_path !== null) {
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
                        <img src="${poster}" alt="">
                        </li>`
                    }
                }

                if (movies.results.length > 0) {
                    section.innerHTML += output;
                } else {
                    output = `
                    "${searchTerm}"
                    <br>
                    No Results
                    `
                    noResults.style.display = 'block';
                    noResults.innerHTML += output;
                }
            }
        }

        xhr.onerror = function() {
            errorMessage('.movie-list ul');
        }

        xhr.send();
    }

// Check current page
    const currentUrl = window.location.href;
    let url = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);

// Homepage functions
    if (url === 'index.html') {
        window.onload = () => {
            mainSliderMovies();
            getMovies('popular', 6);
            getMovies('upcoming', 6);
            getMovies('now_playing', 6);
            switchSlides();
        }
    }

// Search page functions
if (url === 'search.html') {
    window.onload = () => {
        search();
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
                    button.setAttribute('data-title', movies.results[i].title);
                    button.setAttribute('data-release-date', movies.results[i].release_date);
                    button.setAttribute('data-rating', movies.results[i].vote_average);
                    button.setAttribute('data-overview', movies.results[i].overview);
                    button.setAttribute('data-backdrop', `${baseUrl}original${movies.results[i].backdrop_path}`);
                    button.setAttribute('data-poster', `${baseUrl}w500${movies.results[i].poster_path}`);
                    button.setAttribute('onclick', 'storeData(this)');

                    infoDiv.appendChild(title);
                    infoDiv.appendChild(rating);
                    infoDiv.appendChild(button);
                    div.appendChild(overlay);
                    div.appendChild(infoDiv);
                    mainSlider.appendChild(div);
                }
            }
        }

        xhr.onerror = function() {
            errorMessage('#main-slider');
        }

        xhr.send();
    }

// Main Slider
    function switchSlides() {
        timer = setInterval(function() {
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
    function getMovies(category, movieCount) {
        const section = document.querySelector(`#${category} ul`);
        let output = '';

        const xhr = new XMLHttpRequest();
        xhr.open(`GET`, `https://api.themoviedb.org/3/movie/${category}?api_key=${api}&language=en-US&page=1`, true);

        xhr.onload = function() {
            if (xhr.status == 200) {
                const movies = JSON.parse(xhr.responseText);

                for (let i = 0; i < movieCount; i++) {
                    let poster = `${baseUrl}w185${movies.results[i].poster_path}`
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
                    <img src="${poster}" alt="">
                    </li>`
                }

                section.innerHTML += output;
            }
        }

        xhr.onerror = function() {
            if (url != 'view-all.html') {
            errorMessage(`#${category} ul`);
            } else {
                errorMessage('.movie-list');
            }
        }

        xhr.send();
    }

// Error message
    function errorMessage(selector) {
        if (url === 'index.html') {
            clearInterval(timer); // Stop Main Slider
        }
            const mainSlider = document.querySelector(selector);
            const p = document.createElement('p');
            p.classList.add('error-message');

            p.innerHTML = `
            Server Error
            <br>
            <a onclick="location.reload()">Try Again</a>
            `
            mainSlider.appendChild(p);
    }

// View all button
    function viewAll(category, movieCount) {
        const selectedCategory = category;
        sessionStorage.setItem('selected', JSON.stringify(selectedCategory));
        sessionStorage.setItem('count', JSON.stringify(movieCount));
        window.location = 'view-all.html';
    }

// View All page
    if (url === 'view-all.html') {
        // View All page functions here
        buildViewAll();
    }

    function buildViewAll() {
        // Load stored data
        window.onload = () => {
            let selectedCategory = sessionStorage.getItem('selected');
            let movieCount = sessionStorage.getItem('count');
            let category = JSON.parse(selectedCategory);
            let count = JSON.parse(movieCount);
            console.log(category);
            console.log(count);

            // Build View All page
            document.querySelector('.movie-list').setAttribute('id', category);
            let title = document.querySelector('.movie-list h2');
            
            if (category === 'now_playing') {
                title.textContent = 'now playing';
            } else {
                title.textContent = category;
            }

            getMovies(category, count);
        }
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
    // Movie page functions here
    buildMoviePage();
    }

    function buildMoviePage() {
        // Load stored data
        window.onload = () => {
            let movieDataArray = sessionStorage.getItem('movieData');
            let movie = JSON.parse(movieDataArray);
            console.log(movie)

            // Build Movie page
            const pageContainer = document.querySelector('.movie-page-container');
            const title = document.querySelector('.movie-title');
            const releaseDate = document.querySelector('.release-date');
            const rating = document.querySelector('.movie-rating');
            const overview = document.querySelector('.overview p');
            const poster = document.querySelector('.movie-poster');

            title.textContent = movie['title'];
            releaseDate.textContent = movie['releaseDate'].slice(0, 4); // Get year only
            rating.textContent = `${movie['rating']} Rating`;
            overview.textContent = movie['overview'];
            poster.src = movie['poster'];
            pageContainer.style.backgroundImage = `url(${movie['backdrop']})`;
        }
    }