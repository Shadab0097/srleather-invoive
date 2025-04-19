import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/sr-logo.webp"
import siteLogo from "../assets/site-logo.png"
import { removeUser } from '../utils/userSlice';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/authSlice'




export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleDropdown = () => setProfileDropdown(!profileDropdown);

    const handleAdminLogOut = async () => {
        try {
            await axios.post(BASE_URL + "logout", {}, { withCredentials: true })
            dispatch(removeUser())
            dispatch(logout())

            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 mb-14 print:hidden" >
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600"> <img src={logo} className='w-24 h-8 sm:w-48 sm:h-16' /> </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link> */}
                    <Link to="/invoices" className="text-gray-700 hover:text-blue-600">Invoices</Link>
                    <Link to="/" className="text-gray-700 hover:text-blue-600">Create Invoice</Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <img
                            src={siteLogo}
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        {profileDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                                <button
                                    onClick={handleAdminLogOut}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 text-2xl">
                        {menuOpen ? '✖' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    {/* <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">Dashboard</Link> */}
                    <Link to="/invoices" className="block text-gray-700 hover:text-blue-600">Invoices</Link>
                    <Link to="/" className="block text-gray-700 hover:text-blue-600">Create Invoice</Link>
                    {/* <Link to="/profile" className="block text-gray-700 hover:text-blue-600">Profile</Link> */}
                    {/* <Link to="/settings" className="block text-gray-700 hover:text-blue-600">Settings</Link> */}
                    <button
                        onClick={handleAdminLogOut}
                        className="block w-full text-left text-red-500 hover:text-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
