// Get the form and submit button elements
const form = document.getElementById('myForm');
const submitBtn = document.getElementById('submitBtn');

// Add event listener to the form submission
form.addEventListener('submit', function(e) {
  e.preventDefault(); // prevent default form submission
  sendData();
});

// Add event listener to the form inputs
form.addEventListener('input', function() {
  // Check if form is valid and enable/disable the submit button accordingly
  if (form.checkValidity()) {
    submitBtn.removeAttribute('disabled');
  } else {
    submitBtn.setAttribute('disabled', true);
  }
});

// Function to send data to server
function sendData() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;

  if (navigator.onLine) {
    // User is online, send data to server
    var data = {
      name: name,
      email: email
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/submit'); // Change URL to match your server's IP address and port
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Data sent successfully.');
          // Remove data from local storage if it was saved earlier
          localStorage.removeItem('offlineData');
        } else {
          console.error('Error sending data: ' + xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  } else {
    // User is offline, save data to local storage
    var offlineData = {
      name: name,
      email: email
    };
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
    console.log('Data saved to local storage.');
  }
}

// Check if there is any data stored in local storage and send it to server
function sendOfflineDataToServer() {
  if (localStorage.getItem('offlineData')) {
    const offlineData = JSON.parse(localStorage.getItem('offlineData'));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/submit');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Data sent successfully.');
          // Remove data from local storage
          localStorage.removeItem('offlineData');
        } else {
          console.error('Error sending data: ' + xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(offlineData));
  }
}

// Add event listener to online event
window.addEventListener('online', function(e) {
  console.log('Network is back online.');
  sendOfflineDataToServer();
});

// Set interval to check for network status every 5 seconds
setInterval(function() {
  if (navigator.onLine) {
    sendOfflineDataToServer();
  }
}, 5000);

// Send saved data to server when the page loads, in case the user has reloaded the page while offline
window.addEventListener('load', function() {
  sendOfflineDataToServer();
});
