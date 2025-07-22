import { renderNavbar } from './modules/navbar.js';

// Warten bis DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();

  let allMovies = [];
  let currentIndex = 0;
  const moviesPerPage = 6;

  // Abschnittsüberschrift erstellen
  const heading = document.createElement('h2');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = 'Popular Movies';

  // Container für die Filmkarten
  const moviesContainer = document.createElement('div');
  moviesContainer.id = 'movies-container';
  moviesContainer.className =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  // "Load more" Button
  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load more...';
  loadButton.className =
    'mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';

  loadButton.addEventListener('click', () => {
    renderNextMovies();
  });

  // Elemente in den Hauptbereich einfügen
  const main = document.querySelector('main');
  main.className = 'p-10';
  main.appendChild(heading);
  main.appendChild(moviesContainer);
  main.appendChild(loadButton);

  /**
   * Holt populäre Filme von der TMDB API und speichert sie.
   * @returns {Promise<void>}
   */
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
      console.error(error);

      const errorMessage = document.createElement('p');
      errorMessage.textContent =
        'Fehler beim Laden der Filme. Bitte später erneut versuchen.';
      errorMessage.className = 'text-center text-red-600 mt-4';
      document.querySelector('main').appendChild(errorMessage);
    }
  };

  fetchPopularMovies();

  /**
   * Zeigt die nächsten Filme aus dem gespeicherten Array.
   */
  function renderNextMovies() {
    const nextMovies = allMovies.slice(
      currentIndex,
      currentIndex + moviesPerPage
    );
    renderMovies(nextMovies);
    currentIndex += moviesPerPage;

    // Button ausblenden, wenn alle Filme angezeigt wurden
    if (currentIndex >= allMovies.length) {
      loadButton.style.display = 'none';
    }
  }

  /**
   * Rendert eine Liste von Filmkarten und ermöglicht das Speichern in Favoriten.
   * @param {Array<Object>} movies - Liste von Filmen
   */
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

  // 🔍 Suchfeld & Live-Suche

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

  // Template für Suchergebnisse
  const dataTemplate = document.createElement('template');
  dataTemplate.innerHTML = `
  <div class="border p-4 rounded w-[200px] text-center shadow">
  <h3 class="font-bold mb-2"></h3>
  <p></p>
  </div>
  `;
  document.body.appendChild(dataTemplate);

  // Event für Live-Suche
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

        if (!data.results || data.results.length === 0) {
          const noResults = document.createElement('p');
          noResults.textContent = 'No movies found.';
          noResults.className = 'text-center text-gray-500 w-full';
          resultsDiv.appendChild(noResults);
          return;
        }

        data.results.slice(0, 5).forEach((movie) => {
          const card = dataTemplate.content.cloneNode(true);
          card.querySelector('h3').textContent = movie.title;
          card.querySelector('p').textContent = movie.release_date;
          resultsDiv.appendChild(card);
        });
      })
      .catch((err) => {
        console.error(err);
        const errorText = document.createElement('p');
        errorText.textContent =
          'Fehler bei der Suche. Bitte später erneut versuchen.';
        errorText.className = 'text-center text-red-600 w-full';
        resultsDiv.appendChild(errorText);
      });
  });
});
