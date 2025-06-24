import { NextResponse } from 'next/server';
import { extractTextFromPdfData, base64ToUint8Array } from '@/lib/pdf-utils';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Received request with content type:', contentType);
    
    let uint8Array: Uint8Array;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        console.log('No file provided in form data');
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      console.log('Processing file:', file.name, 'type:', file.type);
      const arrayBuffer = await file.arrayBuffer();
      uint8Array = new Uint8Array(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      // Handle base64 input
      const body = await request.json();
      const base64 = body.base64;
      
      if (!base64) {
        console.log('No base64 data provided in JSON');
        return NextResponse.json(
          { error: 'No base64 data provided' },
          { status: 400 }
        );
      }

      try {
        uint8Array = base64ToUint8Array(base64);
      } catch (error) {
        console.error('Error decoding base64 data:', error);
        return NextResponse.json(
          { error: 'Invalid base64 data' },
          { status: 400 }
        );
      }
    } else {
      console.log('Unsupported content type:', contentType);
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Validate PDF data
    if (!uint8Array || uint8Array.length === 0) {
      console.log('Invalid PDF data: empty array');
      return NextResponse.json(
        { error: 'Invalid PDF data' },
        { status: 400 }
      );
    }

    console.log('Data size:', uint8Array.length, 'bytes');

    try {
      const fullText = await extractTextFromPdfData(uint8Array);
      
      if (!fullText.trim()) {
        console.log('No text content found in PDF');
        return NextResponse.json(
          { error: 'No text content found in PDF' },
          { status: 400 }
        );
      }

      console.log('Successfully parsed PDF, text length:', fullText.length);
      return NextResponse.json({ text: fullText });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return NextResponse.json(
        { 
          error: 'Failed to parse PDF',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PDF parsing route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Custom page renderer to handle different PDF formats
async function renderPage(pageData: any) {
  try {
    const renderOptions = {
      normalizeWhitespace: true,
      disableCombineTextItems: false
    };
    
    const textContent = await pageData.getTextContent(renderOptions);
    const text = textContent.items.map((item: any) => item.str).join(' ');
    return text;
  } catch (error) {
    console.error('Error rendering page:', error);
    return '';
  }
} 