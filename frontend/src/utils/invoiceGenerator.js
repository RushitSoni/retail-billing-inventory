import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const getBase64FromUrl = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove the "data:image/png;base64," prefix
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error fetching logo:", error);
        return null;
    }
};


const generateInvoice = async(shopDetails, billMaker, customerDetails, billItems, grandTotal, installments) => {
    const doc = new jsPDF();
   
    
    //Header
    const logoBase64 = await getBase64FromUrl(shopDetails.logo);
    // console.log(shopDetails)
    // console.log(logoBase64)
    const logoWidth = 20; 
    const logoHeight = 20; 
    
    // Calculate X position to center logo and text
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(shopDetails.name);
    const totalWidth = logoWidth + textWidth ; 
    const centerX = (pageWidth - totalWidth) / 2;
    
    // Add logo
    doc.addImage(logoBase64, "JPEG", centerX, 10, logoWidth, logoHeight);
    
    // Add shop name next to logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`   ${shopDetails.name}`, centerX + logoWidth , 22);
    doc.line(0, 32, 10000, 30);

    // Add Shop Address Below Name
    doc.setFontSize(12);
    //doc.text(shopDetails.address, textX, 60, { align: "center" });

    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 140, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 50);   
    
    doc.text(`Branch    : Dabhoi`, 25, 40);
    doc.text(`Bill Maker: ${billMaker}`, 25, 50);

    // Customer Details in Two Columns
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:",25, 65);
    doc.setFont("helvetica", "normal");
    // Left Column
    doc.text(`Name  : ${customerDetails.name}`, 25, 75);
    doc.text(`Phone : ${customerDetails.phone}`, 25, 85);
    // Right Column (Aligned at x = 110)
    doc.text(`Email  : ${customerDetails.email}`, 140, 75);
    doc.text(`Address: ${customerDetails.address}`, 140, 85);

    // Table for Bill Items
    autoTable(doc, {
        startY: 95,
        head: [
            ["Item Number", "Item Name", "Price (Rs.)", "Quantity", "Total (Rs.)"]
        ],
        body: billItems.map((item, index) => [
            index + 1,
            item.name,
            item.price,
            item.quantity,
            item.price * item.quantity,
        ]),
        theme: "grid",
    });

    // Grand Total
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs. ${grandTotal}`, 20, doc.lastAutoTable.finalY + 10);

    // Page 2: Installments (if applicable)
    if (installments && installments.length > 1) {
        doc.addPage();
        doc.text("Installment Plan :", 20, 20);
        autoTable(doc, {
            startY: 40,
            head: [
                ["Installment No.", "Amount (Rs.)", "Due Date"]
            ],
            body: installments.map((installment) => [
                installment.installmentNo,
                installment.amount,
                installment.dueDate,
            ]),
            theme: "grid",
        });
    }
   
   // doc.save("invoice.pdf");

   // Convert PDF to Blob
   const pdfBlob = doc.output("blob");

   // Prepare FormData to send to the backend
   const formData = new FormData();
   formData.append("file", pdfBlob, "invoice.pdf");
   formData.append("email", "rushitpsoni2002@gmail.com");

   try {
       const response = await fetch("http://localhost:8000/send-invoice-email", {
           method: "POST",
           body: formData,
       });
       const result = await response.json();
       if (result.success) {
           console.log("Invoice sent successfully to email!");
       } else {
           console.log("Failed to send invoice.");
       }
   } catch (error) {
       console.error("Error sending invoice:", error);
   }

};

export default generateInvoice;