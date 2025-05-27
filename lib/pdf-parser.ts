export async function extractTextFromBase64PDF(base64Str: string): Promise<string> {
  try {
    console.log('📥 Decoding base64 PDF...');
    
    // Validate base64 string
    if (!base64Str || typeof base64Str !== 'string') {
      throw new Error('Invalid base64 string provided');
    }

    // Ensure the base64 string is properly formatted
    const base64Data = base64Str.includes('base64,') 
      ? base64Str 
      : `data:application/pdf;base64,${base64Str}`;

    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64: base64Data }),
    });

    // First try to get the response as text
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Then try to parse it as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      console.error('PDF parsing API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      });
      throw new Error(data.error || 'Failed to parse PDF');
    }

    if (!data || !data.text) {
      throw new Error('No text content found in PDF');
    }

    console.log('✅ Text extraction complete');
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to extract text from PDF');
  }
}

// Additional utility function to extract text from a PDF file
export async function extractTextFromPDFFile(file: File): Promise<string> {
  try {
    console.log('📥 Reading PDF file...');
    
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided');
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      throw new Error('File must be a PDF');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    // First try to get the response as text
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Then try to parse it as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      console.error('PDF parsing API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      });
      throw new Error(data.error || 'Failed to parse PDF');
    }

    if (!data || !data.text) {
      throw new Error('No text content found in PDF');
    }

    console.log('✅ Text extraction complete');
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to extract text from PDF');
  }
} 