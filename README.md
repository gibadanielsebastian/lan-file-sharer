# LANShare 🚀

LANShare is a simple and fast file-sharing tool designed for Local Area Networks (LANs). It allows users on the same network to easily upload files through a web interface and download files shared by others. This direct peer-to-peer sharing within the LAN can be significantly faster than internet-based file-sharing services.

## Features

-   **Web-Based Interface:** Accessible from any device with a web browser on the LAN.
-   **File Upload:** Drag-and-drop or file selection for uploading.
-   **File Download:** Easy browsing and downloading of shared files.
-   **Real-time Updates:** File list updates automatically after uploads.
-   **Frontend:** Built with Next.js and Tailwind CSS for a modern and responsive UI.
-   **Backend:** Powered by Python (Flask) for handling file operations.

## Project Structure

```text
.
├── backend/                # Python Flask backend
│   ├── uploads/            # (Auto-created) Storage for uploaded files (gitignored)
│   ├── venv/               # (Optional) Python virtual environment (gitignored)
│   ├── app.py              # Main backend application
│   └── requirements.txt    # Python dependencies
├── node_modules/           # Node.js dependencies (gitignored)
├── public/                 # Next.js static assets
├── src/                    # Next.js frontend source
│   ├── app/                # Next.js App Router (pages, layout)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/         # React components
│       ├── FileList.tsx
│       ├── Footer.tsx
│       ├── Navbar.tsx
│       └── UploadForm.tsx
├── .gitignore
├── next.config.js          # (or .mjs, .ts) Next.js configuration
├── package.json
├── package-lock.json       # (or yarn.lock)
├── postcss.config.js       # (or .mjs) PostCSS configuration
├── README.md               # This file
└── tsconfig.json           # TypeScript configuration for Next.js
PrerequisitesNode.js (v18.x or later recommended for Next.js)npm or yarnPython (v3.8 or later recommended)pip (Python package installer)GitGetting Started1. Clone the Repository:git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME
2. Setup Backend (Python Flask):cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
# On Windows:
# venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# (The 'uploads/' directory will be created automatically by app.py if it doesn't exist)
3. Setup Frontend (Next.js):Navigate back to the project root from the backend directory:cd ..

# Install Node.js dependencies
npm install
# or
# yarn install
4. Running the Application:You'll need two separate terminal windows:Terminal 1: Start the Backend Servercd backend
# Activate virtual environment if not already active (e.g., source venv/bin/activate)
python app.py
The backend should start on http://0.0.0.0:5000 (or http://localhost:5000).Terminal 2: Start the Frontend Development Server# (Ensure you are in the project root directory)
npm run dev
# or
# yarn dev
The frontend should start on http://localhost:3000.5. Accessing LANShare:On the host machine: Open your browser and go to http://localhost:3000.From other devices on the same LAN:Find the LAN IP address of the machine hosting the application (e.g., 192.168.1.105).Open a browser on another device and go to http://<HOST_MACHINE_LAN_IP>:3000 (e.g., http://192.168.1.105:3000).Note: Ensure your firewall on the host machine allows incoming connections on ports 3000 (for Next.js) and 5000 (for Flask) from your local network.ConfigurationUpload Limit: The maximum file upload size is configured in backend/app.py (variable MAX_CONTENT_LENGTH). Default is 1GB.Allowed Origins (CORS): The backend (backend/app.py) is configured to allow requests from the Next.js frontend. It attempts to dynamically determine the host's LAN IP. If you encounter access issues from LAN devices, you might need to adjust the allowed_origins list in backend/app.py.File StorageUploaded files are stored in the backend/uploads/ directory on the machine running the backend server. This directory is gitignored and will not be part of the repository.ContributingContributions are welcome! Please feel free to submit a Pull Request or open an Issue.*(Optional: Add a License section if you choose one,
```
