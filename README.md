# [YouTube Clone](https://youtube-clone1.pages.dev/) 

Front-end YouTube **home page clone** developed from scratch using **HTML**, **CSS**, and **JavaScript**, featuring videos containing information about Studio Ghibli movies. The application offers a **responsive** and **accessible** interface, replicating most of the YouTube home page's logic and styles.

![YouTube home page clone screenshot](https://i.imgur.com/u9JDkMy.jpeg)

## Table of Contents

* [Reusable Modal Logic](#reusable-modal-logic)
  * [`toggleModalEvents()`](#togglemodalevents)
  * [`toggleModalFocus()`](#togglemodalfocus)

* [Navbar and Side Menu](#navbar-and-side-menu)
  * [Navbar](#navbar)
    * [Side Menu](#side-menu)
    * [Side Menu Thin](#side-menu-thin)
    * [Side Menu Modal](#side-menu-modal)
    * [Search bar](#search-bar)
    * [Settings](#settings)
    * [Search with Voice](#search-with-voice)

* [Video Containers and Progressive Image Loading](#video-containers-and-progressive-image-loading)

* [Future Improvements](#future-improvements)


## Reusable Modal Logic

Implemented **reusable modal logic** used across **all** modals **except** the video settings ones. It uses **currying** and **closures** to provide reusable `toggleModalEvents()` and `toggleModalFocus()` functions.

### `toggleModalEvents()`

Manages essential events and functions for an **accessible** and **responsive** modal, including **focus trapping**, closing the modal with the **'Esc'** key, and handling **overlay clicks**.

```js
function trapFocus(e, element) {
  const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  const firstFocusableLm = focusableLms[0]; 
  const lastFocusableLm = focusableLms[focusableLms.length - 1];

  const isTabPressed = (e.key === 'Tab');
  
  if (!isTabPressed) { 
    return; 
  }

  if (e.shiftKey) /* shift + tab */ {
    if (document.activeElement === firstFocusableLm ) {
      lastFocusableLm.focus();
      e.preventDefault();
    }
  } 
  else /* tab */ {
    if (document.activeElement === lastFocusableLm) {
      firstFocusableLm.focus();
      e.preventDefault();
    }
  }
}

// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = closeFun => e => {
  if (e.key === 'Escape') closeFun();
};

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  switch(matchingClass) {
    case '.settings-modal':
      // Check if click is outside of settings modal and it's not the toggle button
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

// Event handler function for trapping focus within the modal content
const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
}

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(eventsHandler, action, closeFun, closeModalBtn, modalContentLm, modalContainerLm, matchingClass) {
  // Create bound event handler functions
  function addEventListeners() {
    const escKeyHandler = handleModalCloseAtEscapeKey(closeFun);
    const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
    const trapFocusHandler = handleTrapFocus(modalContentLm);

    // Add event listeners if elements exist
    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    closeModalBtn?.addEventListener('click', closeFun);

    // Store handlers on the eventsHandler object to remove them later
    eventsHandler.escKeyHandler = escKeyHandler;
    modalContentLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    modalContainerLm && (eventsHandler.outsideClickHandler = outsideClickHandler);
    closeModalBtn && (eventsHandler.closeFun = closeFun);
  }

  function removeEventListeners() {
    // Remove event listeners if elements exist
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
```

### `toggleModalFocus()`

Manages **modal focus** and **returns** it to the last active element before the modal was opened.

```js
let lastFocusedLmBeforeModalOpened;

export function toggleModalFocus(focusBehaviour, firstFocusableLm) {
  if (focusBehaviour === 'addFocus') {
    lastFocusedLmBeforeModalOpened = document.activeElement;
    firstFocusableLm.focus();
  } 
  else if (focusBehaviour === 'returnFocus') {
    lastFocusedLmBeforeModalOpened.focus();
  }
}
```


## Navbar and Side Menu

Implemented a **fully responsive navbar** and **side menu**, incorporating **nearly all** of the functionality and logic found in YouTube's interface.

### Navbar

The implemented navigation menu is **fully responsive** across all device sizes. It includes features such as toggling the **side menu**, opening the **search input** on smaller devices, and accessing **settings** and **voice search** modals.

#### Side Menu
![Youtube clone side menu](https://i.imgur.com/u9JDkMy.jpeg)

#### Side Menu Thin
![Youtube clone side thin](https://i.imgur.com/6ZoXMnA.jpeg)

#### Side Menu Modal
![Youtube clone side menu modal](https://i.imgur.com/EZw2cVU.jpeg)

#### Search Bar

![Youtube clone search bar](https://i.imgur.com/u9JDkMy.jpeg)

![YouTube clone navbar settings modal](https://i.imgur.com/wIQYnnv.jpeg)

#### Settings

![YouTube clone navbar settings modal](https://i.imgur.com/ZBfZtkf.jpeg)

#### Search with Voice

![YouTube clone navbar settings modal](https://i.imgur.com/cD478yj.jpeg)

## Video Containers and Progressive Image Loading

The application also features **ten mock videos** about **Studio Ghibli** movies. Their thumbnails and avatars use **progressive image loading**, which enhances **performance** and **reduces layout shifts**, especially on lower bandwidth connections.

![YouTube clone progressive image loding](https://i.imgur.com/3ozakrg.jpeg)

![YouTube clone progressive image loding preview thumbnails](https://i.imgur.com/d7iPT2s.jpeg)


## Future Improvements

- Configure a **server** using Node.js, Express, and MongoDB to **fetch** and **buffer** video content from an actual database.
- Optimize and refactor side menu **generated HTML** for improved **performance** and **readability**.
- Add **search functionality** on the server side.
- Add **loaders**.
- Implement a dedicated page for **video playback** and play a **preview** when the user hovers on the video container.