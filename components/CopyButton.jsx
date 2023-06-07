// Import React hooks
import React, { useRef } from "react";

// Create a custom component for the copy button
const CopyButton = ({ text, paymentIntent }) => {
  // Create a ref for the hidden input element
  const inputRef = useRef(null);

  // Create a function to handle the click event
  const handleClick = async () => {
    // Check if the paymentIntent is not null
    if (paymentIntent) {
      // Select the input element
      inputRef.current.select();
      // Copy the text to the clipboard using Clipboard API
      try {
        await navigator.clipboard.writeText(text);
        // Show an alert message
        alert("Copied!");
      } catch (error) {
        // Show an error message
        alert("Error: Failed to copy.");
      }
    } else {
      // Show an error message
      alert("Error: No payment intent found.");
    }
  };

  // Add some styles for the button element
  const styles = {
    button: {
      width: "100px",
      height: "40px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#5469d4",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    // Use visibility and position to hide the input element instead of display
    input: {
      visibility: "hidden",
      position: "absolute",
    },
  };

  return (
    <div>
      {/* Create a hidden input element with the text value and apply the style */}
      <input ref={inputRef} value={text} readOnly style={styles.input} />
      {/* Create a button element with the click handler and the style */}
      <button onClick={handleClick} style={styles.button}>
        Copy
      </button>
    </div>
  );
};

// Export the component
export default CopyButton;
