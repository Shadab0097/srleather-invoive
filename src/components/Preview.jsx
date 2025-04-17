import { useDispatch, useSelector } from 'react-redux';
import '../App.css'
import logo from "../assets/sr-logo.webp"
import stamp from "../assets/stamp.png"
import { toWords } from 'number-to-words';
import { useEffect, useState } from 'react';
import { addInvoice } from '../utils/invoiceSlice';

import { BASE_URL } from '../utils/constant';
import { useParams } from 'react-router-dom';
import axios from 'axios';




function Preview() {

    const dispatch = useDispatch();
    const invoice = useSelector(store => store.invoice);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    // Full synchronization between Redux and localStorage

    const getInvoice = async () => {
        try {
            const response = await axios.get(BASE_URL + 'preview/' + id, { withCredentials: true });
            dispatch(addInvoice(response.data)); // update Redux store
        } catch (error) {
            console.log('Error loading invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getInvoice();
        }
    }, [id, dispatch]); // id is dependency


    // Save to localStorage whenever Redux state changes
    // useEffect(() => {
    //     if (!loading) {
    //         localStorage.setItem('invoice', JSON.stringify(invoice));
    //     }
    // }, [invoice, loading]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const grandTotal = invoice?.items?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
    const amountInWords = toWords(parseInt(grandTotal)) + ' rupees only';
    const formattedDate = new Date(invoice.date)
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '/');


    return (
        <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
            {/* Print Button - Hidden when printing */}
            <div className="max-w-[210mm] mx-auto mb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Save as PDF
                </button>
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full">
                {/* Header */}
                <div className="border-b p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            {/* <h1 className="text-xl font-bold">Manufacturer and Exporter</h1> */}
                            <p className='font-bold'>Invoice - {invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-center ">
                            <img src={logo} className='w-48 h-16' />
                        </div>
                        <div className="text-right">
                            <p className='font-bold'>Date - {formattedDate}</p>
                        </div>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b">
                    <div className="space-y-2">
                        <h2 className="font-bold bg-yellow-100 p-1 flex items-start">Billing From</h2>
                        <div className='justify-items-start'>
                            <p><span className="font-semibold">Company:</span> S R LEATHER</p>
                            <p><span className="font-semibold">GSTIN:</span> 07AKNPR0237P1ZK</p>
                            <p><span className="font-semibold">Address:</span> 138/9 Jk Apartment<br />
                                Kishangarh, Vasant Kunj<br />
                                New Delhi, India - 110070</p>
                            <p><span className="font-semibold">e-mail:</span> Srleather100@gmail.com</p>
                            <p><span className="font-semibold">Phone:</span> +91 – 931-210-4380</p>
                        </div>
                    </div>

                    <div className="space-y-2 ">
                        <h2 className="font-bold bg-yellow-100 p-1 flex items-start">Billing To</h2>
                        <div className='justify-items-start'>
                            <p><span className="font-semibold">Company:</span> {invoice.companyName}</p>
                            <p><span className="font-semibold">GSTIN:</span> {invoice.gstin}</p>
                            <p className='justify-items-start'><span className="font-semibold">Address: </span>
                                {invoice.address.split(' ')
                                    .reduce((acc, word, index) => {
                                        const chunkIndex = Math.floor(index / 4);
                                        if (!acc[chunkIndex]) acc[chunkIndex] = [];
                                        acc[chunkIndex].push(word);
                                        return acc;
                                    }, [])
                                    .map((chunk, index, array) => (
                                        <span key={index}>
                                            {chunk.join(' ')}
                                            {index < array.length - 1 && <br />}
                                        </span>
                                    ))}
                            </p>
                            <p><span className="font-semibold">e-mail:</span> {invoice.email}</p>
                            <p><span className="font-semibold">Phone:</span>  +91 – {invoice.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="p-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Sr. No</th>
                                <th className="border p-2 text-left">HSN Code</th>
                                <th className="border p-2 text-left">Description of Goods</th>
                                <th className="border p-2 text-right">Qty</th>
                                <th className="border p-2 text-right">Unit Price</th>
                                <th className="border p-2 text-right">Amount INR</th>
                                <th className="border p-2 text-right">CGST%</th>
                                <th className="border p-2 text-right">SGST%</th>
                                <th className="border p-2 text-right">IGST 18%</th>
                                <th className="border p-2 text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                invoice?.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{item.hsn || '-'}</td>
                                        <td className="border p-2">{item.desc || '-'}</td>
                                        <td className="border p-2 text-right">{item.qty === '' || item.qty === undefined || item.qty === null ? '-' : item.qty}</td>
                                        <td className="border p-2 text-right">{item.price === '' || item.price === undefined || item.price === null ? '-' : item.price}</td>
                                        <td className="border p-2 text-right">{item.amount === '' || item.amount === undefined || item.amount === null ? '-' : item.amount}</td>
                                        <td className="border p-2 text-right">{item.cgst === '' || item.cgst === undefined || item.cgst === null ? '-' : item.cgst}</td>
                                        <td className="border p-2 text-right">{item.sgst === '' || item.sgst === undefined || item.sgst === null ? '-' : item.sgst}</td>
                                        <td className="border p-2 text-right">{item.igst === '' || item.igst === undefined || item.igst === null ? '-' : item.igst}</td>
                                        <td className="border p-2 text-right">{item.total === '' || item.total === undefined || item.total === null ? '-' : item.total}</td>
                                    </tr>
                                ))}
                            <tr className="font-bold">
                                <td colSpan="8" className="border p-2 text-right">Grand Total</td>
                                <td colSpan="2" className="border p-2 text-right">₹{grandTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mt-2 text-xs font-semibold">Amount in Words: <span className="italic">{amountInWords}</span></p>
                </div>

                {/* Terms and Conditions */}
                <div className="px-6 pb-4 justify-items-start flex justify-between">
                    <div className="text-xs justify-items-start">
                        <h3 className="font-bold mb-1">Terms & Condition</h3>
                        <ol className="list-decimal list-inside space-y-0.5 justify-items-start">
                            <li>Goods once sold will not be taken back.</li>
                            <li>Interest will be charge@24% after due date of payment.</li>
                            <li>All disputes subject to Delhi Jurisdiction only</li>
                        </ol>
                    </div>
                    <div className="text-center">
                        <div className="font-bold mb-2">for S. R. LEATHER</div>
                        <div className="mb-2">
                            <img src={stamp} className='w-36 h-24' />
                        </div>
                        <div className='-mt-20'>Authorized Signature</div>
                    </div>
                </div>

                {/* Bank Details and Signature */}
                <div className="px-6 pb-6 justify-items-start">
                    <div className="text-xs ">
                        {/* <h3 className="font-bold mb-1  justify-items-start">Bank Details</h3> */}
                        <div className="space-y-0.5  justify-items-start">
                            <p><span className="font-semibold text-red-500">Bank Name:</span> PUNJAB NATIONAL BANK</p>
                            <p><span className="font-semibold  text-red-500">Account Name:</span> S R LEATHER</p>
                            <p><span className="font-semibold  text-red-500">Account No:</span> 5210108700000291</p>
                            <p><span className="font-semibold  text-red-500">IFSC Code:</span> PUNB0521010</p>
                            <p><span className="font-semibold  text-red-500">Branch:</span> Tilak Nagar, AB-29, MRV, Delhi</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Preview



