import { useEffect } from 'react';

// This hook detects clicks outside of the specified component (modalRef) and calls the provided handler function (handler)
const useOnClickOutside = (modalRef, handler) => {
  useEffect(() => {
    // Define listener function to close modal, to be called on click/touch events
    const listenerToCloseModal = (event) => {
      // If the click/touch event originated from outside the modal then call the provided handler
      if (!modalRef.current || modalRef.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener('mousedown', listenerToCloseModal);
    document.addEventListener('touchstart', listenerToCloseModal);

    // Cleanup function to remove the vent listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener('mousedown', listenerToCloseModal);
      document.removeEventListener('touchstart', listenerToCloseModal);
    };
  }, [modalRef, handler]);
};

export default useOnClickOutside;
