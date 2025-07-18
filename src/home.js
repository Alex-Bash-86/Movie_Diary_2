import { renderNavbar } from './modules/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();

  let allMovies = [];
  let currentIndex = 0;
  const moviesPerPage = 6;

  const heading = document.createElement('h2');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = 'Popular Movies';

  const moviesContainer = document.createElement('div');
  moviesContainer.id = 'movies-container';
  moviesContainer.className =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load more...';
  loadButton.className =
    'mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';

  loadButton.addEventListener('click', () => {
    renderNextMovies();
  });

  const main = document.querySelector('main');
  main.className = 'p-10';
  main.appendChild(heading);
  main.appendChild(moviesContainer);
  main.appendChild(loadButton);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular',
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjRlYjkxY2YxOWYwYjhlMWEyZDhkMmY0NWI2N2MyZiIsIm5iZiI6MTc1MjA2MzEyMy4wMDcsInN1YiI6IjY4NmU1YzkzZjNkODA1MDU2MDUxZWIwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZkiK_RSBrSOpikqDnUMdYQ8crMU53z4htqMsW_wBGc4',
          },
        }
      );
      const data = await response.json();
      allMovies = data.results;
      renderNextMovies();
    } catch (error) {
      console.log(error);
    }
  };

  fetchPopularMovies();

  function renderNextMovies() {
    const nextMovies = allMovies.slice(
      currentIndex,
      currentIndex + moviesPerPage
    );
    renderMovies(nextMovies);
    currentIndex += moviesPerPage;

    if (currentIndex >= allMovies.length) {
      loadButton.style.display = 'none';
    }
  }

  function renderMovies(movies) {
    const container = document.getElementById('movies-container');

    movies.forEach((movie) => {
      if (!movie.poster_path) return;

      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-md overflow-hidden';

      card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto">
      <div class="p-4">
      <h2 class="text-xl font-semibold">${movie.title}</h2>
      <p class="text-gray-600 text-sm">Rating: ${movie.vote_average}</p>
      <p class="text-gray-500 text-sm">${movie.release_date}</p>
      <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded add-fav">Add to favorites</button>
      </div>
      `;

      const addButton = card.querySelector('.add-fav');
      addButton.addEventListener('click', () => {
        const favoriteMovie = {
          id: movie.id,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          description: `Rating: ${movie.vote_average}, Release: ${movie.release_date}`,
          note: '',
        };

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some((m) => m.id === favoriteMovie.id)) {
          favorites.push(favoriteMovie);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          alert('Movie added to favorites');
        } else {
          alert('The movie is already in your favorites');
        }
      });

      container.appendChild(card);
    });
  }
});

const searchDiv = document.createElement('div');
const searchInput = document.createElement('input');
const searchLabel = document.createElement('label');
const header = document.querySelector('header');
header.appendChild(searchDiv);

searchDiv.appendChild(searchLabel);
searchDiv.appendChild(searchInput);
searchLabel.textContent = 'Search Movie';
searchDiv.classList = 'flex flex-col flex-wrap justify-center pt-4';
searchLabel.classList = 'text-center text-xl font-bold';
searchInput.classList =
  'border-[1px] rounded-[10px] max-w-[300px] self-center p-[5px]';

const resultsDiv = document.createElement('div');
resultsDiv.classList = 'flex flex-wrap justify-center gap-4 p-4';
header.appendChild(resultsDiv);

const dataTemplate = document.createElement('template');
dataTemplate.innerHTML = `
  <div class="border p-4 rounded w-[200px] text-center shadow">
    <h3 class="font-bold mb-2"></h3>
    <p></p>
  </div>
`;
document.body.appendChild(dataTemplate);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  if (query.length < 2) return (resultsDiv.innerHTML = '');
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=eb4eb91cf19f0b8e1a2d8d2f45b67c2f&query=${encodeURIComponent(
      query
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      resultsDiv.innerHTML = '';
      data.results.slice(0, 5).forEach((movie) => {
        const card = dataTemplate.content.cloneNode(true);
        card.querySelector('h3').textContent = movie.title;
        card.querySelector('p').textContent = movie.release_date;
        resultsDiv.appendChild(card);
      });
    })
    .catch((err) => console.error(err));
});
