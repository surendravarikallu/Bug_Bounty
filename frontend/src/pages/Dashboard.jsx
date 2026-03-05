import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    // New Vuln States
    const [pingTarget, setPingTarget] = useState('127.0.0.1');
    const [pingResult, setPingResult] = useState('');
    const [filePath, setFilePath] = useState('');
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchProfile(parsedUser.id);
            fetchComments();
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            // VULNERABLE: Direct reference to ID without verifying it belongs to the logged in session state. (IDOR)
            const res = await axios.get(`http://localhost:5000/api/profile?id=${id}`);
            if (res.data.success) {
                setProfile(res.data.profile);
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/comments');
            if (res.data.success) {
                setComments(res.data.comments);
            }
        } catch (err) {
            console.error('Failed to fetch comments', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/comments', {
                userId: user.id,
                comment: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Failed to post comment', err);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setUploadStatus('File uploaded successfully at: ' + res.data.file.filepath);
            }
        } catch (err) {
            setUploadStatus('Upload failed');
        }
    };

    const handlePing = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/debug/ping', { ip: pingTarget });
            setPingResult(res.data.output);
        } catch (err) {
            setPingResult('Error: ' + err.message);
        }
    };

    const handleReadFile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/debug/read-file?file=${filePath}`);
            setFileContent(res.data);
        } catch (err) {
            setFileContent('Error reading file. Check path.');
        }
    };

    if (!user) return <div className="p-8 text-center">Please login to view this page.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">User Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Profile Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Profile Information</h2>
                    {profile ? (
                        <div className="space-y-3 text-gray-700">
                            <p><span className="font-semibold">User ID:</span> {profile.id}</p>
                            <p><span className="font-semibold">Username:</span> {profile.username}</p>
                            <p><span className="font-semibold">Email:</span> {profile.email}</p>
                            <p><span className="font-semibold">Role:</span> <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{profile.role}</span></p>
                        </div>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                    <div className="mt-6 text-sm text-gray-500 italic">
                        Hint: Do you think you can view other user profiles? How does the browser get your ID?
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Submit Diagnostic File</h2>
                    <form onSubmit={handleFileUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select file</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload</button>
                        {uploadStatus && <p className="text-sm mt-2 text-green-600 break-all">{uploadStatus}</p>}
                    </form>
                    <div className="mt-6 text-sm text-gray-500 italic">
                        Hint: Are there any restrictions on the type of files you can upload?
                    </div>
                </div>

                {/* Community Comments Section */}
                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Community Support Discussion</h2>

                    <form onSubmit={handleCommentSubmit} className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="Ask a question or share a thought..."
                            required
                        ></textarea>
                        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Comment</button>
                    </form>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.map((c) => (
                            <div key={c.id} className="bg-gray-50 p-4 rounded border">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">{c.author}</span>
                                    <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                                </div>
                                {/* VULNERABLE: dangerous rendering of unescaped HTML enabling XSS */}
                                <div
                                    className="text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: c.comment }}
                                />
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-gray-500 text-center">No comments yet. Be the first!</p>}
                    </div>
                    <div className="mt-6 text-sm text-gray-500 italic">
                        Hint: Does the server clean up scripts embedded in your messages before showing them to other users?
                    </div>
                </div>

                {/* Network Debugging (Command Injection) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Network Debug (Ping)</h2>
                    <form onSubmit={handlePing} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IP Address or Hostname</label>
                            <input
                                type="text"
                                value={pingTarget}
                                onChange={(e) => setPingTarget(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="127.0.0.1"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ping</button>
                        {pingResult && (
                            <pre className="mt-4 p-4 bg-gray-900 text-green-400 text-xs overflow-x-auto rounded">
                                {pingResult}
                            </pre>
                        )}
                    </form>
                    <div className="mt-6 text-sm text-gray-500 italic">
                        Hint: What happens if you add a semi-colon (;) or pipe (|) after the IP address and write another command?
                    </div>
                </div>

                {/* File Explorer (Path Traversal) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">System File Viewer</h2>
                    <form onSubmit={handleReadFile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">File Name</label>
                            <input
                                type="text"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="package.json"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Content</button>
                        {fileContent && (
                            <pre className="mt-4 p-4 bg-gray-100 text-black text-xs overflow-y-auto max-h-40 rounded border">
                                {fileContent}
                            </pre>
                        )}
                    </form>
                    <div className="mt-6 text-sm text-gray-500 italic">
                        Hint: Can you use relative paths (like `../`) to leave the current directory and read things you shouldn't?
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
