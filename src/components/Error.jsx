import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-100 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 transform transition-all duration-300 hover:shadow-xl">
                    {/* Animated document icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-blue-100 rounded-lg animate-pulse"></div>
                            <svg
                                className="relative w-full h-full text-blue-600 animate-bounce"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">
                        The document you're looking for seems to have been misplaced in the digital archive...
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium
                            hover:bg-gray-200 transition-colors duration-200"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                            hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                            Return to Dashboard
                        </button>
                    </div>

                    {/* Company branding */}
                    <div className="mt-8 text-gray-400 text-sm">
                        <p>© {new Date().getFullYear()} S R Leather</p>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(20px, -50px) scale(1.1);
                    }
                    50% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    75% {
                        transform: translate(-10px, -30px) scale(1.05);
                    }
                }
                .animate-blob {
                    animation: blob 10s infinite linear;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default ErrorPage;