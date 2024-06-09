# Gmail Email Classification Web Application

## Overview

This web application allows users to log in using Google OAuth, fetch their last X emails from Gmail, and classify them into different categories using the Google GEMINI API. The application provides functionality for user authentication, fetching emails from Gmail, and classifying them into important, promotional, social, marketing, and spam categories.

## Technologies Used

- **Frontend:** Next.js
- **Backend:** Next.js API routes
- **CSS Framework:** Tailwind CSS
- **Authentication:** Google OAuth
- **API Integration:** Gmail API for fetching emails, Google GEMINI API for email classification

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-project.git
   ```

## Configuration

### Google OAuth Configuration:

1. Set up a Google Cloud project and enable the Gmail API and Generative language api and copy the API key.
2. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
3. Obtain the client ID and client secret.
4. Set these values as environment variables in a `.env.local` file:

   ```makefile
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=Your_secret
   ```

### Usage

1. **start the developemnt server**

```bash
    npm run dev

```

2. **Access application in your browser**
   http:localhost:3000
