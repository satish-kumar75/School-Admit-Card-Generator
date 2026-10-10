export function downscaleLogo(dataUrl, maxSide = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        if (scale >= 1 && dataUrl.indexOf("data:image/webp") === 0) {
          resolve(dataUrl);
          return;
        }
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/webp", 0.85));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function isOversizedLogo(dataUrl) {
  return (
    typeof dataUrl === "string" &&
    dataUrl.length > 150000 &&
    dataUrl.indexOf("data:image/") === 0 &&
    dataUrl.indexOf("data:image/svg") !== 0
  );
}
