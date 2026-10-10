import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

// 2-per-page layout: 1 column x 2 rows on A4 Portrait (210 x 297 mm)
// Each card is wide (190mm) x 130mm, centered horizontally.
const A4_W = 210;
const A4_H = 297;
const CARD_W = 190;
const CARD_H = 130;
const MARGIN_X = (A4_W - CARD_W) / 2;
const MARGIN_Y = (A4_H - CARD_H * 2) / 3;

export async function captureCardsToPdf(cardElements, onProgress) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const total = cardElements.length;
  let currentCardIndex = 0;

  const cardsPerPage = 2;
  const totalPages = Math.ceil(total / cardsPerPage);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // Draw single horizontal cut line across the middle gutter
    const cutY = MARGIN_Y + CARD_H + (MARGIN_Y / 2);
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.line(0, cutY, A4_W, cutY);
    pdf.setLineDashPattern([], 0); // reset

    // Draw little scissors icon in center of the cut line
    pdf.setFontSize(14);
    pdf.setTextColor(150, 150, 150);
    pdf.text("✂", A4_W / 2, cutY, { align: "center", baseline: "middle" });

    for (let slot = 0; slot < 2; slot++) {
      if (currentCardIndex >= total) break;

      const element = cardElements[currentCardIndex];
      onProgress(currentCardIndex + 1, total);

      // Capture using html-to-image with JPEG to drastically reduce PDF size
      const dataUrl = await toJpeg(element, {
        quality: 0.92,
        pixelRatio: 2.5,
        skipFonts: false,
        backgroundColor: '#ffffff'
      });

      const row = slot;

      const x = MARGIN_X;
      const y = MARGIN_Y + (row * (CARD_H + MARGIN_Y));

      pdf.addImage(dataUrl, 'JPEG', x, y, CARD_W, CARD_H, undefined, 'FAST');
      currentCardIndex++;

      // Yield to main thread
      await new Promise(r => requestAnimationFrame(r));
    }
  }

  return pdf;
}
