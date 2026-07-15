import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

// 2x2 Grid Constants for A4 Portrait (210 x 297 mm)
const A4_W = 210;
const A4_H = 297;
const CARD_W = 95;
const CARD_H = 135;
const MARGIN_X = (A4_W - (CARD_W * 2)) / 3;
const MARGIN_Y = (A4_H - (CARD_H * 2)) / 3;

export async function generatePdf(students, globalState, onProgress) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { schoolProfile, examDetails, subjectSetup } = globalState;
  const isAdvanced = subjectSetup.mode === 'advanced';

  // We need a hidden container to render the react components temporarily
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Helper to render component to static HTML string
  const renderCardHtml = (student) => {
    let subjects = [];
    if (isAdvanced) {
      const combo = subjectSetup.combinations.find(c => c.name.toLowerCase() === student.combinationName?.toLowerCase());
      subjects = combo ? combo.subjects : [];
    } else {
      subjects = subjectSetup.subjects;
    }

    // Since we can't easily use ReactDOMServer in client-side Vite without huge bundles,
    // we will inject an iframe or just use a standard DOM element and mutate it.
    // Instead of raw string templating, let's just let the React caller handle the DOM element.
    // Wait, it's easier if we pass the DOM elements from a hidden div managed by StepReviewGenerate.
  };

  // Note: the implementation is better done from the React component side because it can render
  // the cards using standard React rendering in a hidden div, and then pass those refs to generatePdf.
}

export async function captureCardsToPdf(cardElements, onProgress) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const total = cardElements.length;
  let currentCardIndex = 0;

  const cardsPerPage = 4;
  const totalPages = Math.ceil(total / cardsPerPage);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // Draw cut lines (dashed) and scissors
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineDashPattern([2, 2], 0);
    // Vertical line
    pdf.line(A4_W/2, 0, A4_W/2, A4_H);
    // Horizontal line
    pdf.line(0, A4_H/2, A4_W, A4_H/2);
    pdf.setLineDashPattern([], 0); // reset

    // Draw little scissors icon in center
    pdf.setFontSize(14);
    pdf.setTextColor(150, 150, 150);
    pdf.text("✂", A4_W/2, A4_H/2, { align: "center", baseline: "middle" });

    for (let slot = 0; slot < 4; slot++) {
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

      const col = slot % 2;
      const row = Math.floor(slot / 2);

      const x = MARGIN_X + (col * (CARD_W + MARGIN_X));
      const y = MARGIN_Y + (row * (CARD_H + MARGIN_Y));

      pdf.addImage(dataUrl, 'JPEG', x, y, CARD_W, CARD_H, undefined, 'FAST');
      currentCardIndex++;

      // Yield to main thread
      await new Promise(r => requestAnimationFrame(r));
    }
  }

  return pdf;
}
