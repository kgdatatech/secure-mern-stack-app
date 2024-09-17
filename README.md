# Secure MERN Stack Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to my Secure MERN Stack Project! This repository is designed to provide a reliable, secure, and scalable full-stack application using MongoDB, Express, React, and Node.js.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

## About

This project is a fully-featured web application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It is designed with security best practices in mind, ensuring that user data is handled safely and securely.

## Features

- **User Authentication**: Secure user authentication with JWT, CSRF and OAuth integration.
- **Role-Based Access Control**: Different access levels for users and administrators.
- **Data Encryption**: Sensitive data is encrypted both in transit and at rest.
- **Payment Integration**: Secure integration with Stripe for payment processing.
- **Real-Time Features**: Includes socket-based real-time notifications and updates.
- **Content Management**: Easily manage content through an integrated CMS.
- **Responsive Design**: Mobile-first, responsive design using Tailwind CSS.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher
- **MongoDB**: Ensure you have a running MongoDB instance or Atlas Cluster

### Installation

1. **Fork the Repository**:

   Click the "Fork" button at the top right of this page to create a copy of this repository under your GitHub account.

2. **Clone the Repository**:

   Use the following command to clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-forked-repo.git
   ```

3. **Navigate to the Project Directory**:

   ```bash
   cd your-forked-repo
   ```

4. **Install Dependencies**:

   You need to install dependencies for both the frontend and backend. Navigate to each directory and run `npm install`.

   - **Frontend**:

     ```bash
     cd client
     npm install
     ```

   - **Backend**:

     ```bash
     cd ../server
     npm install
     ```

### Environment Variables

You need to set up `.env` files for both the frontend and backend to properly configure the project. Follow these steps:

1. **Frontend Environment Variables**:

   Create a `.env` file in the `client` directory and include the following variables:

   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api         # API base URL
   VITE_APP_SOCKET_URL=wss://localhost:5000            # WebSocket URL is fine if not exposing secrets
   VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key       # Public Stripe key is okay to expose
   VITE_GOOGLE_CLIENT_ID=your-google-client-id         # Google Client ID (public-facing part)
   VITE_APP_RECAPTCHA_SITE_KEY=your-google-recaptcha-site-key  # Public-facing key
   VITE_APP_ENABLE_CAPTCHA=true                        # Feature flag, not sensitive
  
   ```

   Ensure all environment variables start with `VITE_` as this is required by Vite for client-side environment variables.

2. **Backend Environment Variables**:

   Create a `.env` file in the `server` directory and include the following variables:

   ```bash
   # Environment and server settings
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=https://localhost:5173

   # Database
   MONGO_URI=mongodb+srv://<your-mongo-credentials>

   # Authentication secrets
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRATION=15m
   REFRESH_TOKEN_EXPIRATION=7d

   # Email settings
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   EMAIL=yourbusinessemail@gmail.com
   EMAIL_PASSWORD=your-secure-password

   # OAuth (Google)
   GOOGLE_CLIENT_ID=yourID.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-yourID

   # Security and session management
   CSRF_SECRET=your_csrf_secret
   ADMIN_SECRET_KEY=your_admin_secret_key
   SESSION_SECRET=your-session-secret

   # reCAPTCHA (secret key)
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

   # Stripe (Stripe secret keys)
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET_PROD=whsec_your-stripe-webhook
   STRIPE_WEBHOOK_SECRET_DEV=whsec_your-stripe-webhook

   ```

   Adjust these variables as per your setup. Make sure to keep your `.env` files secure and avoid committing them to version control.

## Running the Project

Once you've installed the dependencies and set up your environment variables, you can run the project:

1. **Backend**:

   Navigate to the `server` directory and start the backend server:

   ```bash
   cd server
   npm run dev
   ```

   This will start the backend server on `http://localhost:5000`.

2. **Frontend**:

   Navigate to the `client` directory and start the frontend development server:

   ```bash
   cd client
   npm run dev
   ```

   This will start the frontend server on `http://localhost:5173`.

   Your application should now be up and running! You can access the frontend at `http://localhost:5173` and interact with the backend API at `http://localhost:5000/api`.

## Project Structure

Here's a brief overview of the project structure:

```
your-repo/
├── client/           # Frontend React application
│   ├── public/       # Public assets
│   ├── src/          # Source files
│   │   ├── assets/         # Source assets
│   │   ├── components/     # Source components
│   │   ├── contexts/       # Source contexts
│   │   ├── hooks/          # Source hooks
│   │   ├── pages/          # Source pages
│   │   ├── services/       # Source services
│   │   ├── styles/         # Source styles
│   │   └── utils/          # Source utils
│   ├── App.jsx       # Frontend App
│   ├── main.jsx      # Frontend index.js
│   ├── .env          # Frontend environment variables
│   └── package.json  # Frontend dependencies and scripts
├── server/           # Backend Express application
│   ├── config/       # API db configuration
│   ├── controllers/  # API controllers
│   ├── middlewares/  # API middlewares
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── seeds/        # API CMS seeds (on-going)
│   ├── utils/        # API utilities (includes csrf protection)
│   ├── .env          # Backend environment variables
│   └── package.json  # Backend dependencies and scripts
│   ├── server.js     # API server
└── README.md         # Project documentation
```

## Contributing

We welcome contributions! If you have suggestions for improvements, feel free to fork the repository, make your changes, and submit a pull request.

### Steps to Contribute:

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b feature/your-feature-name`.
3. **Make your changes and commit them**: `git commit -m 'Add some feature'`.
4. **Push to the branch**: `git push origin feature/your-feature-name`.
5. **Submit a pull request**.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

Here are some additional links related to this project:

- [Portfolio Site](https://kgdatatech.github.io/portfolio/): Check out the developer's portfolio for more projects.
- [LinkedIn Profile](https://www.LinkedIn.com/in/keanugms): Connect with the developer on LinkedIn.
- [Deployed Server](Coming soon): View the deployed server for this project.
- [Vite Documentation](https://vitejs.dev/guide/): Learn more about Vite, the build tool used in this project.
