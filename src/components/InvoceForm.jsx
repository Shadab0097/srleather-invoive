import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
// import Invoice from '../components/Invoice';
import { useDispatch } from 'react-redux';
import { addInvoice } from '../utils/invoiceSlice';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { MdOutlineDelete } from "react-icons/md";
import { toast } from 'react-toastify';

function InvoiceForm() {
    const [items, setItems] = useState([{ hsn: '', desc: '', qty: '', price: '', cgst: 0, sgst: 0, igst: 18 }]);
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',
        date: '',
        billingTo: '',
        companyName: '',
        gstin: '',
        address: '',
        email: '',
        phone: '',
    });
    const [allInvoices, setAllInvoices] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    // const [latestInvoice, setLatestInvoice] = useState(null);
    const dispatch = useDispatch()
    const [showPreview, setShowPreview] = useState(false)



    useEffect(() => {
        axios.get(BASE_URL + 'invoices', { withCredentials: true })
            .then(res => {
                // console.log(res.data)
                setAllInvoices(res.data)
            })
            .catch(err => console.error("Error fetching invoices:", err));
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        const qty = parseFloat(newItems[index].qty) || 0;
        const price = parseFloat(newItems[index].price) || 0;
        const amount = qty * price;

        const cgstPercent = parseFloat(newItems[index].cgst) || 0;
        const sgstPercent = parseFloat(newItems[index].sgst) || 0;
        const igstPercent = parseFloat(newItems[index].igst) || 0;

        newItems[index].amount = amount.toFixed(2);
        newItems[index].cgstAmount = ((cgstPercent / 100) * amount).toFixed(2);
        newItems[index].sgstAmount = ((sgstPercent / 100) * amount).toFixed(2);
        newItems[index].igstAmount = ((igstPercent / 100) * amount).toFixed(2);
        newItems[index].total = (
            amount +
            parseFloat(newItems[index].cgstAmount) +
            parseFloat(newItems[index].sgstAmount) +
            parseFloat(newItems[index].igstAmount)
        ).toFixed(2);

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { hsn: '', desc: '', qty: '', price: '', cgst: 0, sgst: 0, igst: 18 }]);
    };

    const handleInvoiceChange = (field, value) => {
        setInvoiceData({ ...invoiceData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoice = { ...invoiceData, items };
        try {
            const res = await axios.post(BASE_URL + 'generate-invoice', invoice, { withCredentials: true });
            // console.log(res.data.invoice)
            // setLatestInvoice(res.data.invoice)
            dispatch(addInvoice(res.data.invoice))
            localStorage.setItem('invoice', JSON.stringify(res.data.invoice));
            if (res.status === 201) {
                setShowPreview(true)
                toast.success("🎉 Invoice saved successfully!");

            }


            // alert("Invoice saved!");
        } catch (err) {
            console.error("Failed to save invoice:", err);
            // alert("Error saving invoice.");
            setShowPreview(false)
            toast.error("Failed to save invoice. Try again.");

        }
    };

    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const uniqueCompanies = Array.from(
        allInvoices.reduce((map, invoice) => {
            const existing = map.get(invoice.companyName);
            if (!existing || new Date(invoice.createdAt) > new Date(existing.createdAt)) {
                map.set(invoice.companyName, invoice);
            }
            return map;
        }, new Map()).values()
    ).map(inv => inv.companyName);

    const handleCompanySelect = (company) => {
        // Find the latest invoice for the selected company
        const latestInvoice = allInvoices
            .filter(inv => inv.companyName === company)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (latestInvoice) {
            setInvoiceData({
                invoiceNumber: latestInvoice.invoiceNumber,
                date: latestInvoice.date?.substring(0, 10),
                billingTo: latestInvoice.billingTo,
                companyName: latestInvoice.companyName,
                gstin: latestInvoice.gstin,
                address: latestInvoice.address,
                email: latestInvoice.email,
                phone: latestInvoice.phone,
            });
            setItems(latestInvoice.items);
            setSelectedCompany(company);
        }
    };

    return (
        <>
            <form className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-md" onSubmit={handleSubmit}>
                {/* Company Selection */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
                    <label className="font-semibold text-sm md:text-base">Select Company:</label>
                    <select
                        value={selectedCompany}
                        onChange={(e) => handleCompanySelect(e.target.value)}
                        className="border p-2 text-sm md:text-base"
                    >
                        <option value="">-- Choose Company --</option>
                        {uniqueCompanies.map((company, idx) => (
                            <option key={idx} value={company}>{company}</option>
                        ))}
                    </select>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mb-4">Create Invoice</h2>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {Object.keys(invoiceData).map((field, idx) => (
                        <input
                            key={idx}
                            type={field === 'date' ? 'date' : field === 'email' ? 'email' : 'text'}
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            value={invoiceData[field]}
                            className={`border p-2 text-sm md:text-base ${field === 'address' ? 'md:col-span-2' : ''}`}
                            onChange={(e) => handleInvoiceChange(field, e.target.value)}
                        />
                    ))}
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto pb-2">
                    <table className="w-full mb-4 border min-w-[600px]">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-1 md:p-2 text-sm">Sr.No</th>
                                <th className="border p-1 md:p-2 text-sm">HSN</th>
                                <th className="border p-1 md:p-2 text-sm">Description</th>
                                <th className="border p-1 md:p-2 text-sm">Qty</th>
                                <th className="border p-1 md:p-2 text-sm">Price</th>
                                <th className="border p-1 md:p-2 text-sm  md:table-cell">CGST%</th>
                                <th className="border p-1 md:p-2 text-sm  md:table-cell">SGST%</th>
                                <th className="border p-1 md:p-2 text-sm">IGST%</th>
                                <th className="border p-1 md:p-2 text-sm">Amount</th>
                                <th className="border p-1 md:p-2 text-sm">Total</th>
                                <th className="border p-1 md:p-2 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-1 md:p-2 text-center text-sm">{index + 1}</td>
                                    <td className="border p-1 md:p-2">
                                        <input type="text" value={item.hsn} onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2">
                                        <input type="text" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2">
                                        <input min="0" type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2">
                                        <input min="0" type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2  md:table-cell">
                                        <input min="0" type="number" value={item.cgst} onChange={(e) => handleItemChange(index, 'cgst', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2  md:table-cell">
                                        <input min="0" type="number" value={item.sgst} onChange={(e) => handleItemChange(index, 'sgst', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2">
                                        <input min="0" type="number" value={item.igst} onChange={(e) => handleItemChange(index, 'igst', e.target.value)}
                                            className="w-full text-sm md:text-base" />
                                    </td>
                                    <td className="border p-1 md:p-2 text-right text-sm">{item.amount}</td>
                                    <td className="border p-1 md:p-2 text-right text-sm">{item.total}</td>
                                    <td className="border p-1 md:p-2 text-center">
                                        <button type="button" onClick={() => deleteItem(index)}
                                            className="text-red-600 text-lg md:text-xl" title="Delete Item">
                                            <MdOutlineDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                    <button type="button" onClick={addItem}
                        className="bg-green-600 text-white px-4 py-2 text-sm md:text-base rounded w-full md:w-auto">
                        Add Item
                    </button>
                    <button type="submit"
                        className="bg-blue-600 text-white px-4 py-2 text-sm md:text-base rounded w-full md:w-auto">
                        Save Invoice
                    </button>
                </div>
            </form>
            {showPreview && <Link to="/invoice" ><button
                className="bg-blue-600 text-white px-4 py-2 text-sm md:text-base rounded w-full md:w-auto mt-12">
                Preview Invoice
            </button></Link>}
            <div className='mt-14'></div>

            {/* {latestInvoice && <Invoice invoice={latestInvoice} />} */}
        </>
    );
}

export default InvoiceForm;
