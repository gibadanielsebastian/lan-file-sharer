import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS # Make sure Flask-CORS is installed: pip install Flask-CORS
from werkzeug.utils import secure_filename
import datetime
import socket # To get local IP for more dynamic CORS (optional advanced step)

# --- Configuration ---
UPLOAD_FOLDER = 'uploads' # Directory to store uploaded files
# Allow a wide range of extensions, or customize as needed
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'rar', 'tar', 'gz',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'mp3', 'wav', 'ogg', 'mp4', 'mov', 'avi', 'mkv', 'webm',
    'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts',
    'py', 'java', 'c', 'cpp', 'cs', 'go', 'rb', 'php', 'swift', 'kt',
    'log', 'iso', 'dmg', 'exe', 'apk', 'ttf', 'otf', 'woff', 'woff2'
}
MAX_CONTENT_LENGTH = 1024 * 1024 * 1024  # 1 GB limit for uploads (adjust as needed)

# --- Flask App Initialization ---
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# --- CORS Configuration ---
# Define the origins that are allowed to access the backend.
# This now includes your specific LAN IP for the frontend.
# IMPORTANT: Replace '192.168.0.205' with the actual LAN IP of the machine
# running the Next.js frontend if it can change or if you access from other IPs.
# For broader LAN access (less secure, use with caution on trusted networks):
# you could try to dynamically get the host IP or use a wildcard like "http://192.168.0.*:3000"
# if your CORS library supports it, or simply allow all with "*" for initial testing.

# Get the machine's local IP address to make CORS more dynamic (optional, but robust)
# This attempts to find the primary LAN IP. Might need adjustment based on network setup.
try:
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    # For cases where gethostbyname returns 127.0.0.1, try another method
    if local_ip == '127.0.0.1':
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80)) # Connect to a public IP to find local interface
        local_ip = s.getsockname()[0]
        s.close()
except socket.gaierror:
    local_ip = '127.0.0.1' # Fallback if IP can't be determined
    print(f"Warning: Could not automatically determine local IP for CORS. Falling back to {local_ip}.")
    print("If accessing from LAN, ensure your frontend's LAN IP (e.g., http://your-lan-ip:3000) is allowed in CORS origins.")


# Define allowed origins
# Using f-string to include the dynamically found local_ip and the user-provided one.
# The user's specific IP (192.168.0.205) is kept for robustness in their specific case.
allowed_origins = [
    "http://localhost:3000",
    f"http://{local_ip}:3000",
    "http://192.168.0.205:3000" # Explicitly add the user's reported IP
]
# Remove duplicates if local_ip is the same as the hardcoded one
allowed_origins = list(set(allowed_origins))

print(f"CORS: Allowing origins: {allowed_origins}")

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# --- In-memory storage for file metadata ---
shared_files_metadata = []

# --- Helper Functions ---
def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename):
    """Extracts the file extension."""
    if '.' in filename:
        return filename.rsplit('.', 1)[1].lower()
    return ''

def format_file_size(size_bytes):
    """Converts bytes to a human-readable string (KB, MB, GB)."""
    if size_bytes == 0:
        return "0 B"
    size_name = ("B", "KB", "MB", "GB", "TB")
    i = 0
    # Ensure size_bytes is float for division
    size_bytes = float(size_bytes)
    while size_bytes >= 1024 and i < len(size_name) - 1:
        size_bytes /= 1024.0
        i += 1
    return f"{size_bytes:.2f} {size_name[i]}"

# --- Ensure Upload Folder Exists ---
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print(f"Created upload folder: {UPLOAD_FOLDER}")

# --- API Endpoints ---

@app.route('/api/hello', methods=['GET'])
def hello():
    """A simple test endpoint."""
    return jsonify({"message": "Hello from LANShare Backend!"})

@app.route('/api/files', methods=['GET'])
def list_files():
    """Lists all currently shared files."""
    sorted_files = sorted(shared_files_metadata, key=lambda x: x['uploadedAt'], reverse=True)
    return jsonify(sorted_files)

@app.route('/api/upload', methods=['POST'])
def upload_files():
    """Handles file uploads."""
    if 'files' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    uploaded_file_objects = request.files.getlist('files')
    newly_uploaded_files_metadata = []

    if not uploaded_file_objects or all(f.filename == '' for f in uploaded_file_objects):
        return jsonify({"error": "No selected files"}), 400

    for file_storage_object in uploaded_file_objects:
        if file_storage_object and file_storage_object.filename:
            original_filename = secure_filename(file_storage_object.filename)
            
            # Basic check for allowed extensions, can be made more robust
            # if not allowed_file(original_filename):
            #     print(f"Upload rejected: File type not allowed for {original_filename}")
            #     # It's better to inform client about which file, but for now a general error
            #     # return jsonify({"error": f"File type not allowed for '{original_filename}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
            #     # For now, we'll allow all files as per previous setup, but log a warning if it's not in the list
            #     if get_file_extension(original_filename) not in ALLOWED_EXTENSIONS:
            #        print(f"Warning: File '{original_filename}' has an extension not in the explicit allow list.")


            file_id = str(uuid.uuid4())
            file_extension = get_file_extension(original_filename)
            
            saved_filename = f"{file_id}.{file_extension}" if file_extension else file_id
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)

            try:
                file_storage_object.save(file_path)
                file_size_bytes = os.path.getsize(file_path)

                metadata = {
                    "id": file_id,
                    "name": original_filename,
                    "size": format_file_size(file_size_bytes),
                    "rawSize": file_size_bytes,
                    "type": file_storage_object.mimetype or "application/octet-stream",
                    "uploadedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    "uploader": request.remote_addr,
                    "_internal_filename": saved_filename
                }
                shared_files_metadata.append(metadata)
                newly_uploaded_files_metadata.append(metadata)
                print(f"File uploaded: {original_filename} as {saved_filename}, Size: {metadata['size']}, From: {request.remote_addr}")

            except Exception as e:
                print(f"Error saving file {original_filename}: {e}")
                if os.path.exists(file_path):
                    os.remove(file_path)
                return jsonify({"error": f"Could not save file {original_filename}. Error: {str(e)}"}), 500
        else:
            return jsonify({"error": "Invalid file in upload list"}), 400

    return jsonify({
        "message": f"{len(newly_uploaded_files_metadata)} file(s) uploaded successfully",
        "files": newly_uploaded_files_metadata
    }), 201


@app.route('/api/download/<file_id>', methods=['GET'])
def download_file(file_id):
    """Serves a file for download using its unique ID."""
    file_metadata = next((f for f in shared_files_metadata if f['id'] == file_id), None)

    if not file_metadata:
        return jsonify({"error": "File not found"}), 404

    internal_filename = file_metadata.get('_internal_filename')
    original_filename = file_metadata.get('name')

    if not internal_filename:
        return jsonify({"error": "File metadata incomplete, cannot locate file."}), 500

    try:
        print(f"Download request for ID {file_id} ({original_filename}), serving {internal_filename} from {app.config['UPLOAD_FOLDER']}")
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            internal_filename,
            as_attachment=True,
            download_name=original_filename
        )
    except FileNotFoundError:
        shared_files_metadata[:] = [f for f in shared_files_metadata if f['id'] != file_id]
        return jsonify({"error": "File not found on server, metadata cleaned."}), 404
    except Exception as e:
        print(f"Error serving file {internal_filename}: {e}")
        return jsonify({"error": "Could not serve file"}), 500

# --- Main Execution ---
if __name__ == '__main__':
    print("Starting LANShare backend server...")
    print(f"Serving files from: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"API endpoints available at http://<your-ip-address>:5000/api/...")
    # The host '0.0.0.0' makes the server accessible from any IP address on the machine,
    # including its LAN IP (e.g., 192.168.0.205)
    app.run(host='0.0.0.0', port=5000, debug=True)
