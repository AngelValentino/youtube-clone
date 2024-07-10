import { settingsModalData } from "../data/settingsModalData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings } from "./modal.js";
import { openSearchBar } from "./searchBar.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');
const settingsModalLm = document.getElementById('settings-modal');
const sideMenuLinksLms = document.querySelectorAll('.side-menu__link');
const thinSideMenuLinksLms = document.querySelectorAll('.side-menu-thin__link')

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

// Set the side menu links's 'active' class based on the current URL hash
function setSideMenuActiveClass(linksLms) {
  const currentHash = window.location.hash; // Get the current URL hash

  linksLms.forEach(link => {
    const sideMenuHref = link.getAttribute('href'); ; // Get the href attribute of the link

    // Add 'active' class if the link href matches the current hash, otherwise remove it
    if (sideMenuHref === currentHash || (sideMenuHref === '/' && currentHash === '')) {
      link.classList.add('active');
    } 
    else {
      link.classList.remove('active');
    }
  });
}

// Handler function to set the active class for both side menus
function setSideMenuActiveClassHandler() {
  setSideMenuActiveClass(sideMenuLinksLms); // Set active class for side menu
  setSideMenuActiveClass(thinSideMenuLinksLms); // Set active class for thin side menu
}

// Add click event listeners to the side menu links
function addSideMenuEvents(linksLms) {
  linksLms.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault(); // Prevent default anchor behavior
      const hash = link.getAttribute('href'); // Get the href attribute of the clicked link
      history.replaceState(null, null, hash); // Update the URL hash without triggering scroll
      setSideMenuActiveClassHandler(); // Set active class based on clicked item
    });
  });
}

// Handler function to add click event listeners to the appropriate side menu based on type
function addSideMenuEventsHandler(type) {
  if (type === 'side-menu') {
    addSideMenuEvents(sideMenuLinksLms); // Add event listeners to side menu links
  } 
  else if (type === 'side-menu-thin') {
    addSideMenuEvents(thinSideMenuLinksLms); // Add event listeners to thin side menu links
  }
}

// Add modal events
navbarSettingsBtn.addEventListener('click', handleToggleModalSettings);
middleSearchWtichVoiceBtn.addEventListener('click', openSearchWithVoiceModal);
rightSearchWithVoiceBtn.addEventListener('click', openSearchWithVoiceModal);

// Add event listeners to open search bar
openSearchBarBtn.addEventListener('click', openSearchBar);

// Add event handlers to both side menus
addSideMenuEventsHandler('side-menu');
addSideMenuEventsHandler('side-menu-thin');

setSideMenuActiveClassHandler(); // Initial call to set the active class based on the current URL hash
