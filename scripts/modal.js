import { trapFocus, toggleModalFocus } from "./utils.js";

let modalContainerTimId;
let settingsModalClickEvent; // Stores the last click event for the settings modal
const settingsModalLm = document.getElementById('settings-modal');

//* SEARCH WITH VOICE MODAL 

export function openSearchWithVoiceModal() {
  const modalContainerLm = document.getElementById('search-with-voice-modal-container');
  const modalOverlayLm = document.getElementById('search-with-voice-modal-overlay');
  const modalContentLm = document.getElementById('search-with-voice-modal-content');
  const closeModalBtn = document.getElementById('search-with-voice-modal__close-btn');

  // Handles focus trapping within the modal
  function handleTrapFocus(e) {
    trapFocus(e, modalContentLm);
  }

  // Handles overlay click events
  function handleOverlayClick(e) {
    if (e.target.matches('.search-with-voice-modal-overlay')) closeModal(); 
  }

  // Handles closing the modal at Escape key press
  function handleEscKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  // Display modal and set initial styles
  modalContainerLm.style.display = 'block';
  clearTimeout(modalContainerTimId);
  toggleModalFocus('addFocus', closeModalBtn); // Add focus to the first modal element
  setTimeout(() => {
    modalOverlayLm.style.opacity = 1;
    modalContentLm.style.opacity = 1;
  });

  function closeModal() {
    modalOverlayLm.style.transition = 'opacity 0.15s';
    modalOverlayLm.style.opacity = 0;
    modalContentLm.style.opacity = 0;
    modalContainerTimId = setTimeout(() => {
      modalContainerLm.style.display = 'none';
      toggleModalFocus('returnFocus'); // Return focus to the last active element
    }, 150);

    // Remove events
    document.body.removeEventListener('keydown', handleEscKey);
    modalContentLm.removeEventListener('keydown', handleTrapFocus);
    modalContainerLm.removeEventListener('click', handleOverlayClick)
    closeModalBtn.removeEventListener('click', closeModal);
  }

  // Add event listeners
  document.body.addEventListener('keydown', handleEscKey);
  modalContainerLm.addEventListener('click', handleOverlayClick)
  modalContentLm.addEventListener('keydown', handleTrapFocus);
  closeModalBtn.addEventListener('click', closeModal);
}

//* END OF SEARCH WITH VOICE MODAL 

//* SETTINGS MODAL

function closeSettingsModal() {
  settingsModalLm.style.display = 'none';
  settingsModalLm.classList.remove('settings-modal--open');
  // Checks if focus should be returned when the settings modal is closed
  checkSettingsModalReturnFocus(settingsModalClickEvent) && toggleModalFocus('returnFocus');

  //Remove Events 
  document.body.removeEventListener('click', updateSettingsModalClickEvent)
  document.body.removeEventListener('keydown', handleCloseSettingsModalAtEscapekey);
  document.body.removeEventListener('click', handleSettingsModalOutsideClick);
  settingsModalLm.removeEventListener('keydown', handleTrapFocusSettingsModal)
}

// Handles focus trapping within the settings modal
function handleTrapFocusSettingsModal(e) {
  trapFocus(e, settingsModalLm);
}

// Handles Escape key press to close the settings modal
function handleCloseSettingsModalAtEscapekey(e) {
  if (e.key === 'Escape') closeSettingsModal();
}

// Handles clicks outside the settings modal to close it
function handleSettingsModalOutsideClick(e) {
  if (!e.target.closest('.settings-modal') && !e.target.closest('.navigation-bar-right__settings-btn')) closeSettingsModal();
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
    document.body.addEventListener('click', updateSettingsModalClickEvent)
    document.body.addEventListener('keydown', handleCloseSettingsModalAtEscapekey);
    document.body.addEventListener('click', handleSettingsModalOutsideClick);
    settingsModalLm.addEventListener('keydown', handleTrapFocusSettingsModal)
  }

  // Check if the settings modal is already open or closed and toggle accordingly
  settingsModalLm.classList.contains('settings-modal--open') ? closeSettingsModal() : openModal();
}

//* END OF SETTINGS MODAL