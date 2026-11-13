import { toPng, toJpeg, toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads a DOM element as a high-resolution image (PNG or JPG)
 * Uses native browser SVG foreignObject rendering (supports modern CSS, oklch, web fonts, etc.)
 */
export async function downloadElementAsImage(element, filename = 'Eliotte-MUA-Documento', format = 'png') {
  if (!element) return;
  
  try {
    const options = {
      quality: 0.98,
      pixelRatio: 2.5, // Retina quality
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: false,
    };

    let dataUrl;
    if (format === 'jpg' || format === 'jpeg') {
      dataUrl = await toJpeg(element, options);
    } else {
      dataUrl = await toPng(element, options);
    }

    const link = document.createElement('a');
    link.download = `${filename}.${format === 'jpg' ? 'jpg' : 'png'}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error generating image with html-to-image:', err);
    
    // Fallback using toCanvas
    try {
      const canvas = await toCanvas(element, { pixelRatio: 2.0, backgroundColor: '#ffffff' });
      const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const fallbackUrl = canvas.toDataURL(mime, 0.95);
      const link = document.createElement('a');
      link.download = `${filename}.${format === 'jpg' ? 'jpg' : 'png'}`;
      link.href = fallbackUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (fallbackErr) {
      console.error('Fallback also failed:', fallbackErr);
      throw err;
    }
  }
}

/**
 * Downloads a DOM element as a high-quality PDF
 */
export async function downloadElementAsPdf(element, filename = 'Eliotte-MUA-Documento') {
  if (!element) return;
  
  try {
    const options = {
      quality: 0.98,
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      cacheBust: true,
    };

    const imgData = await toJpeg(element, options);

    // Compute element dimensions
    const widthPx = element.offsetWidth || 1414;
    const heightPx = element.offsetHeight || 2000;
    const ratio = heightPx / widthPx;

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * ratio;

    if (imgHeight <= pdfHeight) {
      const yOffset = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      const scale = pdfHeight / imgHeight;
      const fitW = imgWidth * scale;
      const xOffset = (pdfWidth - fitW) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, 0, fitW, pdfHeight, undefined, 'FAST');
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
}

/**
 * Copies a nice text summary for WhatsApp / SMS
 */
export function generateWhatsAppMessage(doc, docType = 'quote') {
  if (docType === 'masterclass') {
    let msg = `🎓 *PROPUESTA COMERCIAL - MASTER CLASS BY ELIOTTE MUA* 🎓\n`;
    if (doc.clientName) msg += `📍 *Institución/Cliente:* ${doc.clientName}\n\n`;
    
    doc.locations?.forEach((loc) => {
      msg += `✨ *${loc.name}*\n`;
      msg += `• *Costo por participante:* ${loc.currency || doc.currency} $${Number(loc.costPerPerson).toLocaleString()}\n`;
      msg += `• *Mínimo:* ${loc.minParticipants || 5} personas\n`;
      msg += `• *Incluye:*\n`;
      loc.includes?.forEach(inc => {
        msg += `   - ${inc}\n`;
      });
      if (loc.note) msg += `• *Nota:* ${loc.note}\n`;
      msg += `\n`;
    });

    if (doc.customNote) msg += `📌 *Condiciones:* ${doc.customNote}\n\n`;
    msg += `💳 *Datos de Pago:*\n`;
    msg += `Banco Popular Dominicano (BPD) | Cta. Corriente: 814-307880\n`;
    msg += `Cédula: 031-0422823-8 | Eliotte Casimiro\n\n`;
    msg += `📲 WhatsApp: (849) 220-9464 | IG: @eliottemua`;
    return msg;
  }

  const currencySymbol = doc.currency === 'US$' ? 'US$' : 'RD$';
  
  if (docType === 'invoice') {
    let msg = `✨ *FACTURA - ELIOTTE MUA* ✨\n`;
    msg += `📄 *Factura N°:* ${doc.invoiceNumber || 'FAC-001'}\n`;
    msg += `📅 *Fecha:* ${doc.date || doc.invoiceDate || ''}\n`;
    msg += `👤 *Cliente:* ${doc.clientName || 'Cliente'}\n`;
    if (doc.company) msg += `🏢 *Empresa:* ${doc.company}\n`;
    if (doc.rnc) msg += `📝 *RNC/Cédula:* ${doc.rnc}\n`;
    msg += `\n*Detalle de Servicios:*\n`;
    doc.items.forEach(item => {
      msg += `• ${item.description}: ${currencySymbol} ${Number(item.price).toLocaleString()}\n`;
    });
    msg += `\n💰 *Total:* ${currencySymbol} ${Number(doc.total || 0).toLocaleString()}\n\n`;
    msg += `💳 *Datos de Pago:*\n`;
    msg += `Banco Popular Dominicano (BPD)\n`;
    msg += `Cta. Corriente en pesos: 814-307880\n`;
    msg += `Cédula: 031-0422823-8\n`;
    msg += `Eliotte Casimiro\n\n`;
    msg += `¡Muchas gracias por su preferencia! ✨`;
    return msg;
  } else {
    let msg = `💄 *COTIZACIÓN - ELIOTTE MUA* 💄\n`;
    msg += `✨ *${doc.title || 'Cotización'}*\n`;
    msg += `👤 *Cliente:* ${doc.clientName || 'Cliente'}\n`;
    if (doc.eventDate) msg += `📅 *Fecha del evento:* ${doc.eventDate}\n`;
    msg += `\n*Servicios Solicitados:*\n`;
    const total = doc.items?.reduce((s, i) => s + ((Number(i.qty) || 1) * (Number(i.price) || 0)), 0) || 0;
    doc.items?.forEach(item => {
      const opt = item.optional ? ' (Opcional)' : '';
      msg += `• ${item.description}${opt}: ${currencySymbol} ${Number(item.price).toLocaleString()}\n`;
    });
    msg += `\n💵 *Total:* ${currencySymbol} ${Number(total).toLocaleString()}\n\n`;
    msg += `📌 *Condiciones:* ${doc.notes || '50% para reservar la fecha'}\n\n`;
    msg += `💳 *Cuenta BPD:* 814-307880 (Eliotte Casimiro)\n`;
    msg += `📲 WhatsApp: (849) 220-9464 | IG: @ELIOTTEMUA`;
    return msg;
  }
}
