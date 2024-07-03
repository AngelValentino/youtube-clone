import { trapFocus } from "./utils.js";

const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const returnBtn = document.getElementById('navigation-bar__return-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input')
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn')
const rightSearchWithVoiceBtn = document.getElementById('navigation-bar-right__search-with-voice-btn');
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
let modalContainerTimId;

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
  document.addEventListener('click', handleNavbarOutsideClick);
  document.addEventListener('keydown', handleNavbarEscapeKey);
}

// Close the search bar and remove event listeners
function closeSearchBar() {
  toggleSearchDisplay('flex', 'none', 'flex'); // Close search bar: show left and right, hide middle
  document.removeEventListener('click', handleNavbarOutsideClick);
  document.removeEventListener('keydown', handleNavbarEscapeKey);
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

function openSearchWithVoiceModal() {
  const modalContainerLm = document.getElementById('search-with-voice-modal-container');
  const modalOveralyLm = document.getElementById('search-with-voice-modal-overlay');
  const modalContentLm = document.getElementById('search-with-voice-modal-content');
  const closeModalBtn = document.getElementById('search-with-voice-modal__close-btn');
  const lastFocusLmBeforeAlertDialog = document.activeElement;

  clearTimeout(modalContainerTimId)
  modalContainerLm.style.display = 'block';
  closeModalBtn.focus();
  
  setTimeout(() => {
    modalOveralyLm.style.opacity = 1;
    modalContentLm.style.opacity = 1;
  });

  function handleTrapFocus(e) {
    trapFocus(e, modalContentLm);
  }

  function closeModal() {
    modalOveralyLm.style.transition = 'opacity 0.15s'
    modalOveralyLm.style.opacity = 0;
    modalContentLm.style.opacity = 0;
    modalContainerTimId = setTimeout(() => {
      modalContainerLm.style.display = 'none';
      lastFocusLmBeforeAlertDialog.focus();
    }, 150);
    document.body.removeEventListener('keydown', handleModalCloseAtEscapeKey);
    modalContainerLm.removeEventListener('click', handleModalOutsideClick);
    closeModalBtn.removeEventListener('click', closeModal);
    modalContentLm.removeEventListener('keydown', handleTrapFocus)
  }

  const handleModalCloseAtEscapeKey = e => e.key === 'Escape' && closeModal();

  const handleModalOutsideClick = e => e.target.matches('.search-with-voice-modal-overlay') && closeModal();

  document.body.addEventListener('keydown', handleModalCloseAtEscapeKey);
  modalContentLm.addEventListener('keydown', handleTrapFocus);
  modalContainerLm.addEventListener('click', handleModalOutsideClick);
  closeModalBtn.addEventListener('click', closeModal);
}

//TODO Refactor modal functions to be reusable and be used in search with voice and settings modal

const settingsModalData = [
  {
    icon: 'shield_person',
    title: 'Your data in YouTube',
    chevron: false
  },
  {
    icon: 'mode_night',
    title: 'Appearance: Device theme',
    chevron: true
  },
  {
    icon: 'translate',
    title: 'Language: English',
    chevron: true
  },
  {
    icon: 'admin_panel_settings',
    title: 'Restricted Mode: Off',
    chevron: true
  },
  {
    icon: 'language',
    title: 'Location: Spain',
    chevron: true
  },
  {
    icon: 'keyboard',
    title: 'Keyboard shortcuts',
    chevron: false
  },
  {
    icon: 'settings',
    title: 'Settings',
    chevron: false
  },
  {
    icon: 'help',
    title: 'Help',
    chevron: false
  },
  {
    icon: 'feedback',
    title: 'Send feedback',
    chevron: false
  }
]

function hasChildren(element) {
  return element.children.length > 0;
}

function handleToggleModalSettings() {
  const settingsModalLm = document.getElementById('settings-modal');
  settingsModalLm.style.display = 'block';
  settingsModalLm.classList.toggle('open');

  function closeModal() {
    settingsModalLm.style.display = 'none';
    settingsModalLm.classList.remove('open');

    settingsModalLm.removeEventListener('keydown', handleTrapFocus);
    document.body.removeEventListener('keydown', handleCloseAtEscapeKey);
    document.body.removeEventListener('keydown', handleOutsideClick);
  }

  function handleTrapFocus(e) {
    trapFocus(e, settingsModalLm)
  }

  function handleOutsideClick(e) {
    if (!e.target.closest('.settings-modal') && !e.target.closest('.navigation-bar-right__settings-btn')) {
      closeModal()
    }
  }
  
  const handleCloseAtEscapeKey = e => e.key === 'Escape' && closeModal();

  function openModal() {
    if (!hasChildren(settingsModalLm)) {
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
    }

    settingsModalLm.style.display = 'block';

    document.body.addEventListener('click', handleOutsideClick)
    settingsModalLm.addEventListener('keydown', handleTrapFocus);
    document.body.addEventListener('keydown', handleCloseAtEscapeKey);
  }

  settingsModalLm.classList.contains('open') ? openModal() : closeModal();


}

const navbarSettingsBtn = document.getElementById('navigation-bar-right__settings-btn');

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