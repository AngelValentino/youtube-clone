import { toggleModalEvents, toggleModalFocus } from "./modal.js";

const sideMenuLm = document.getElementById('aside-side-menu');
const sideMenuThinLm = document.getElementById('aside-side-menu-thin');
const sideMenuOverlayLm = document.getElementById('side-menu__overlay');
const sideModalMenuBtn = document.getElementById('side-menu-modal-header__menu-btn')
const sideModalHeaderLm = document.getElementById('side-menu-modal-header');
const sideMenuInnerLm = document.getElementById('side-menu');
const sideMenuLinksLms = document.querySelectorAll('.side-menu__link');
const thinSideMenuLinksLms = document.querySelectorAll('.side-menu-thin__link')

export let isSideMenuModalOpen = false; // State to track if the side menu modal is open
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
  hideSideMenu();
  document.body.style.overflow = 'initial';
  sideMenuThinLm.classList.remove('hide', 'show');
  isSideMenuModalOpen = false;

  // Remove event listeners
  toggleModalEvents(sideMenuEventsHandler, 'remove', null, sideModalMenuBtn, sideMenuLm, document.body, null);
}

// Close the side menu with a sliding animation
export function closeSideMenuWithSlide() {
  clearTimeout(hideThinModalTimId);

  document.body.style.overflow = 'initial';
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

    toggleModalFocus('returnFocus');
  }, 250);

  // Remove event listeners
  toggleModalEvents(sideMenuEventsHandler, 'remove', null, sideModalMenuBtn, sideMenuLm, document.body, null);
}

// Function to check window width
function checkWindowSize() {
  if (window.innerWidth > 1312) {
    // Adjust body padding and show/hide side menu based on window size
    if (window.getComputedStyle(sideMenuThinLm).display === 'none') {
      document.body.style.padding = '100px 34px 0 275px';
      sideMenuLm.classList.remove('hide');
    }

    // Close modal side menu if is open when window is bigger than 1312 px
    if (isSideMenuModalOpen) closeSideMenu();
  } 
}


// Set up an event listener to detect window resize
window.addEventListener('resize', checkWindowSize);

export function toggleSideMenu() {
  // If window width is less than or equal to 1312px, show the side menu modal
  if (window.innerWidth <= 1312) {
    clearTimeout(closeSideMenuWithSlideTimId)
    clearTimeout(hideThinModalTimId);

    document.body.style.overflow = 'hidden';
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
      document.body.style.padding = '100px 34px 0 100px';
    } 
    // Show side menu
    else {
      sideMenuThinLm.classList.remove('show');
      sideMenuLm.classList.remove('hide');
      document.body.style.padding = '100px 34px 0 275px';
      toggleModalFocus('addFocus', sideMenuLinksLms[0]);
    }
  }
}


// Set the side menu links's 'active' class based on the current URL hash
function setSideMenuActiveClass(linksLms) {
  const currentHash = window.location.hash; // Get the current URL hash

  linksLms.forEach(link => {
    const sideMenuHref = link.getAttribute('href'); // Get the href attribute of the link

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
export function setSideMenuActiveClassHandler() {
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
export function addSideMenuEventsHandler(type) {
  if (type === 'side-menu') {
    addSideMenuEvents(sideMenuLinksLms); // Add event listeners to side menu links
  } 
  else if (type === 'side-menu-thin') {
    addSideMenuEvents(thinSideMenuLinksLms); // Add event listeners to thin side menu links
  }
}