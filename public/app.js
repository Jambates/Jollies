document.addEventListener('DOMContentLoaded', () => {
  const dataContainer = document.getElementById('data-container');
  const form = document.getElementById('data-form');
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');

  // Fetch and display data from /api/data
  function fetchData() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        // Clear the current data in the container
        dataContainer.innerHTML = '';
        
        // Loop through the data and create HTML elements for each
        data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('data-item');
          
          const name = document.createElement('h3');
          name.textContent = item.name;
          
          const message = document.createElement('p');
          message.textContent = item.message;
          
          itemDiv.appendChild(name);
          itemDiv.appendChild(message);
          dataContainer.appendChild(itemDiv);
        });
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        dataContainer.innerHTML = 'Error loading data.';
      });
  }

  // Submit form data to /api/data (POST request)
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
      // Send POST request to add new data
      fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      })
        .then(response => response.json())
        .then(newData => {
          console.log('New data added:', newData);
          // Clear the form inputs
          nameInput.value = '';
          messageInput.value = '';
          
          // Re-fetch and display the updated data
          fetchData();
        })
        .catch(err => {
          console.error('Error adding data:', err);
        });
    } else {
      alert('Please provide both name and message.');
    }
  });

  // Fetch initial data when the page loads
  fetchData();
});
