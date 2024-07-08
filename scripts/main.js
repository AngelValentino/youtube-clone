import { settingsModalData } from "../data/settingsModalData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings } from "./modal.js";
import { openSearchBar } from "./searchBar.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');
const settingsModalLm = document.getElementById('settings-modal');
const sideMneuLinksLms = document.querySelectorAll('.side-menu__link');

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


function setSideMenuLinkActiveClass() {
  const currentHash = window.location.hash;

  sideMneuLinksLms.forEach(sideMenuLink => {
    const sideMenuHref = sideMenuLink.getAttribute('href');

    if (sideMenuHref === currentHash || (sideMenuHref === '/' && currentHash === '')) {
      sideMenuLink.classList.add('active');
    } 
    else {
      sideMenuLink.classList.remove('active');
    }
  });
}



// Add modal events
navbarSettingsBtn.addEventListener('click', handleToggleModalSettings);
middleSearchWtichVoiceBtn.addEventListener('click', openSearchWithVoiceModal);
rightSearchWithVoiceBtn.addEventListener('click', openSearchWithVoiceModal);

// Add event listeners to open search bar
openSearchBarBtn.addEventListener('click', openSearchBar);

// Add event listeners to side menu links
sideMneuLinksLms.forEach(sideMenuLink => {
  sideMenuLink.addEventListener('click', e => {
    e.preventDefault(); // Prevent default anchor behavior
    const hash = sideMenuLink.getAttribute('href');
    history.replaceState(null, null, hash); // Update the URL hash without triggering scroll
    setSideMenuLinkActiveClass(); // Set active class based on clicked item
  });
});

setSideMenuLinkActiveClass(); // Set active side menu class on the first page load
