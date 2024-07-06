import { trapFocus, toggleModalFocus } from "./utils.js";
let modalContainerTimId;

// Event handler function for closing modal on Escape key
export const handleModalCloseAtEscapeKey = closeFun => e => {
  if (e.key === 'Escape') closeFun();
}

// Event handler function for closing modal on outside click
export const handleModalOutsideClick = (closeFun, matchingClass) => e => {
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
}

// Function to handle focus trapping within modal content
export const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
}

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(add, closeFun, modalContentLm, modalContainerLm, closeModalBtn, matchingClass) {
  // Create bound event handler functions
  const escKeyHandler = handleModalCloseAtEscapeKey(closeFun);
  const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
  const trapFocusHandler = handleTrapFocus(modalContentLm);

  if (add === 'add') /* Add event listeners */ {
    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    closeModalBtn?.addEventListener('click', closeFun);

    // Store handlers on elements to remove later
    document.body._escKeyHandler = escKeyHandler;
    modalContentLm && (modalContentLm._trapFocusHandler = trapFocusHandler)
    modalContainerLm && (modalContainerLm._outsideClickHandler = outsideClickHandler);
    closeModalBtn && (closeModalBtn._closeFun = closeFun);
  } 
  else if (add === 'remove') /* Remove event listeners */ {
    document.body.removeEventListener('keydown', document.body._escKeyHandler);
    modalContentLm?.removeEventListener('keydown', modalContentLm._trapFocusHandler);
    modalContainerLm?.removeEventListener('click', modalContainerLm._outsideClickHandler);
    closeModalBtn?.removeEventListener('click', closeModalBtn._closeFun);

    // Clean up stored handlers
    delete document.body._escKeyHandler;
    modalContentLm && delete modalContentLm._trapFocusHandler;
    modalContainerLm && delete modalContainerLm._outsideClickHandler;
    closeModalBtn && delete closeModalBtn._closeFun;
  }
}

export function openSearchWithVoiceModal() {
  const modalContainerLm = document.getElementById('search-with-voice-modal-container');
  const modalOveralyLm = document.getElementById('search-with-voice-modal-overlay');
  const modalContentLm = document.getElementById('search-with-voice-modal-content');
  const closeModalBtn = document.getElementById('search-with-voice-modal__close-btn');

  // Display modal and set initial styles
  modalContainerLm.style.display = 'block';
  clearTimeout(modalContainerTimId);
  toggleModalFocus('addFocus', closeModalBtn); // Add focus to the first modal element
  setTimeout(() => {
    modalOveralyLm.style.opacity = 1;
    modalContentLm.style.opacity = 1;
  });

  function closeModal() {
    modalOveralyLm.style.transition = 'opacity 0.15s'
    modalOveralyLm.style.opacity = 0;
    modalContentLm.style.opacity = 0;
    modalContainerTimId = setTimeout(() => {
      modalContainerLm.style.display = 'none';
      toggleModalFocus('returnFocus'); // Return focus to the last active element
    }, 150);

    // Remove event listeners and perform cleanup
    toggleModalEvents('remove', null, modalContentLm, modalContainerLm, closeModalBtn, '.search-with-voice-modal-overlay');
  }

  // Add event listeners
  toggleModalEvents('add', closeModal, modalContentLm, modalContainerLm, closeModalBtn, '.search-with-voice-modal-overlay');
}

// Handle settings modal toggle (open or close settings modal)
export function handleToggleModalSettings() {
  const settingsModalLm = document.getElementById('settings-modal');

  // Close settings modal
  function closeModal() {
    // Hide the modal and remove the 'settings-modal--open' class
    settingsModalLm.style.display = 'none';
    settingsModalLm.classList.remove('settings-modal--open');
    toggleModalFocus('returnFocus'); // Return focus to the last active element
    // Remove event listeners and perform cleanup
    toggleModalEvents('remove', null, settingsModalLm, document.body, null, '.settings-modal');
  }

  // Open settings Modal
  function openModal() {
    // Display the modal and add the 'settings-modal--open' class
    settingsModalLm.style.display = 'block';
    settingsModalLm.classList.add('settings-modal--open');
    toggleModalFocus('addFocus', settingsModalLm.children[0]); // Add focus to the first modal element
    // Add event listeners
    toggleModalEvents('add', closeModal, settingsModalLm, document.body, null, '.settings-modal');
  }

  // Check if the settings modal is already open or closed and toggle accordingly
  settingsModalLm.classList.contains('settings-modal--open') ? closeModal() : openModal();
}