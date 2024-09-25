import React, { useEffect } from 'react'
import { unstable_usePrompt as usePrompt } from 'react-router-dom';

const Prompt = ({ when, message }) => {

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (when) {
        const confirmationMessage = 'Do Not Refresh!';
        event.preventDefault();
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For Safari
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when]);

  usePrompt({
    when: when,
    message: message
  })

  return (<></>)
}

export default Prompt