import React, { useEffect, useRef, useState } from 'react';
import logo from "../assets/sr-logo.webp"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
// import { useDispatch } from 'react-redux'
import { login } from '../utils/authSlice'


const Login = () => {
    const navigate = useNavigate();
    //   const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const timer = useRef(null)


    const handleLogin = async () => {
        // e.preventDefault();

        try { // Basic validation
            if (!email || !password) {
                setError('Please fill in all fields.');
                return;
            }
            // Simulate login logic (replace with actual API call)

            const userLogin = await axios.post(BASE_URL + "login", { emailId: email, password: password }, { withCredentials: true })
            // console.log(userLogin)
            dispatch(addUser(userLogin?.data))
            dispatch(login())
            navigate('/')
            setError('')


        } catch (err) {
            console.log(err)
            setError(err.response.data)

            navigate('/login')

        }
    };

    if (timer.current) {
        clearInterval(timer.current)
    }

    timer.current = setTimeout(() => {
        setError('')
    }, 3000)

    useEffect(() => {
        // handleLogin()
        return () => {
            // clearTimeout(toastTimerRef.current)
            clearTimeout(timer.current)

            // clearTimeout(timer)

        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Section */}
                <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div
                        className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-100 opacity-50"
                        style={{ transform: 'rotate(45deg)' }}
                    ></div>
                    <div
                        className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-blue-100 opacity-50"
                        style={{ transform: 'rotate(45deg)' }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 ">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="w-36 mb-8"
                        />

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Please sign in to continue to your account
                        </p>

                        {/* Form */}
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <p className="text-red-500 text-sm mb-4">{error}</p>


                            <button

                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                onClick={handleLogin}  >
                                Sign In
                            </button>
                        </div>


                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8">
                    <div className="relative max-w-md w-full">
                        <svg
                            viewBox="0 0 500 500"
                            className="w-full h-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            {/* Background Circle Animation */}
                            <circle
                                cx="250"
                                cy="250"
                                r="200"
                                className="fill-blue-50 animate-pulse"
                                style={{ animationDuration: '4s' }}
                            />

                            {/* Main User Figure */}
                            <g className="origin-center animate-float" style={{ animationDuration: '3s' }}>
                                {/* Head */}
                                <circle cx="250" cy="180" r="40" className="fill-blue-100" />

                                {/* Body */}
                                <path
                                    d="M250 220 v100 a20,20 0 0,0 0,40 h0 a20,20 0 0,0 0,-40 v-100"
                                    className="fill-blue-200"
                                />

                                {/* Arms */}
                                <path
                                    d="M180 250 l70 -30 l70 30"
                                    className="stroke-blue-300 fill-none stroke-[12px]"
                                    strokeLinecap="round"
                                />

                                {/* Lock */}
                                <g transform="translate(225 300)">
                                    <rect
                                        x="0"
                                        y="0"
                                        width="50"
                                        height="40"
                                        rx="8"
                                        className="fill-blue-400 animate-lock"
                                        style={{ animationDuration: '2s' }}
                                    />
                                    <circle
                                        cx="25"
                                        cy="25"
                                        r="8"
                                        className="fill-blue-600"
                                    />
                                </g>
                            </g>

                            {/* Floating Particles */}
                            <circle cx="100" cy="100" r="6" className="fill-blue-200 animate-float" />
                            <circle cx="400" cy="150" r="5" className="fill-blue-200 animate-float" style={{ animationDelay: '0.5s' }} />
                            <circle cx="350" cy="350" r="4" className="fill-blue-200 animate-float" style={{ animationDelay: '1s' }} />
                        </svg>
                    </div>
                </div>

                {/* Add to your CSS or Tailwind config */}
                <style>
                    {`
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes lock {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .animate-float {
    animation: float infinite ease-in-out;
  }
  .animate-lock {
    animation: lock infinite ease-in-out;
  }
`}
                </style>
            </div>
        </div>
    );
};

export default Login;