import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export const A4_W = 210;
export const A4_H = 297;
export const CARD_W = 190;
export const CARD_H = 130;
export const MARGIN_X = (A4_W - CARD_W) / 2;
export const MARGIN_Y = (A4_H - CARD_H * 2) / 3;
export const CARDS_PER_PAGE = 2;

export const SHEET_W = 190;
export const SHEET_H = 277;
export const SHEET_X = 10;
export const SHEET_Y = 10;

let fontEmbedCSSPromise = null;

export function getFontEmbedCSS() {
  if (!fontEmbedCSSPromise) {
    fontEmbedCSSPromise = (async () => {
      try {
        await document.fonts.ready;
      } catch (e) {
        return null;
      }
      try {
        const cssTexts = [];
        for (const sheet of document.styleSheets) {
          let rules = null;
          try {
            rules = sheet.cssRules;
          } catch (e) {
            continue;
          }
          if (!rules) continue;
          for (const rule of rules) {
            if (rule.type === CSSRule.FONT_FACE_RULE && rule.cssText.indexOf("'Noto Serif'") !== -1) {
              cssTexts.push(rule.cssText);
            }
          }
        }
        if (!cssTexts.length) return null;
        const joined = cssTexts.join('\n');
        const urls = [...new Set([...joined.matchAll(/url\((https:[^)]+?)\)/g)].map((m) => m[1].replace(/['"]/g, '')))];
        const embedded = await Promise.all(
          urls.map(async (url) => {
            try {
              const res = await fetch(url);
              const blob = await res.blob();
              const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              return [url, dataUrl];
            } catch (e) {
              return null;
            }
          })
        );
        let css = joined;
        for (const pair of embedded) {
          if (pair) css = css.split(pair[0]).join(pair[1]);
        }
        return css;
      } catch (e) {
        return null;
      }
    })();
  }
  return fontEmbedCSSPromise;
}

export async function prepareCapture() {
  const fontEmbedCSS = await getFontEmbedCSS();
  const options = {
    quality: 0.82,
    pixelRatio: 1.5,
    backgroundColor: '#ffffff',
    cacheBust: false,
    preferredFontFormat: 'woff2'
  };
  if (fontEmbedCSS) options.fontEmbedCSS = fontEmbedCSS;
  return options;
}

export function createPdf() {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
}

export function startPdfPage(pdf, isFirst) {
  if (!isFirst) pdf.addPage();
  const cutY = MARGIN_Y + CARD_H + (MARGIN_Y / 2);
  pdf.setDrawColor(150, 150, 150);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.line(0, cutY, A4_W, cutY);
  pdf.setLineDashPattern([], 0);
  pdf.setFontSize(14);
  pdf.setTextColor(150, 150, 150);
  pdf.text("✂", A4_W / 2, cutY, { align: "center", baseline: "middle" });
}

export function decodeImages(elements) {
  const imgs = [];
  for (const el of elements) {
    imgs.push(...el.querySelectorAll('img'));
  }
  return Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

export function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 10);
    });
  });
}

export async function captureElement(element, options) {
  return toJpeg(element, { ...options });
}

export function placeCardImage(pdf, dataUrl, slot) {
  const y = MARGIN_Y + (slot * (CARD_H + MARGIN_Y));
  pdf.addImage(dataUrl, 'JPEG', MARGIN_X, y, CARD_W, CARD_H, undefined, 'FAST');
}

export function placeSheetImage(pdf, dataUrl) {
  pdf.addImage(dataUrl, 'JPEG', SHEET_X, SHEET_Y, SHEET_W, SHEET_H, undefined, 'FAST');
}
