import { toggleModalEvents } from "./modal.js";

const returnBtn = document.getElementById('navigation-bar__return-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input')
const middleSearchWtichVoiceBtn = document.getElementById('navigation-bar-middle__search-with-voice-btn');
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn');

export function toggleSearchDisplay(leftDisplay, middleDisplay, rightDisplay) {
  document.getElementById('navigation-bar__left').style.display = leftDisplay; // Set the display style of the left navigation bar section
  document.getElementById('navigation-bar__middle').style.display = middleDisplay; // Set the display style of the middle navigation bar section
  document.getElementById('navigation-bar__right').style.display = rightDisplay; // Set the display style of the right navigation bar section
}

export function closeSearchBar() {
  middleSearchWtichVoiceBtn.classList.remove('tooltip-navbar--bottom-rigth')
  toggleSearchDisplay('flex', 'none', 'flex'); // Close search bar: show left and right, hide middle
  toggleModalEvents('remove', null, null, document.body, returnBtn);
}

// Open the search bar and add event listeners for closing it
export function openSearchBar() {
  toggleSearchDisplay('none', 'flex', 'none'); // Open search bar: hide left and right, show middle
  toggleModalEvents('add', closeSearchBar, null, document.body, returnBtn, '.navigation-bar');
  searchInputLm.focus();
  middleSearchWtichVoiceBtn.classList.add('tooltip-navbar--bottom-rigth')
}

// Reset search input fields and remove event listeners
export function resetSearchInput() {
  searchInputLm.value = '';
  closeSearchInputBtn.style.display = 'none';
  searchInputLm.style.padding = '10px 4px 10px 16px';
  closeSearchInputBtn.removeEventListener('click', resetSearchInput);
  searchInputLm.removeEventListener('keydown', resetSearchInputAtEsc);
};

// Handle Escape key press to reset search input
export const resetSearchInputAtEsc = e => e.key === 'Escape' && resetSearchInput();
