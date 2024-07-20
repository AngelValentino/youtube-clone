export function addProgressiveLoading(element) {
  element.forEach(div => {
    const thumbnailImg = div.querySelector('img');
  
    function loaded() {
      div.classList.add('loaded');
    }
  
    if (thumbnailImg.complete) {
      loaded();
    } 
    else {
      thumbnailImg.addEventListener('load', loaded);
    }
  });
}

// dateString = YYYY-MM-DD
export const timeAgo = (dateString) => {
  // Get the current date and time
  const currentTime = new Date();
  // Parse the input date string and assume it is midnight UTC (start of the day)
  const lastPost = new Date(dateString + 'T00:00:00Z');
  // Calculate the difference in milliseconds between the current time and the input date
  const timeDifference = currentTime - lastPost;
  // Define the number of milliseconds in different time units
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerYear = msPerDay * 365;
  // Calculate the time differences in each unit
  const secondsAgo = Math.floor(timeDifference / msPerSecond); // Calculate the difference in seconds
  const minutesAgo = Math.floor(timeDifference / msPerMinute); // Calculate the difference in minutes
  const hoursAgo = Math.floor(timeDifference / msPerHour); // Calculate the difference in hours
  const daysAgo = Math.floor(timeDifference / msPerDay); // Calculate the difference in days
  const yearsAgo = Math.floor(timeDifference / msPerYear); // Calculate the difference in years

  // Format time units with proper singular or plural form
  const formatTimeUnit = (value, unit) => value === 1 ? `${value} ${unit} ago` : `${value} ${unit}s ago`;

  // Return the appropriate time ago format based on the time difference

  if (secondsAgo < 60) return formatTimeUnit(secondsAgo, 'second'); // Return the time difference in seconds if seconds are less than a minute
  if (minutesAgo < 60) return formatTimeUnit(minutesAgo, 'minute'); // Return the time difference in minutes if minutes are less than an hour
  if (hoursAgo < 24) return formatTimeUnit(hoursAgo, 'hour'); // Return the time difference in hours if hours are less than a day
  if (daysAgo < 365) return formatTimeUnit(daysAgo, 'day'); // Return the time difference in days if days are less than a year
  
  return formatTimeUnit(yearsAgo, 'year'); // Return the time difference in years for all other cases
};


export function formatNumber(number) {
  // Check if the number is less than 1000

  if (number < 1000) {
    return number;
  } 
  // Check if the number is between 1000 (inclusive) and 1 million (exclusive)
  else if (number >= 1000 && number < 1_000_000) {
    const result = (number / 1000); // Calculate the number in thousands
    if (result % 1 === 0) {
      return result.toFixed(0) + "K"
    } 
    else {
      return Number(result.toFixed(1)) % 1 === 0 ? result.toFixed(0) + "K" : result.toFixed(1) + "K";
    }
  
  } 
  else if (number >= 1_000_000 && number < 1_000_000_000) {
    const result = (number / 1_000_000);
    if (result % 1 === 0) {
      return result.toFixed(0) + "M"
    } 
    else {
      return Number(result.toFixed(1)) % 1 === 0 ? result.toFixed(0) + "M" : result.toFixed(1) + "M";
    }

  }

  return number; //Edge cases, return number instead of undefined
}