import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

export default function AllInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        const res = await axios.get(BASE_URL + 'invoices', { withCredentials: true });
        setInvoices(res.data);
    };

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setEditModalOpen(true);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...selectedInvoice.items];
        updatedItems[index][field] = value;
        setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
    };

    const deleteItem = (index) => {
        const updatedItems = selectedInvoice.items.filter((_, i) => i !== index);
        setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
    };

    const addItem = () => {
        const newItem = {
            hsn: '', desc: '', qty: 0, price: 0,
            cgst: 0, sgst: 0, igst: 0, amount: 0, total: 0
        };
        setSelectedInvoice({ ...selectedInvoice, items: [...selectedInvoice.items, newItem] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedInvoice({ ...selectedInvoice, [name]: value });
    };

    const handleSave = async () => {
        await axios.put(BASE_URL + `generate-invoice/${selectedInvoice._id}`, selectedInvoice);
        setEditModalOpen(false);
        fetchInvoices();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Company</th>
                            <th className="border p-2">Invoice #</th>
                            <th className="border p-2">Created At</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv._id}>
                                <td className="border p-2">{inv.companyName}</td>
                                <td className="border p-2">{inv.invoiceNumber}</td>
                                <td className="border p-2">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                <td className="border p-2 space-x-2">
                                    <button className="text-blue-600" onClick={() => handleEdit(inv)}>Edit</button>
                                    <button className="text-green-600">Preview</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded max-w-5xl w-full overflow-auto max-h-[90vh]">
                        <h3 className="text-lg font-semibold mb-4">Edit Invoice</h3>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="companyName"
                                value={selectedInvoice.companyName || ''}
                                onChange={handleInputChange}
                                className="border p-2"
                                placeholder="Company Name"
                            />
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={selectedInvoice.invoiceNumber || ''}
                                onChange={handleInputChange}
                                className="border p-2"
                                placeholder="Invoice Number"
                            />
                            <input
                                type="text"
                                name="gstin"
                                value={selectedInvoice.gstin || ''}
                                onChange={handleInputChange}
                                className="border p-2"
                                placeholder="GSTIN"
                            />
                            <input
                                type="text"
                                name="email"
                                value={selectedInvoice.email || ''}
                                onChange={handleInputChange}
                                className="border p-2"
                                placeholder="Email"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={selectedInvoice.phone || ''}
                                onChange={handleInputChange}
                                className="border p-2"
                                placeholder="Phone"
                            />
                            <input
                                type="text"
                                name="address"
                                value={selectedInvoice.address || ''}
                                onChange={handleInputChange}
                                className="border p-2 md:col-span-2"
                                placeholder="Address"
                            />
                        </div>

                        <table className="w-full mb-4 border min-w-[600px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-sm">Sr.No</th>
                                    <th className="border p-2 text-sm">HSN</th>
                                    <th className="border p-2 text-sm">Description</th>
                                    <th className="border p-2 text-sm">Qty</th>
                                    <th className="border p-2 text-sm">Price</th>
                                    <th className="border p-2 text-sm hidden md:table-cell">CGST%</th>
                                    <th className="border p-2 text-sm hidden md:table-cell">SGST%</th>
                                    <th className="border p-2 text-sm">IGST%</th>
                                    <th className="border p-2 text-sm">Amount</th>
                                    <th className="border p-2 text-sm">Total</th>
                                    <th className="border p-2 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center text-sm">{index + 1}</td>
                                        <td className="border p-2">
                                            <input type="text" value={item.hsn} onChange={(e) => handleItemChange(index, 'hsn', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2">
                                            <input type="text" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2">
                                            <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2">
                                            <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2 hidden md:table-cell">
                                            <input type="number" value={item.cgst} onChange={(e) => handleItemChange(index, 'cgst', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2 hidden md:table-cell">
                                            <input type="number" value={item.sgst} onChange={(e) => handleItemChange(index, 'sgst', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2">
                                            <input type="number" value={item.igst} onChange={(e) => handleItemChange(index, 'igst', e.target.value)} className="w-full text-sm" />
                                        </td>
                                        <td className="border p-2 text-right text-sm">{item.amount}</td>
                                        <td className="border p-2 text-right text-sm">{item.total}</td>
                                        <td className="border p-2 text-center">
                                            <button onClick={() => deleteItem(index)} className="text-red-600 text-lg">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mb-4">
                            <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={addItem}>+ Add Item</button>
                            <div className="space-x-2">
                                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditModalOpen(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
