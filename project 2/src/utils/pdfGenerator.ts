import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getPreTaxPrice } from './calculations';

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title and invoice number
  doc.setFontSize(20);
  doc.text('FACTURA', pageWidth / 2, 20, { align: 'center' });
  
  // Add invoice number and date
  doc.setFontSize(10);
  doc.text([
    `Nº: ${data.invoiceNumber}`,
    `Fecha: ${new Date(data.date).toLocaleDateString('es-ES')}`
  ], pageWidth - 20, 20, { align: 'right' });

  // Issuer information
  doc.setFontSize(12);
  doc.text('Datos del Emisor:', 20, 40);
  doc.setFontSize(10);
  doc.text([
    data.issuer.name,
    `NIF/CIF: ${data.issuer.taxId}`,
    data.issuer.address,
    data.issuer.contact
  ], 20, 50);

  // Client information
  doc.setFontSize(12);
  doc.text('Datos del Cliente:', 20, 80);
  doc.setFontSize(10);
  doc.text([
    data.client.name,
    `NIF/CIF: ${data.client.taxId}`,
    data.client.address,
    data.client.contact
  ], 20, 90);

  // Items table
  const tableBody = data.items.map((item: any) => {
    const basePrice = getPreTaxPrice(item.price, data.taxRate);
    return [
      item.description,
      item.quantity,
      `${basePrice.toFixed(2)} €`,
      `${item.price.toFixed(2)} €`
    ];
  });

  (doc as any).autoTable({
    startY: 120,
    head: [['Descripción', 'Cantidad', 'Base', 'Total con IVA']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] }
  });

  // Calculate totals
  const subtotal = data.items.reduce((acc: number, item: any) => {
    const basePrice = getPreTaxPrice(item.price, data.taxRate);
    return acc + (item.quantity * basePrice);
  }, 0);
  const total = data.items.reduce((acc: number, item: any) => acc + (item.quantity * item.price), 0);
  const tax = total - subtotal;

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Base Imponible: ${subtotal.toFixed(2)} €`, pageWidth - 60, finalY);
  doc.text(`IVA (${data.taxRate}%): ${tax.toFixed(2)} €`, pageWidth - 60, finalY + 7);
  doc.setFontSize(12);
  doc.text(`Total con IVA: ${total.toFixed(2)} €`, pageWidth - 60, finalY + 15);

  // Save PDF
  doc.save('factura.pdf');
};