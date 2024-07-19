import { trapFocus, toggleModalFocus } from "./utils.js";

let modalContainerTimId;
let settingsModalClickEvent; // Stores the last click event for the settings modal
const settingsModalLm = document.getElementById('settings-modal');
const settingsEventsHandler = {};

// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = closeFun => e => {
  if (e.key === 'Escape') closeFun();
};

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  switch(matchingClass) {
    case '.settings-modal':
      // Check if click is outside of settings modal and its not the toggle button
      if (!e.target.closest(matchingClass) && !e.target.closest('.navigation-bar-right__settings-btn')) closeFun();
      break;
    
    case '.navigation-bar':
      // Check if click is outside of the navigation bar
      if (!e.target.closest(matchingClass)) closeFun();
      break;
    
    default: 
      // Check if click matches the specified matchingClass
      if (e.target.matches(matchingClass)) closeFun(); 
  }
};

// Function to handle focus trapping within modal content
const handleTrapFocus = modalContentLm => e => {
  console.log('trap focus')
  trapFocus(e, modalContentLm);
}

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(eventsHandler, action, closeFun, closeModalBtn, modalContentLm, modalContainerLm, matchingClass) {
  // Create bound event handler functions
  function addEventListeners() {
    const escKeyHandler = handleModalCloseAtEscapeKey(closeFun);
    const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
    const trapFocusHandler = handleTrapFocus(modalContentLm);

    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    closeModalBtn?.addEventListener('click', closeFun);

    // Store handlers on elements to remove later
    eventsHandler.escKeyHandler = escKeyHandler;
    modalContentLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    modalContainerLm && (eventsHandler.outsideClickHandler = outsideClickHandler);
    closeModalBtn && (eventsHandler.closeFun = closeFun);
  }

  function removeEventListeners() {
    document.body.removeEventListener('keydown', eventsHandler.escKeyHandler);
    modalContentLm?.removeEventListener('keydown', eventsHandler.trapFocusHandler);
    modalContainerLm?.removeEventListener('click', eventsHandler.outsideClickHandler);
    closeModalBtn?.removeEventListener('click', eventsHandler.closeFun);

    // Clean up stored handlers
    delete eventsHandler.escKeyHandler;
    modalContentLm && delete eventsHandler.trapFocusHandler;
    modalContainerLm && delete eventsHandler.outsideClickHandler;
    closeModalBtn && delete eventsHandler.closeFun;
  }

  if (action === 'add') {
    addEventListeners();
  } 
  else if (action === 'remove') {
    removeEventListeners();
  }
}

//* SEARCH WITH VOICE MODAL 

// Preload search with voice audio file
const searchWithVoiceAudio = new Audio('../audios/search-with-voice-sound.mp3');

export function openSearchWithVoiceModal() {
  const eventsHandler = {};
  const modalContainerLm = document.getElementById('search-with-voice-modal-container');
  const modalOverlayLm = document.getElementById('search-with-voice-modal-overlay');
  const modalContentLm = document.getElementById('search-with-voice-modal-content');
  const closeModalBtn = document.getElementById('search-with-voice-modal__close-btn');
  const searchWithVoiceBtn = document.getElementById('search-with-voice-modal__search-with-voice-btn');

  // Display modal and set initial styles
  modalContainerLm.style.display = 'block';
  clearTimeout(modalContainerTimId);
  toggleModalFocus('addFocus', closeModalBtn); // Add focus to the first modal element
  setTimeout(() => {
    modalOverlayLm.style.opacity = 1;
    modalContentLm.style.opacity = 1;
  });

  function playSound() {
    searchWithVoiceAudio.currentTime = 0; // Reset to the start
    searchWithVoiceAudio.play().catch(error => {
      console.error('Playback error:', error);
    });
  }

  function closeModal() {
    console.log('close search with voice modal')
    modalOverlayLm.style.transition = 'opacity 0.15s';
    modalOverlayLm.style.opacity = 0;
    modalContentLm.style.opacity = 0;
    modalContainerTimId = setTimeout(() => {
      modalContainerLm.style.display = 'none';
      toggleModalFocus('returnFocus'); // Return focus to the last active element
    }, 150);

    // Remove events listeners
    searchWithVoiceBtn.removeEventListener('click', playSound)
    toggleModalEvents(eventsHandler, 'remove', null, closeModalBtn, modalContentLm, modalContainerLm, null);
  }

  playSound();

  // Add event listeners
  searchWithVoiceBtn.addEventListener('click', playSound);
  toggleModalEvents(eventsHandler, 'add', closeModal, closeModalBtn, modalContentLm, modalContainerLm, '.search-with-voice-modal-overlay')
}

//* END OF SEARCH WITH VOICE MODAL 

//* SETTINGS MODAL

function closeSettingsModal() {
  console.log('close settings modal')
  settingsModalLm.style.display = 'none';
  settingsModalLm.classList.remove('settings-modal--open');
  // Checks if focus should be returned when the settings modal is closed
  checkSettingsModalReturnFocus(settingsModalClickEvent) && toggleModalFocus('returnFocus');

  //Remove Events 
  document.body.removeEventListener('click', updateSettingsModalClickEvent)
  toggleModalEvents(settingsEventsHandler, 'remove', null, null, settingsModalLm, document.body, null)
}

// Updates the document.body click event for the settings modal
function updateSettingsModalClickEvent(e) {
  settingsModalClickEvent = e;
}

// Checks if focus should be returned when the settings modal is closed
function checkSettingsModalReturnFocus(clickEvent) {
  // Check if the last click event was on the settings button in the navigation bar
  const isSettingsButtonClicked = clickEvent?.target.closest('.navigation-bar-right__settings-btn');
  // Check if the last click event was outside the navigation bar
  const isOutsideNavigationBar = !clickEvent?.target.closest('.navigation-bar');
  // Return true if the settings button was clicked or if the click was outside the navigation bar
  return isSettingsButtonClicked || isOutsideNavigationBar;
}

export function handleToggleModalSettings() {
  function openModal() {
    settingsModalLm.style.display = 'block';
    settingsModalLm.classList.add('settings-modal--open');
    toggleModalFocus('addFocus', settingsModalLm.children[0]); // Add focus to the first modal element
    
    // Add event listeners
    document.body.addEventListener('click', updateSettingsModalClickEvent);
    toggleModalEvents(settingsEventsHandler, 'add', closeSettingsModal, null, settingsModalLm, document.body, '.settings-modal');
  }

  // Check if the settings modal is already open or closed and toggle accordingly
  settingsModalLm.classList.contains('settings-modal--open') ? closeSettingsModal() : openModal();
}

//* END OF SETTINGS MODAL