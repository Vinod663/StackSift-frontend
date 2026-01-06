# StackSift Client (Frontend)

The frontend interface for StackSift. A modern, responsive React application built with a focus on "Glassmorphism" aesthetics and seamless user experience.

## Project Overview

StackSift provides developers with an intelligent interface to discover, organize, and submit software tools. The frontend connects to the StackSift API to provide real-time search, user authentication, and profile management.

**Main Features:**
* **AI-Enhanced Search:** Users can input natural language queries (e.g., "tools for cropping images") which are processed by the backend AI agent.
* **Collections System:** Users can organize tools into custom folders for easy retrieval.
* **Creative Profile Management:**
    * Custom CSS-gradient cover templates.
    * Real-time contribution statistics.
    * Secure "Sudo Mode" for sensitive data editing.
* **Interactive Documentation:** A built-in documentation page to help users navigate the API and features.
* **Support System:** Integrated contact form connecting to the backend Resend service.

## Technologies & Tools

* **Core:** React (Vite), TypeScript
* **Styling:** Tailwind CSS (Custom config for glassmorphism)
* **State Management:** Redux Toolkit
* **Routing:** React Router DOM
* **Authentication:** @react-oauth/google, Axios Interceptors
* **Icons:** React Icons
* **Email Integration:** EmailJS (Client-side fallback) / API Integration

## Prerequisites

* Node.js (v18 or higher)
* npm or yarn

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd StackSift-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory.
    > **Note:** Do not commit this file to version control.

    ```env
    # Google Auth
    VITE_GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console

    # Backend API Connection
    # Leave this blank for local development to use localhost:4000 via fallback
    # For production (Vercel), set this to your Render URL
    VITE_API_BASE_URL=[https://stacksift-api.onrender.com/api/v1](https://stacksift-api.onrender.com/api/v1)
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will typically run at `http://localhost:5173`.

## Application Architecture

* **`/src/pages`**: Contains main view components (Dashboard, Profile, Login, Docs, Support).
* **`/src/components`**: Reusable UI elements (Navbar, ToolCards, Modals).
* **`/src/redux`**: Redux slices for global state (Authentication, UI state).
* **`/src/services`**: Axios instances and API call abstractions.
* **`/src/routes`**: Private and Public route definitions.

## Screenshots

**Dashboard & AI Search**
![Dashboard Screenshot](https://i.imgur.com/Qj80FBN.png)
*The main dashboard featuring the search bar and tool grid.*

**User Profile & Customization**
![Profile Screenshot](https://i.imgur.com/6unHzf3.png)
*User profile showing stats, avatar, and the cover template selection modal.*

**Documentation Page**
![Docs Screenshot](https://i.imgur.com/V2V9dwq.png)
*Built-in API and feature documentation.*

## Deployment

* **Frontend URL:** https://stacksift-frontend.vercel.app
* **Platform:** Vercel

### Important Deployment Notes
1.  **SPA Routing:** A `vercel.json` file is included in the root to handle client-side routing (rewriting all requests to `index.html`). This prevents 404 errors on page refresh.
2.  **Environment Variables:** Ensure `VITE_API_BASE_URL` is set in the Vercel Project Settings to point to the live Render backend.