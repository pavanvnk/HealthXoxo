# Food Tracker

This project is a web application for tracking daily nutrient intake. Users can log in, add the food items they eat throughout the day, and view their daily intake of nutrients like calories, protein, and carbs.

## Installation
To install this application, clone the repository to your local machine:

## Getting Started

To run this app on your local machine,

- Clone the repository into your local system using below command:

  ```bash
  git clone https://github.com/pavanvnk/HealthXoxo.git
  ```
  This will clone the whole repository in your system.

- To download required dependencies to your system, navigate to the directory where the cloned repository resides and execute following command:
  ```node
  npm install
  ```

- Create a new file `.env` and enter following commands with your tokens  

  ```javascript
  MONGOOSE_KEY=your_key;
  APIKEY=your_food_api_key;
  ```
- Get Food API Key from `https://fdc.nal.usda.gov/api-key-signup.html`

- Now the project is ready to use

- Run the app:
  ```node
  node app.js
  ```
