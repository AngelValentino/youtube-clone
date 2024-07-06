import { toggleModalFocus } from "./utils.js";

const leftNavigationBarLm = document.getElementById('navigation-bar__left');
const middleNavigationBarLm = document.getElementById('navigation-bar__middle');
const rightNavigationBarLm = document.getElementById('navigation-bar__right');
const returnBtn = document.getElementById('navigation-bar__return-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn');

// Toggle navigation bar sections' display
function toggleSearchDisplay(leftDisplay, middleDisplay, rightDisplay) {
  leftNavigationBarLm.style.display = leftDisplay; // Set the display style of the left navigation bar section
  middleNavigationBarLm.style.display = middleDisplay; // Set the display style of the middle navigation bar section
  rightNavigationBarLm.style.display = rightDisplay; // Set the display style of the right navigation bar section
}

function closeSearchBar() {
  middleSearchWtichVoiceBtn.classList.remove('tooltip-navbar--bottom-rigth');
  toggleSearchDisplay('flex', 'none', 'flex'); // Close search bar: show left and right, hide middle
  toggleModalFocus('returnFocus'); // Return focus to the last focused element before search bar opened

  // Remove events
  document.body.removeEventListener('keydown', handleEscKey);
  document.body.removeEventListener('click', handleOverlayClick);
  returnBtn.removeEventListener('click', closeSearchBar);
}

function handleOverlayClick(e) {
  if (!e.target.closest('.navigation-bar')) closeSearchBar()
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeSearchBar();
}

// Open the search bar and add event listeners for closing it
export function openSearchBar() {
  toggleSearchDisplay('none', 'flex', 'none'); // Open search bar: hide left and right, show middle
  toggleModalFocus('addFocus', searchInputLm); // Set focus on the search input field
  middleSearchWtichVoiceBtn.classList.add('tooltip-navbar--bottom-rigth'); // Add tooltip class for search with voice button

  // Add events
  document.body.addEventListener('keydown', handleEscKey);
  document.body.addEventListener('click', handleOverlayClick);
  returnBtn.addEventListener('click', closeSearchBar);
}

// Handle Escape key press to reset search input
const resetSearchInputAtEsc = e => e.key === 'Escape' && resetSearchInput();

// Reset search input fields
function resetSearchInput() {
  searchInputLm.value = ''; // Clear input value
  closeSearchInputBtn.classList.remove('active');
  searchInputLm.classList.remove('active');
}

function handleResetSearchInput(e) {
  const inputValue = e.target.value;
  
  if (inputValue !== '') {
    searchInputLm.classList.add('active');
    closeSearchInputBtn.classList.add('active');
  } 
  else {
    resetSearchInput(); // Reset search input if it's empty
  }
}

// Event listeners setup
closeSearchInputBtn.addEventListener('click', resetSearchInput); // Listen for click on close button
searchInputLm.addEventListener('keydown', resetSearchInputAtEsc); // Listen for Escape key press
searchInputLm.addEventListener('input', handleResetSearchInput); // Listen for input changes in search input