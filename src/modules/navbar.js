/**
 * @fileoverview This module defines and exports the `renderNavbar` function.
 * It dynamically creates and inserts a navigation bar into the page,
 * including a logo and a toggle button that links between Home and Favorites views.
 *
 * The logo is imported as an image asset and displayed alongside the title.
 * The destination of the button is determined based on the current URL path.
 */

import logoPath from '../logo.png';

/**
 * Dynamically creates and renders the top navigation bar for the Movie Diary app.
 * Includes the logo, site name, and a navigation button that switches
 * between the Home page and the Favorites (journal) page.
 *
 * The function checks the current page's URL path to determine which button to show.
 * - On index.html or root (`/`), it shows a "Favorites" button that leads to journal.html.
 * - On journal.html, it shows a "Home" button that leads to index.html.
 */
export function renderNavbar() {
  /**
   * Get the current URL path to determine which button to render.
   * @type {string}
   */
  const currentPath = window.location.pathname;

  /**
   * Create the <nav> element and apply layout and styling classes.
   * @type {HTMLDivElement}
   */
  const nav = document.createElement('nav');
  nav.className = 'bg-gray-900 text-white px-6 py-4 shadow';

  /**
   * Create a flex container to hold the logo and navigation button.
   * @type {HTMLDivElement}
   */
  const container = document.createElement('div');
  container.className = 'flex justify-between items-center max-w-5xl mx-auto';

  /**
   * Logo wrapper that contains the image and text.
   * @type {HTMLDivElement}
   */
  const logo = document.createElement('div');
  logo.className = 'flex items-center gap-2';

  /**
   * Create the logo image element.
   * @type {HTMLImageElement}
   */
  const logoImg = document.createElement('img');
  logoImg.src = logoPath;
  logoImg.alt = 'Movie Diary Logo';
  logoImg.className = 'h-14 w-14';

  /**
   * Text element displaying the app name.
   * @type {HTMLSpanElement}
   */
  const logoText = document.createElement('span');
  logoText.textContent = 'Movie Diary';
  logoText.className = 'text-2xl font-bold tracking-wide';

  // Assemble the logo block
  logo.appendChild(logoImg);
  logo.appendChild(logoText);

  /**
   * Create the navigation button that switches between Home and Favorites.
   * @type {HTMLButtonElement}
   */
  const button = document.createElement('button');
  button.className =
    'bg-white text-gray-900 font-medium px-4 py-2 rounded hover:bg-gray-200 transition';

  // Set button behavior based on the current page
  if (
    currentPath.endsWith('index.html') ||
    currentPath === '/' ||
    currentPath.endsWith('/')
  ) {
    button.textContent = 'Favorites';
    button.addEventListener('click', () => {
      window.location.href = 'journal.html';
    });
  } else if (currentPath.endsWith('journal.html')) {
    button.textContent = 'Home';
    button.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Add logo and button to container, then add to nav
  container.appendChild(logo);
  container.appendChild(button);
  nav.appendChild(container);

  // Insert the navigation bar at the top of the <body>
  document.body.prepend(nav);
}
