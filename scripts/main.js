import { settingsModalData } from "../data/settingsModalData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings, toggleModalEvents } from "./modal.js";
import { openSearchBar } from "./searchBar.js";
import { toggleModalFocus, timeAgo, formatNumber } from "./utils.js";
import { videosData } from "../data/videosData.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');
const settingsModalLm = document.getElementById('settings-modal');
const sideMenuLinksLms = document.querySelectorAll('.side-menu__link');
const thinSideMenuLinksLms = document.querySelectorAll('.side-menu-thin__link')



//TODO Implement progressive image loading
//TODO Split side modal logic into its own file
//TODO Change modal settings icons to be just SVGs instead of fetching them from google icons

const sideMenuLm = document.getElementById('aside-side-menu');
const sideMenuThinLm = document.getElementById('aside-side-menu-thin');
const navbarMenuBtn = document.getElementById('navigation-bar-left__menu-btn');
const sideMenuOverlayLm = document.getElementById('side-menu__overlay');
const sideModalMenuBtn = document.getElementById('nav-header-modal__menu-btn')
const sideModalHeaderLm = document.getElementById('side-menu-modal-header');
const sideMenuInnerLm = document.getElementById('side-menu');

let isSideMenuModalOpen = false; // State to track if the side menu modal is open
let hideThinModalTimId;
let closeSideMenuWithSlideTimId;
const sideMenuEventsHandler = {};

function hideSideMenu() {
  sideMenuLm.classList.remove('show');
  sideMenuOverlayLm.classList.remove('show');
  sideModalHeaderLm.classList.remove('show-flex');
}

// Close the side menu
function closeSideMenu() {
  console.log('side nenu closed')
  hideSideMenu();
  sideMenuThinLm.classList.remove('hide', 'show');
  isSideMenuModalOpen = false;

  // Remove event listeners
  toggleModalEvents(sideMenuEventsHandler, 'remove', null, sideModalMenuBtn, sideMenuLm, document.body, null);
}

// Close the side menu with a sliding animation
function closeSideMenuWithSlide() {
  console.log('side menu closed with slide')
  clearTimeout(hideThinModalTimId);

  sideModalHeaderLm.style.left = '-300px';
  sideMenuInnerLm.style.left = '-300px';
  sideMenuOverlayLm.style.opacity = 0;
  sideMenuThinLm.classList.remove('hide');
  isSideMenuModalOpen = false;

  closeSideMenuWithSlideTimId = setTimeout(() => {
    hideSideMenu();
    sideModalHeaderLm.style.left = 0;
    sideMenuInnerLm.style.left = 0;
    sideMenuLm.classList.add('hide');

    toggleModalFocus('returnFocus')
  }, 250);

  // Remove event listeners
  toggleModalEvents(sideMenuEventsHandler, 'remove', null, sideModalMenuBtn, sideMenuLm, document.body, null);
}

// Function to check window width
function checkWindowSize() {
  if (window.innerWidth > 1312) {
    // Adjust body padding and show/hide side menu based on window size
    if (window.getComputedStyle(sideMenuThinLm).display === 'none') {
      document.body.style.padding = '100px 38px 0 275px';
      sideMenuLm.classList.remove('hide');
    }

    // Close modal side menu if is open when window is bigger than 1312 x
    if (isSideMenuModalOpen) closeSideMenu();
  } 
}


// Set up an event listener to detect window resize
window.addEventListener('resize', checkWindowSize);

navbarMenuBtn.addEventListener('click', () => {
  // If window width is less than or equal to 1312px, show the side menu modal
  if (window.innerWidth <= 1312) {

    clearTimeout(closeSideMenuWithSlideTimId)
    clearTimeout(hideThinModalTimId);

    sideMenuLm.classList.add('show');
    sideMenuLm.classList.remove('hide');
    sideMenuOverlayLm.classList.add('show');
    sideModalHeaderLm.classList.add('show-flex');
    sideModalHeaderLm.style.left = '-300px';
    sideMenuInnerLm.style.left = '-300px';
    isSideMenuModalOpen = true;

    toggleModalFocus('addFocus', sideModalMenuBtn);

    hideThinModalTimId = setTimeout(() => {
      sideMenuThinLm.classList.add('hide');
    }, 250);
  
    setTimeout(() => {
      sideModalHeaderLm.style.left = 0;
      sideMenuInnerLm.style.left = 0;
      sideMenuOverlayLm.style.opacity = 1;
    }, 10);

    // Add event listeners
    toggleModalEvents(sideMenuEventsHandler, 'add', closeSideMenuWithSlide, sideModalMenuBtn, sideMenuLm, document.body, '.side-menu__overlay');
  } 
  // If window width is greater than 1312px, toggle between showing the thin side menu and the full side menu
  else {
    // Show thin side menu
    if (!sideMenuLm.classList.contains('hide')) {
      sideMenuThinLm.classList.add('show');
      sideMenuLm.classList.add('hide');
      document.body.style.padding = '100px 38px 0 100px';
    } 
    // Show side menu
    else {
      document.body.style.padding = '100px 38px 0 275px';
      sideMenuThinLm.classList.remove('show');
      sideMenuLm.classList.remove('hide');
    }
  }
});

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
      if (isSideMenuModalOpen) closeSideMenuWithSlide();
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



//TODO Add event listeners

const videosGridLm = document.getElementById('videos-grid');

videosGridLm.innerHTML = videosData.map(({ thumbnailURL, avatarURL, length, title, author, views, subscribers, fromDate }) => (
  ` 
    <a id="video-link" href="#" class="video-container">
      <div class="video-thumbnail">
        <img class="video-thumbnail__img" src="${thumbnailURL}" alt=${title}>
        <p class="video-thumbnail__timestamp">${length}</p>
      </div>
      <div class="video-avatar-info-container">
        <div class="video-avatar">
          <img class="video-avatar__img" src=${avatarURL} alt="${author} avatar">
          <div aria-hidden="true" class="video-avatar__channel-tooltip">
            <img class="video-avatar__channel-tooltip-img" src="${avatarURL}" alt="${author} avatar">
            <div class="video-avatar__channel-tooltip-info">
              <h3>${author}</h3>
              <p>${formatNumber(subscribers)} subscribers</p>
            </div>
          </div>
        </div>
        <div class="video-info">
          <h2 class="video-info__title" title="${title}">${title}</h3>
          <h3 data-tooltip="${author}" class="video-info__author tooltip tooltip-navbar tooltip--top-center" title="${author}">${author}</h3>
          <h4 class="video-info__stats">${formatNumber(views)} views <span class="video-info__stats-separator">&#183</span> ${timeAgo(fromDate)}</h4>
        </div>
        <button id="video-info__toggle-settings-btn" aria-label="Open settings." class="video-info__toggle-settings-btn">
          <svg aria-hidden="true" role="presentation" focusable="false" class="video-info__toggle-settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
          </svg>
        </button>
        <div id="video-info__settings" class="video-info__settings">
          <button class="video-info__settings-btn">
            <svg class="video-info__settings-add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M450-450H220v-60h230v-230h60v230h230v60H510v230h-60v-230Z"/></svg>
            Add to queue
          </button>
          <button class="video-info__settings-btn">
            <svg class="video-info__settings-share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M720.09-100q-41.63 0-70.86-29.17Q620-158.33 620-200q0-7.98 1.38-16.53 1.39-8.55 4.16-16.09L315.85-415.08q-14.7 16.54-34.16 25.81Q262.23-380 240-380q-41.67 0-70.83-29.14Q140-438.28 140-479.91q0-41.63 29.17-70.86Q198.33-580 240-580q22.23 0 41.69 9.27 19.46 9.27 34.16 25.81l309.69-182.46q-2.77-7.54-4.16-16.09Q620-752.02 620-760q0-41.67 29.14-70.83Q678.28-860 719.91-860q41.63 0 70.86 29.14Q820-801.72 820-760.09q0 41.63-29.17 70.86Q761.67-660 720-660q-22.23 0-41.69-9.27-19.46-9.27-34.16-25.81L334.46-512.62q2.77 7.54 4.16 16.04 1.38 8.49 1.38 16.42 0 7.93-1.38 16.58-1.39 8.66-4.16 16.2l309.69 182.46q14.7-16.54 34.16-25.81Q697.77-300 720-300q41.67 0 70.83 29.14Q820-241.72 820-200.09q0 41.63-29.14 70.86Q761.72-100 720.09-100ZM720-700q24.69 0 42.35-17.65Q780-735.31 780-760t-17.65-42.35Q744.69-820 720-820t-42.35 17.65Q660-784.69 660-760t17.65 42.35Q695.31-700 720-700ZM240-420q24.69 0 42.35-17.65Q300-455.31 300-480t-17.65-42.35Q264.69-540 240-540t-42.35 17.65Q180-504.69 180-480t17.65 42.35Q215.31-420 240-420Zm480 280q24.69 0 42.35-17.65Q780-175.31 780-200t-17.65-42.35Q744.69-260 720-260t-42.35 17.65Q660-224.69 660-200t17.65 42.35Q695.31-140 720-140Zm0-620ZM240-480Zm480 280Z"/></svg>
            Share
          </button>
        </div>
      </div>
    </a>
  `
)).join('');



// const videoLinkLm = document.querySelector('.video-container');
// const videoInfoSettingsModalLm = document.getElementById('video-info__settings');
// let isVideoSettingsModalOpen = false; // Track modal visibility state

// videoLinkLm.addEventListener('click', e => {
//   e.preventDefault();
//   const settingsBtn = e.target.closest('.video-info__toggle-settings-btn');
  
//   if (settingsBtn) {
//     console.log('settings clicked');

//     isVideoSettingsModalOpen = !isVideoSettingsModalOpen // Toggle modal visibility;
//     toggleModal();
//   }
// });

// // Toggle modal visibility and handle position
// function toggleModal() {
//   // Toggle the 'show' class to display or hide the modal
//   videoInfoSettingsModalLm.classList.toggle('show');

//   // If modal is open, check and adjust its position
//   if (isVideoSettingsModalOpen) {
//     checkAndAdjustModalPosition();
//   } 
//   // If modal is closed, reset its position
//   else {
//     videoInfoSettingsModalLm.style.right = '';
//   }
// }

// // Check modal position and adjust if necessary
// function checkAndAdjustModalPosition() {
//   // Get viewport width and modal width
//   const viewportWidth = window.innerWidth;
//   const modalWidth = videoInfoSettingsModalLm.getBoundingClientRect().width;
//    // Get position of settings button
//   const settingsBtnRect = document.querySelector('.video-info__toggle-settings-btn').getBoundingClientRect();
//   const settingsBtnRightEdge = settingsBtnRect.right;

//   // Calculate modal right edge position
//   const modalRightEdge = settingsBtnRightEdge + modalWidth;

//   // Check if modal overflows the viewport
//   if (modalRightEdge > viewportWidth) {
//     // Adjust modal position to fit within viewport
//     videoInfoSettingsModalLm.style.right = `-8px`;
//   } else {
//     // Reset to default position if it doesn't overflow
//     videoInfoSettingsModalLm.style.right = '';
//   }
// }

// window.addEventListener('resize', () => {
//   // Recalculate modal position on resize if modal is open
//   if (isVideoSettingsModalOpen) {
//     checkAndAdjustModalPosition();
//   }
// });



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