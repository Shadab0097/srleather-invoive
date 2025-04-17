import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        const res = await axios.get(BASE_URL + 'invoices', { withCredentials: true });
        // Sort invoices by createdAt date (newest first)
        const sortedInvoices = res.data.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoices(sortedInvoices);
    };

    const handlePreview = (invoiceId) => {
        navigate(`/preview/${invoiceId}`);
    };

    return (
        <div className="p-4 max-w-6xl mx-auto min-h-screen">
            <h2 className="text-2xl font-semibold mb-6 text-center">All Invoices</h2>

            {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg animate-pulse"></div>
                        <div className="relative text-6xl">📄</div>
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-xl font-medium text-gray-600 animate-bounce">
                            No Invoices Found
                        </p>
                        <p className="text-gray-500">
                            Start by creating your first invoice!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {invoices.map((inv) => (
                        <div
                            key={inv._id}
                            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                <div>
                                    <p className="text-lg font-medium">{inv.companyName}</p>
                                    <p className="text-sm text-gray-600">Invoice #: {inv.invoiceNumber}</p>
                                    <p className="text-sm text-gray-600">
                                        Date: {new Date(inv.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="mt-2 md:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm transition-colors"
                                    onClick={() => handlePreview(inv._id)}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}