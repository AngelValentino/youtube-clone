import { settingsModalData } from "../data/settingsModalData.js";
import { videosData } from "../data/videosData.js";
import { openSearchWithVoiceModal, handleToggleModalSettings, toggleModalFocus } from "./modal.js";
import { openSearchBar } from "./searchBar.js";
import { timeAgo, formatNumber, addProgressiveLoading } from "./utils.js";
import { toggleSideMenu, addSideMenuEventsHandler, setSideMenuActiveClassHandler } from "./sideMenu.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');
const settingsModalLm = document.getElementById('settings-modal');
const navbarMenuBtn = document.getElementById('navigation-bar-left__menu-btn');
const videosGridLm = document.getElementById('videos-grid');

const settingsBtnsLms = [];
let activeVideoSettingsModalLm = null; // Keeps track of the active video settings modal element

settingsModalLm.innerHTML = settingsModalData.map(({ icon, title, chevron }) => (
  title !== 'Settings'  
    ? `
        <button aria-label="Open ${title}" class="settings-modal__btn">
          ${icon}
          ${title}
          ${chevron ? `
            <svg class="settings-modal__btn-chevron" aria-hidden="true" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z"/>
            </svg>
            ` : ''}
        </button>
      `
    : `
        <div class="settings-modal__settings-btn-container">
          <button aria-label="Open ${title}" class="settings-modal__btn settings-modal__settings-btn">
            ${icon}
            ${title}
          </button>
        </div>
      `
)).join('');

videosGridLm.innerHTML = videosData.map(({ id, thumbnailURL, avatarURL, lowResAvatarURL, lowResThumbnailURL, length, title, author, views, subscribers, fromDate }) => (
  ` 
    <a data-id="${id}" id="video-link-${id}" href="#" class="video-container">
      <div class="video-thumbnail blur-img-loader" style="background-image: url(${lowResThumbnailURL})">
        <img class="video-thumbnail__img" src="${thumbnailURL}" alt="${title}">
        <p class="video-thumbnail__timestamp">${length}</p>
      </div>
      <div class="video-avatar-info-container">
        <div class="video-avatar blur-img-loader" style="background-image: url(${lowResAvatarURL})">
          <img title="${author}" class="video-avatar__img" src=${avatarURL} alt="${author} avatar">
          <div aria-hidden="true" class="video-avatar__channel-tooltip">
            <div class="video-avatar__channel-tooltip-img-container blur-img-loader" style="background-image: url(${lowResAvatarURL})">
              <img class="video-avatar__channel-tooltip-img" src="${avatarURL}" alt="${author} avatar">
            </div>
            <div class="video-avatar__channel-tooltip-info">
              <h3 class="video-avatar__channel-tooltip-title">${author}</h3>
              <p>${formatNumber(subscribers)} subscribers</p>
            </div>
          </div>
        </div>
        <div class="video-info">
          <h2 class="video-info__title" title="${title}">${title}</h3>
          <h3 data-tooltip="${author}" class="video-info__author tooltip tooltip-navbar tooltip--top-center" title="${author}">${author}</h3>
          <h4 class="video-info__stats">${formatNumber(views)} views <span class="video-info__stats-separator">&#183</span> ${timeAgo(fromDate)}</h4>
        </div>
        <button data-id="${id}" aria-label="Open settings." class="video-info__toggle-settings-btn">
          <svg aria-hidden="true" role="presentation" focusable="false" class="video-info__toggle-settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
          </svg>
        </button>
        <div class="video-info__settings">
          <button class="video-info__settings-btn">
            <svg class="video-info__settings-add-icon" aria-hidden="true" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M450-450H220v-60h230v-230h60v230h230v60H510v230h-60v-230Z"/>
            </svg>
            Add to queue
          </button>
          <button class="video-info__settings-btn">
            <svg class="video-info__settings-share-icon" aria-hidden="true" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M720.09-100q-41.63 0-70.86-29.17Q620-158.33 620-200q0-7.98 1.38-16.53 1.39-8.55 4.16-16.09L315.85-415.08q-14.7 16.54-34.16 25.81Q262.23-380 240-380q-41.67 0-70.83-29.14Q140-438.28 140-479.91q0-41.63 29.17-70.86Q198.33-580 240-580q22.23 0 41.69 9.27 19.46 9.27 34.16 25.81l309.69-182.46q-2.77-7.54-4.16-16.09Q620-752.02 620-760q0-41.67 29.14-70.83Q678.28-860 719.91-860q41.63 0 70.86 29.14Q820-801.72 820-760.09q0 41.63-29.17 70.86Q761.67-660 720-660q-22.23 0-41.69-9.27-19.46-9.27-34.16-25.81L334.46-512.62q2.77 7.54 4.16 16.04 1.38 8.49 1.38 16.42 0 7.93-1.38 16.58-1.39 8.66-4.16 16.2l309.69 182.46q14.7-16.54 34.16-25.81Q697.77-300 720-300q41.67 0 70.83 29.14Q820-241.72 820-200.09q0 41.63-29.14 70.86Q761.72-100 720.09-100ZM720-700q24.69 0 42.35-17.65Q780-735.31 780-760t-17.65-42.35Q744.69-820 720-820t-42.35 17.65Q660-784.69 660-760t17.65 42.35Q695.31-700 720-700ZM240-420q24.69 0 42.35-17.65Q300-455.31 300-480t-17.65-42.35Q264.69-540 240-540t-42.35 17.65Q180-504.69 180-480t17.65 42.35Q215.31-420 240-420Zm480 280q24.69 0 42.35-17.65Q780-175.31 780-200t-17.65-42.35Q744.69-260 720-260t-42.35 17.65Q660-224.69 660-200t17.65 42.35Q695.31-140 720-140Zm0-620ZM240-480Zm480 280Z"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    </a>
  `
)).join('');

// Check modal position and adjust if necessary
function checkAndAdjustModalPosition(settingsModalLm) {
  // Get viewport width and height
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get modal dimensions
  const modalWidth = settingsModalLm.getBoundingClientRect().width;
  const modalHeight = settingsModalLm.getBoundingClientRect().height;

  // Get position of the settings button
  const btn = settingsModalLm.parentNode.querySelector('.video-info__toggle-settings-btn');
  const settingsBtnRect = btn.getBoundingClientRect();
  const settingsBtnRightEdge = settingsBtnRect.right;
  const settingsBtnBottomEdge = settingsBtnRect.bottom;

  // Calculate modal right and bottom edge positions
  const modalRightEdge = settingsBtnRightEdge + modalWidth;
  const modalBottomEdge = settingsBtnBottomEdge + modalHeight;

  // Check horizontal position overflow
  if (modalRightEdge > viewportWidth) {
    // Adjust modal position to fit within viewport horizontally
    settingsModalLm.style.right = `-8px`;
  } else {
    // Reset to default position if it doesn't overflow horizontally
    settingsModalLm.style.right = '';
  }

  // Check vertical position overflow
  if (modalBottomEdge > viewportHeight) {
    // Adjust modal position to fit within viewport vertically
    settingsModalLm.style.top = `-${modalHeight + 10}px`;
  } 
  else {
    // Reset to default position if it doesn't overflow vertically
    settingsModalLm.style.top = '';
  }
}

// Close the settings video modal
function closeSettingsVideoModal() {
  activeVideoSettingsModalLm.classList.remove('show'); // Remove 'show' class to hide the modal
  toggleModalFocus('returnFocus'); // Restore focus to the previously focused element
  activeVideoSettingsModalLm = null; // Reset the active modal variable
}

// Toggle video settings modal visibility and manage its state
function toggleVideoSettingsModal(settingsModalLm) {
  // Toggle the 'show' class to display or hide the modal
  settingsModalLm.classList.toggle('show');

  // If modal is open, adjust its position and manage focus
  if (settingsModalLm.classList.contains('show')) {
    checkAndAdjustModalPosition(settingsModalLm); // Adjust modal position based on its content
    toggleModalFocus('addFocus', settingsModalLm.children[0]); // Manage focus within the modal
    activeVideoSettingsModalLm = settingsModalLm; // Set this modal as the active one
  } 
  // If modal is closed, reset its position and manage focus
  else {
    settingsModalLm.style.right = ''; // Reset modal position
    toggleModalFocus('returnFocus'); // Restore focus to the previously focused element
    closeSettingsVideoModal(); // Close the modal and reset its state
  }
}

// Adds progessive loading to video containers' images
addProgressiveLoading(document.querySelectorAll('.video-thumbnail'));
addProgressiveLoading(document.querySelectorAll('.video-avatar'));
addProgressiveLoading(document.querySelectorAll('.video-avatar__channel-tooltip-img-container'));

// Event listener for Escape key press to close the video settings modal if modal is open
document.body.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activeVideoSettingsModalLm) closeSettingsVideoModal();
})

// Event listener to close the video settings modal when clicking outside of it
document.body.addEventListener('click', e => {
  // Check if clicked element is not within the settings modal and the toggle button, and if modal is active
  if (!e.target.closest('.video-info__settings') && activeVideoSettingsModalLm && !e.target.closest('.video-info__toggle-settings-btn')) {
    closeSettingsVideoModal();
  }
}) 

// Event listener for window resize to adjust video settings modal position if modal is open
window.addEventListener('resize', () => {
  // Recalculate modal position on resize if modal is open
  if (activeVideoSettingsModalLm) {
    checkAndAdjustModalPosition(activeVideoSettingsModalLm, activeVideoSettingsModalLm.parentNode.querySelector('.video-info__toggle-settings-btn'));
  }
});

const videoLinksLms = document.querySelectorAll('.video-container');
// Loop through each video link to add event listeners for video settings modal button click
videoLinksLms.forEach(videoLink => {
  // Prevent default action on click (e.g. following a link)
  videoLink.addEventListener('click', e => e.preventDefault());

  // Find and handle settings button for each video link
  const settingsBtn = videoLink.querySelector('.video-info__toggle-settings-btn');
  settingsBtnsLms.push(settingsBtn); // Store settings buttons for further reference

  settingsBtn.addEventListener('click', e => {
    settingsBtnsLms.forEach(btn => {
      const videoLinkLm = document.getElementById(`video-link-${btn.dataset.id}`) // Get parent video link element
      const settingsModalLm = videoLinkLm.querySelector('.video-info__settings') // Find settings modal within the video link
      
      // Toggle modal
      if (btn === e.target.closest('.video-info__toggle-settings-btn')) {
        toggleVideoSettingsModal(settingsModalLm);
      } 
      // Close the rest
      else {
        settingsModalLm.classList.remove('show');
      }
    });
  });
});

// Side menu toggle event
navbarMenuBtn.addEventListener('click', toggleSideMenu);

// Add navbar modal events
navbarSettingsBtn.addEventListener('click', handleToggleModalSettings);
middleSearchWtichVoiceBtn.addEventListener('click', openSearchWithVoiceModal);
rightSearchWithVoiceBtn.addEventListener('click', openSearchWithVoiceModal);

// Add event listeners to open search bar
openSearchBarBtn.addEventListener('click', openSearchBar);

// Add event handlers to both side menus
addSideMenuEventsHandler('side-menu');
addSideMenuEventsHandler('side-menu-thin');

setSideMenuActiveClassHandler(); // Initial call to set the active class based on the current URL hash