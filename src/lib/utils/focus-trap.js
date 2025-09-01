/**
 * 🎯 Focus Trap Utility - DOC_CoPilot_Practices
 * Utilitaire pour piéger le focus dans les modals
 */

export function trapFocus(node) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  function getFocusableElements() {
    return Array.from(node.querySelectorAll(focusableElements))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const focusableEls = getFocusableElements();
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl?.focus();
        e.preventDefault();
      }
    }
  }

  // Focus le premier élément focusable quand le trap est activé
  const focusableEls = getFocusableElements();
  if (focusableEls.length > 0) {
    focusableEls[0]?.focus();
  }

  node.addEventListener('keydown', handleKeyDown);

  return {
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    }
  };
}
