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

## Technologies & Tools

* **Core:** React (Vite), TypeScript
* **Styling:** Tailwind CSS (Custom config for glassmorphism)
* **State Management:** Redux Toolkit
* **Routing:** React Router DOM
* **Authentication:** @react-oauth/google, Axios Interceptors
* **Icons:** React Icons

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
    VITE_GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will typically run at `http://localhost:5173`.

## Application Architecture

* **`/src/pages`**: Contains main view components (Dashboard, Profile, Login, Docs).
* **`/src/components`**: Reusable UI elements (Navbar, ToolCards, Modals).
* **`/src/redux`**: Redux slices for global state (Authentication, UI state).
* **`/src/services`**: Axios instances and API call abstractions.
* **`/src/routes`**: Private and Public route definitions.

## Screenshots

**Dashboard & AI Search**
![Dashboard Screenshot](path_to_dashboard_screenshot.png)
*The main dashboard featuring the search bar and tool grid.*

**User Profile & Customization**
![Profile Screenshot](path_to_profile_screenshot.png)
*User profile showing stats, avatar, and the cover template selection modal.*

**Documentation Page**
![Docs Screenshot](path_to_docs_screenshot.png)
*Built-in API and feature documentation.*

## Deployment

* **Frontend URL:** [Insert Deployed Frontend URL Here]