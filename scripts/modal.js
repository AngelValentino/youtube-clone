import { trapFocus, toggleModalFocus } from "./utils.js";

let modalContainerTimId;

// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = closeFun => e => {
  if (e.key === 'Escape') closeFun();
};

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  switch (matchingClass) {
    case '.navigation-bar':
      // Check if target is not within the navigation bar
      if (!e.target.closest(matchingClass)) closeFun();
      break;
    case '.settings-modal':
      // Check if click is outside of settings modal and it is not the toggle button
      if (!e.target.closest(matchingClass) && !e.target.closest('.navigation-bar-right__settings-btn')) closeFun();
      break;
    default:
      // Check if target matches the specified matchingClass, default overlay click
      if (e.target.matches(matchingClass)) closeFun(); 
      break;
  }
};

// Function to handle focus trapping within modal content
const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
};

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(action, modalEvents, closeFun, modalContentLm, modalContainerLm, closeModalBtn, matchingClass) {
  // Create bound event handler functions
  const escKeyHandler = handleModalCloseAtEscapeKey(closeFun);
  const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
  const trapFocusHandler = handleTrapFocus(modalContentLm);

  if (action === 'add') {
    // Add event listeners
    document.body.addEventListener('keydown', escKeyHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    closeModalBtn?.addEventListener('click', closeFun);

    // Store handlers in the events object
    modalEvents.escKeyHandler = escKeyHandler;
    modalContentLm && (modalEvents.outsideClickHandler = outsideClickHandler);
    modalContainerLm && (modalEvents.trapFocusHandler = trapFocusHandler);
    closeModalBtn && (modalEvents.closeFun = closeFun);
  } 
  else if (action === 'remove') {
    // Remove event listeners
    document.body.removeEventListener('keydown', modalEvents.escKeyHandler);
    modalContainerLm?.removeEventListener('click', modalEvents.outsideClickHandler);
    modalContentLm?.removeEventListener('keydown', modalEvents.trapFocusHandler);
    closeModalBtn?.removeEventListener('click', modalEvents.closeFun);

    // Clear references in the events object
    delete modalEvents.escKeyHandler;
    delete modalEvents.outsideClickHandler;
    delete modalEvents.trapFocusHandler;
    delete modalEvents.closeFun;
  }
}

export function openSearchWithVoiceModal() {
  const modalContainerLm = document.getElementById('search-with-voice-modal-container');
  const modalOverlayLm = document.getElementById('search-with-voice-modal-overlay');
  const modalContentLm = document.getElementById('search-with-voice-modal-content');
  const closeModalBtn = document.getElementById('search-with-voice-modal__close-btn');
  const modalEvents = {};

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

    // Remove event listeners and perform cleanup
    toggleModalEvents('remove', modalEvents, null, modalContentLm, modalContainerLm, closeModalBtn);
  }

  // Add event listeners
  toggleModalEvents('add', modalEvents, closeModal, modalContentLm, modalContainerLm, closeModalBtn, '.search-with-voice-modal-overlay');
}

export function handleToggleModalSettings() {
  const settingsModalLm = document.getElementById('settings-modal');
  const modalEvents = {};
  let clickEvent;

  function checkSearchBar(e) {
    clickEvent = e;
  }

  function checkSettingsFocus(clickEvent) {
    const isSettingsButtonClicked = clickEvent?.target.closest('.navigation-bar-right__settings-btn');
    const isOutsideNavigationBar = !clickEvent?.target.closest('.navigation-bar');
  
    return isSettingsButtonClicked || isOutsideNavigationBar;
  }

  function closeModal() {
    settingsModalLm.style.display = 'none';
    settingsModalLm.classList.remove('settings-modal--open');
    checkSettingsFocus(clickEvent) && toggleModalFocus('returnFocus'); // Return focus to the last active element only if it is not the search bar, search with voice or menu button.
    // Remove event listeners and perform cleanup
    toggleModalEvents('remove', modalEvents, null, settingsModalLm, document.body, null);
    document.body.removeEventListener('click', checkSearchBar)
  }

  function openModal() {
    document.body.addEventListener('click', checkSearchBar)
    settingsModalLm.style.display = 'block';
    settingsModalLm.classList.add('settings-modal--open');
    toggleModalFocus('addFocus', settingsModalLm.children[0]); // Add focus to the first modal element
    // Add event listeners
    toggleModalEvents('add', modalEvents, closeModal, settingsModalLm, document.body, null, '.settings-modal');
  }

  // Check if the settings modal is already open or closed and toggle accordingly
  settingsModalLm.classList.contains('settings-modal--open') ? closeModal() : openModal();
}