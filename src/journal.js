/**
 * @fileoverview This script renders the navbar and displays favorite movies stored in localStorage.
 * Each movie is shown in a card layout with an image, title, description, and a notes section.
 * Users can write personal notes for each movie, which are saved back to localStorage.
 *
 * @module favorites
 */

import { renderNavbar } from './modules/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Initialize the user interface by rendering the navigation bar.
   */
  renderNavbar();

  /**
   * Select the main container element where movie cards will be displayed.
   * @type {HTMLElement}
   */
  const container = document.querySelector('main');

  // Apply Tailwind CSS classes to style the layout as a responsive grid
  container.className =
    'p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  /**
   * Load the list of favorite movies from localStorage.
   * If none are found, initialize with an empty array.
   * @type {Array<Object>}
   */
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  /**
   * Iterate through the list of favorite movies and create a card for each one.
   */
  favorites.forEach((movie) => {
    /**
     * Create a card container for each movie.
     * @type {HTMLDivElement}
     */
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden';

    // Define the card's inner HTML structure with movie info and note fields
    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" class="w-full h-auto">
      <div class="p-4">
        <h2 class="text-xl font-semibold">${movie.title}</h2>
        <p class="text-gray-600 text-sm">${movie.description}</p>

        <!-- Input for writing a new note -->
        <textarea class="mt-2 w-full border p-2 rounded note-input" rows="3" placeholder="Add a note..."></textarea>

        <!-- Display of the saved note, read-only -->
        <textarea class="mt-2 w-full border p-2 rounded saved-note" rows="2" placeholder="Saved user notes" readonly>${
          movie.note || ''
        }</textarea>

        <!-- Button to save the user's note -->
        <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded save-note">Save note</button>
      </div>
    `;

    /**
     * Textarea element for entering a new note.
     * @type {HTMLTextAreaElement}
     */
    const noteInput = card.querySelector('.note-input');

    /**
     * Read-only textarea for displaying the saved note.
     * @type {HTMLTextAreaElement}
     */
    const savedNote = card.querySelector('.saved-note');

    /**
     * Button element to trigger note saving.
     * @type {HTMLButtonElement}
     */
    const saveButton = card.querySelector('.save-note');

    /**
     * Handle saving the note to localStorage when the button is clicked.
     */
    saveButton.addEventListener('click', () => {
      /**
       * Trimmed text from the note input field.
       * @type {string}
       */
      const updatedNote = noteInput.value.trim();

      if (updatedNote !== '') {
        /**
         * Create an updated array of favorites, replacing the current movie with updated note.
         * @type {Array<Object>}
         */
        const updatedFavorites = favorites.map((f) =>
          f.id === movie.id ? { ...f, note: updatedNote } : f
        );

        // Save updated favorites list to localStorage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Update the displayed saved note
        savedNote.value = updatedNote;

        // Clear the input field
        noteInput.value = '';

        // Notify the user
        alert('Note saved successfully');
      } else {
        alert('Note cannot be empty.');
      }
    });

    // Append the movie card to the container
    container.appendChild(card);
  });
});
