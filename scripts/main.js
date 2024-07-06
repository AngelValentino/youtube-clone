import { settingsModalData } from "../data/settingsModalData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings } from "./modal.js";
import { openSearchBar, resetSearchInput, resetSearchInputAtEsc } from "./searchBar.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input')
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn');
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');
const settingsModalLm = document.getElementById('settings-modal');

//TODO OpenSearch logic needs to be refactored to also use modal functions and be more modular

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

// Add event listeners to open search bar
openSearchBarBtn.addEventListener('click', openSearchBar);

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