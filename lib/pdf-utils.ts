import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

// Initialize PDF.js worker
export function initializePdfWorker() {
  const isVercel = process.env.VERCEL === "1";

  if (typeof window === "undefined") {
    if (isVercel) {
      GlobalWorkerOptions.workerSrc = false as any;
      console.log("✅ PDF.js worker disabled on Vercel");
    } else {
      try {
        const pdfjsWorker = require.resolve(
          "pdfjs-dist/legacy/build/pdf.worker.min.js"
        );
        GlobalWorkerOptions.workerSrc = pdfjsWorker;
        console.log("✅ PDF.js worker loaded locally");
      } catch (error) {
        GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        console.warn("⚠️ Fallback to CDN worker");
      }
    }
  } else {
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

// Extract text from PDF data
export async function extractTextFromPdfData(
  pdfData: Uint8Array
): Promise<string> {
  try {
    const loadingTask = getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("❌ Error extracting text from PDF:", error);
    throw error;
  }
}

// Convert base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const base64Data = base64.replace(/^data:application\/pdf;base64,/, "");
  const binaryString = atob(base64Data);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}