const navigationBar = document.getElementById('navigation-bar');
const navigationBarLeftLm = document.getElementById('navigation-bar__left');
const navigationBarMiddleLm = document.getElementById('navigation-bar__middle');
const navigationBarRightLm = document.getElementById('navigation-bar__right');
const openSearchBarBtn = document.getElementById('navigation-bar-right__search-btn');
const returnBtn = document.getElementById('navigation-bar__return-btn');
const searchInputLm = document.getElementById('navigation-bar-middle__search-input')
const closeSearchInputBtn = document.getElementById('navigation-bar-middle__search-input-close-btn')

// Toggle display of 'navigation-bar' sections
function toggleSearchDisplay(leftDisplay, middleDisplay, rightDisplay) {
  navigationBarLeftLm.style.display = leftDisplay; // Set the display style of the left navigation bar section
  navigationBarMiddleLm.style.display = middleDisplay; // Set the display style of the middle navigation bar section
  navigationBarRightLm.style.display = rightDisplay; // Set the display style of the right navigation bar section
}

// Open the search bar and add event listeners for closing it
function openSearchBar() {
  toggleSearchDisplay('none', 'flex', 'none'); // Open search bar: hide left and right, show middle
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscapeKey);
}

// Close the search bar and remove event listeners
function closeSearchBar() {
  toggleSearchDisplay('flex', 'none', 'flex'); // Close search bar: show left and right, hide middle
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
}

/* JavaScript processes the addEventListener call after the handleEscapeKey 
function has been declared and assigned to the const. That's why both of 
them work, despite the fact that arrow functions do not allow hoisting. */
// Close search bar if click is outside navigation bar
const handleOutsideClick = e => !navigationBar.contains(e.target) && closeSearchBar();

// Handle Escape key press to close search bar
const handleEscapeKey = e => e.key === 'Escape' && closeSearchBar();

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