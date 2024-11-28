
import { startSearch } from '/scripts/search.js'
startSearch();

function updateLockScreenDateTime() {
    const timeElement = document.getElementById("time-display");
    const dateElement = document.getElementById("date-display");
    const now = new Date();

    // Format time without leading zero for hours
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const isPM = hours >= 12;

    // Convert to 12-hour format if needed
    hours = hours % 12 || 12; // Convert `0` to `12` for 12-hour format
    minutes = minutes.toString().padStart(2, "0"); // Always keep minutes double digits

    const formattedTime = `${hours}:${minutes} ${isPM ? "PM" : "AM"}`;

    // Format date (e.g., "Monday, January 1")
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString([], dateOptions);

    // Update content
    timeElement.textContent = formattedTime;
    dateElement.textContent = formattedDate;
}

// Update every second
setInterval(updateLockScreenDateTime, 1000);
updateLockScreenDateTime(); // Initialize immediately


