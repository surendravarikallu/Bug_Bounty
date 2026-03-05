import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-400">
                            Bug Bounty Lite
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="hover:text-blue-300">Home</Link>
                        {!user && <Link to="/login" className="hover:text-blue-300">Login</Link>}
                        {!user && <Link to="/register" className="hover:text-blue-300">Register</Link>}

                        {user && (
                            <>
                                <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="hover:text-blue-300">Admin Panel</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
