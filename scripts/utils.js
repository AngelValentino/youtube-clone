let lastFocusedLmBeforeModalOpened;

export function trapFocus(e, element) {
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

export function toggleModalFocus(focusBehaviour, firstFocusableLm) {
  if (focusBehaviour === 'addFocus') {
    lastFocusedLmBeforeModalOpened = document.activeElement;
    firstFocusableLm.focus();
  } 
  else if (focusBehaviour === 'returnFocus') {
    lastFocusedLmBeforeModalOpened.focus();
  }
}