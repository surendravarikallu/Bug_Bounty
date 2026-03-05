const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Welcome to</span>
                    <span className="block text-blue-600">Secure System Analysis</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    A controlled lab environment designed for the GALA 2K26 cybersecurity event at KITS Akshar Institute of Technology.
                    Analyze the systems and uncover hidden vulnerabilities.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <div className="rounded-md shadow">
                        <a href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                            Get Started
                        </a>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <a href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                            Login
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Services</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="pt-6">
                        <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Vulnerability Analysis</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Discover various security flaws ranging from Injection vulnerabilities to Broken Authentication.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Coding Practices</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Observe and document exactly where code level mistakes are made to understand secure design patterns.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Bug Bounty Rewards</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Document and report your findings during the event to gain recognition as a top ethical hacker.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
