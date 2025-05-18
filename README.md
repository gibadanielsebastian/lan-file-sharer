# LANShare 🚀

**Share files seamlessly across your Local Area Network (LAN).**

LANShare is a simple and fast file-sharing tool designed for quick and easy transfers between devices on the same network. No internet required, just direct peer-to-peer sharing through an intuitive web interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Why LANShare?

-   **Speed:** Significantly faster than internet-based services for local transfers.
-   **Simplicity:** Easy-to-use web interface accessible from any device with a browser.
-   **Privacy:** Files stay within your local network, ensuring privacy and security.
-   **No Account Needed:** Just connect to the LAN and start sharing.
-   **Cross-Platform:** Works on any OS with a modern web browser.

## 🌟 Features

-   **🌐 Web-Based Interface:** Modern and responsive UI built with Next.js and Tailwind CSS.
-   **📤 File Upload:**
    -   Drag-and-drop support.
    -   Traditional file selection.
    -   Support for multiple file uploads.
-   **📥 File Download:** Browse and download shared files with a single click.
-   **🔄 Real-time Updates:** File list automatically refreshes after new uploads (triggered by successful upload).
-   **🐍 Robust Backend:** Powered by Python (Flask) for efficient file handling.
-   **⚙️ Configurable:** Set maximum file upload size (default 1GB).

## 🛠️ Technologies Used

-   **Frontend:**
    -   [Next.js](https://nextjs.org/) (React Framework)
    -   [React](https://reactjs.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Lucide Icons](https://lucide.dev/)
-   **Backend:**
    -   [Python](https://www.python.org/)
    -   [Flask](https://flask.palletsprojects.com/)
    -   [Flask-CORS](https://flask-cors.readthedocs.io/)
-   **Development:**
    -   Node.js & npm
    -   ESLint

## 📂 Project Structure

```plaintext
lan-share-project/
├── backend/                # Python Flask backend
│   ├── uploads/            # (Auto-created) Storage for uploaded files (gitignored)
│   ├── venv/               # (Optional) Python virtual environment (gitignored)
│   ├── app.py              # Main backend application
│   └── requirements.txt    # Python dependencies
├── public/                 # Next.js static assets (e.g., favicons)
├── src/                    # Next.js frontend source (App Router)
│   ├── app/                # Pages, layout, global styles
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/         # Reusable React components
│       ├── FileList.tsx
│       ├── Footer.tsx
│       ├── Navbar.tsx
│       └── UploadForm.tsx
├── .gitignore
├── next.config.ts          # Next.js configuration
├── package.json            # Frontend dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration (for Tailwind)
├── README.md               # This file
└── tsconfig.json           # TypeScript configuration

🚀 Getting StartedPrerequisitesNode.js (v18.x or later recommended)npm (or yarn)Python (v3.8 or later recommended)pip (Python package installer)GitInstallation & SetupClone the Repository:git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME
(Replace YOUR_USERNAME/YOUR_REPOSITORY_NAME with your actual repository URL)Setup Backend (Python Flask):cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv

# On Windows:
# .\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# The 'uploads/' directory will be created automatically by app.py if it doesn't exist.
cd ..
Setup Frontend (Next.js):# (Ensure you are in the project root directory)
npm install
# or
# yarn install
Running the ApplicationYou'll need two separate terminal windows:Terminal 1: Start the Backend Servercd backend
# Activate virtual environment if not already active (e.g., source venv/bin/activate)
python app.py
The backend should start on http://0.0.0.0:5000 (accessible via http://localhost:5000 or your machine's LAN IP on port 5000).Terminal 2: Start the Frontend Development Server# (Ensure you are in the project root directory)
npm run dev
# or
# yarn dev
The frontend should start on http://localhost:3000.
```

## Accessing LANShare

-   **On the host machine: Open your browser and go to http://localhost:3000.**

-   **From other devices on the same LAN:**

    -   Find the LAN IP address of the machine hosting the application (e.g., 192.168.1.105). You can usually find this in your system's network settings.

    -   Open a browser on another device (computer, phone, tablet) connected to the same Wi-Fi or LAN and go to http://<HOST_MACHINE_LAN_IP>:3000 (e.g., http://192.168.1.105:3000).
