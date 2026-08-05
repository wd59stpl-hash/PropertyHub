import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("PROPERTYHUB - OFFICIAL RECEIPT", 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Transaction Reference: ${data.stripeSessionId || 'N/A'}`, 20, 45);
    doc.text(`Buyer: ${data.buyer?.name || 'Customer'}`, 20, 52);
    doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-IN')}`, 20, 59);

    autoTable(doc, {
        startY: 70,
        head: [['Property Description', 'Category', 'Paid Amount']],
        body: [
            [
                data.property?.name || 'Property Details', 
                data.property?.category?.toUpperCase() || 'SALE', 
                `INR ${data.amount?.toLocaleString('en-IN')}`
            ]
        ],
        theme: 'striped',
        headStyles: { 
            fillColor: [37, 99, 235], 
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: { fontSize: 10, cellPadding: 5 },
    });

    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
        "Note: This is a system-generated digital receipt. No physical signature is required.", 
        105, 
        finalY + 20, 
        { align: 'center' }
    );
    
    const fileName = data.property?.name?.replace(/\s+/g, '_') || 'Receipt';
    doc.save(`Receipt_${fileName}.pdf`);
};