import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleBookingDetails } from '../../redux/reducers/user/userReducer';
import { Link, useLocation } from 'react-router-dom';
import { handleFetchingPackages } from '../../redux/reducers/tourpackage/packageReducer';
import jsPDF from 'jspdf';

function Invoice() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const bookingId = searchParams.get('bookingId');
    const dispatch = useDispatch();
    const customer = useSelector((state) => state?.user?.userDetails);
    const bookings = useSelector((state) => state?.user?.bookings);
    const packages = useSelector((state) => state.package?.packages);

    useEffect(() => {
        // Fetch bookings when component mounts or bookingId changes
        if (bookingId) {
            dispatch(handleBookingDetails(bookingId));
            dispatch(handleFetchingPackages());
        }
    }, [bookingId]);

    

    const packageObj = packages.find((pkg) => pkg.id === bookings?.package);
    const packageName = packageObj ? packageObj?.package_name : "N/A";

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        // Company information
        doc.text("MJWebs", 10, 20);
        doc.text("123 Street Name, City, Country", 10, 30);
        doc.text("info@mjwebs.com", 10, 40);

        // Invoice header
        doc.setFontSize(18);
        doc.text("Invoice", 160, 20);

        // Customer information
        doc.setFontSize(12);
        doc.text("Billed To:", 10, 60);
        doc.text(`${customer?.first_name} ${customer?.last_name}`, 10, 70);
        doc.text(customer?.email, 10, 80);

        // Invoice details
        doc.text(`Invoice Number: INV-${bookingId}`, 10, 110);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 10, 120);

        // Table header
        doc.setFontSize(14);
        doc.text("Item", 10, 150);
        doc.text("Amount", 150, 150);

        // Bold lines
        doc.setLineWidth(0.5);
        doc.line(10, 155, 200, 155);
        doc.line(10, 185, 200, 185);

        // Table rows
        doc.setFontSize(12);
        doc.text(packageName, 10, 160);
        doc.text("$" + bookings.total_cost, 150, 160);

        // Total
        doc.setFontSize(14);
        doc.text("Total", 10, 190);
        doc.text("$" + bookings.total_cost, 150, 190);

        doc.save('invoice.pdf');
    };


    return (
        <div>
            <section className="bg-gray-100 py-20">
                <div className="max-w-2xl mx-auto py-0 md:py-16">
                    <article className="shadow-none md:shadow-md md:rounded-md overflow-hidden">
                        <div className="md:rounded-b-md  bg-white">
                            <div className="p-9 border-b border-gray-200">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-top">
                                        <div className="space-y-4">
                                            <div>
                                                <h1 className='text-3xl font-semibold mb-4'>TravelMate</h1>  
                                                <p className="font-bold text-lg">Invoice</p>
                                                <p>{customer?.first_name} {customer?.last_name}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-400">Billed To</p>
                                                <p>{customer?.email}</p>
                                                <p>{customer?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="font-medium text-sm text-gray-400">Invoice Number</p>
                                                <p>INV-{bookingId}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-400">Invoice Date</p>
                                                <p>{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <button onClick={downloadPDF} className="inline-flex items-center text-sm font-medium text-blue-500 hover:opacity-75">Download PDF</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-9 border-b border-gray-200">
                                <p className="font-medium text-sm text-gray-400">Note</p>
                                <p className="text-sm">Thank you for your order.</p>
                            </div>
                            <table className="w-full divide-y divide-gray-200 text-sm">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-9 py-4 text-left font-semibold text-gray-400">Item</th>
                                        <th scope="col" className="py-3 text-left font-semibold text-gray-400"></th>
                                        <th scope="col" className="py-3 text-left font-semibold text-gray-400">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                                        <div>
                                            <p>{packageName}</p>
                                        <div className='flex'> Travelers:<p className="text-sm text-gray-400 pl-2">{bookings.num_travelers}</p></div>
                                            
                                        </div>
                                        </td>
                                        <td className="whitespace-nowrap text-gray-600 truncate"></td>
                                        <td className="whitespace-nowrap text-gray-600 truncate">{bookings.total_cost}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-9 border-b border-gray-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Subtotal</p>
                                        </div>
                                        <p className="text-gray-500 text-sm">{bookings.total_cost}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Tax</p>
                                        </div>
                                        <p className="text-gray-500 text-sm">$0.00</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total</p>
                                        </div>
                                        <p className="text-gray-500 text-sm">{bookings.total_cost}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-9 border-b border-gray-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-bold text-black text-lg">Total Amount Paid</p>
                                        </div>
                                        <p className="font-bold text-black text-lg">{bookings.total_cost}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-9 border-b border-gray-200">
                                <div className='flex justify-center'>
                                    <Link to="/" className='text-gray-950 underline'>Home</Link>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default Invoice;
