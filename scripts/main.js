import { settingsModalData } from "../data/settingsModalData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings } from "./modal.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const returnBtn = document.getElementById('navigation-bar__return-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input')
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn')
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');

//TODO OpenSearch logic needs to be refactored to also use modal functions and be more modular
// Toggle display of 'navigation-bar' sections
function toggleSearchDisplay(leftDisplay, middleDisplay, rightDisplay) {
  document.getElementById('navigation-bar__left').style.display = leftDisplay; // Set the display style of the left navigation bar section
  document.getElementById('navigation-bar__middle').style.display = middleDisplay; // Set the display style of the middle navigation bar section
  document.getElementById('navigation-bar__right').style.display = rightDisplay; // Set the display style of the right navigation bar section
}

// Open the search bar and add event listeners for closing it
function openSearchBar() {
  toggleSearchDisplay('none', 'flex', 'none'); // Open search bar: hide left and right, show middle
  searchInputLm.focus();
  document.body.addEventListener('click', handleNavbarOutsideClick);
  document.body.addEventListener('keydown', handleNavbarEscapeKey);
}

// Close the search bar and remove event listeners
function closeSearchBar() {
  toggleSearchDisplay('flex', 'none', 'flex'); // Close search bar: show left and right, hide middle
  document.body.removeEventListener('click', handleNavbarOutsideClick);
  document.body.removeEventListener('keydown', handleNavbarEscapeKey);
}

/* JavaScript processes the addEventListener call after the handleNavbarEscapeKey 
function has been declared and assigned to the const. That's why both of 
them work, despite the fact that arrow functions do not allow hoisting. */
// Close search bar if click is outside navigation bar
const handleNavbarOutsideClick = e => !document.getElementById('navigation-bar').contains(e.target) && closeSearchBar();

// Handle Escape key press to close search bar
const handleNavbarEscapeKey = e => e.key === 'Escape' && closeSearchBar();

// Reset search input fields and remove event listeners
function resetSearchInput() {
  searchInputLm.value = '';
  closeSearchInputBtn.style.display = 'none';
  searchInputLm.style.padding = '10px 4px 10px 16px';
  closeSearchInputBtn.removeEventListener('click', resetSearchInput);
  searchInputLm.removeEventListener('keydown', resetSearchInputAtEsc);
};

// Handle Escape key press to reset search input
const resetSearchInputAtEsc = e => e.key === 'Escape' && resetSearchInput();

const settingsModalLm = document.getElementById('settings-modal');

settingsModalLm.innerHTML = settingsModalData.map(({ icon, title, chevron }) => (
  icon !== 'settings' 
    ? `
        <button class="settings-modal__btn">
          <span class="material-symbols-outlined settings-modal__btn-icon">${icon}</span>
          ${title}
          ${chevron ? '<span class="material-symbols-outlined settings-modal__btn-chevron">chevron_right</span>' : ''}
        </button>
      `
    : `
        <div class="settings-modal__settings-btn-container">
          <button class="settings-modal__btn settings-modal__settings-btn">
            <span class="material-symbols-outlined settings-modal__btn-icon">${icon}</span>
            ${title}
          </button>
        </div>
      `
)).join('');

// Add modal events
navbarSettingsBtn.addEventListener('click', handleToggleModalSettings);
middleSearchWtichVoiceBtn.addEventListener('click', openSearchWithVoiceModal);
rightSearchWithVoiceBtn.addEventListener('click', openSearchWithVoiceModal);

// Add event listeners to open and close search bar
openSearchBarBtn.addEventListener('click', openSearchBar);
returnBtn.addEventListener('click', closeSearchBar);

// Event listener for input changes in search input
searchInputLm.addEventListener('input', e => {
  const inputValue = e.target.value;
  
  if (inputValue !== '') {
    searchInputLm.style.padding = '10px 30px 10px 16px';
    closeSearchInputBtn.style.display = 'block';
    closeSearchInputBtn.addEventListener('click', resetSearchInput);
    searchInputLm.addEventListener('keydown', resetSearchInputAtEsc);
  } 
  else {
    resetSearchInput();
  }
});