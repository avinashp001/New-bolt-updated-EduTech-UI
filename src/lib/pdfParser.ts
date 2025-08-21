import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url'; // ✅ Vite/Webpack asset import

// Tell pdf.js to use the locally bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


export class PDFParser {
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('File is not a valid PDF');
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('PDF file is too large (max 10MB)');
      }
      
      const arrayBuffer = await file.arrayBuffer();
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty');
      }
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      if (pdf.numPages === 0) {
        throw new Error('PDF has no pages');
      }
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine text items from the page
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .filter(str => str.trim().length > 0)
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n';
          }
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          // Continue with other pages
        }
      }
      
      if (!fullText.trim()) {
        throw new Error('No readable text found in PDF. The PDF may contain only images or be password-protected.');
      }
      
      // Clean up the extracted text
      let text = fullText;
      
      // Remove excessive whitespace and normalize line breaks
      text = text.replace(/\s+/g, ' ').trim();
      text = text.replace(/\n\s*\n/g, '\n\n');
      
      // Remove page numbers and headers/footers (common patterns)
      text = text.replace(/Page \d+/gi, '');
      text = text.replace(/^\d+\s*$/gm, '');
      
      if (text.length < 10) {
        throw new Error('Extracted text is too short. PDF may not contain readable content.');
      }
      
      return text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to extract text from PDF. Please ensure the file is a valid, readable PDF without password protection.');
    }
  }

  static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return await this.extractTextFromPDF(file);
    } else if (fileType.startsWith('text/') || 
               fileType === 'application/msword' || 
               fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For text files and Word documents, read as text
      try {
        const content = await file.text();
        if (!content.trim()) {
          throw new Error('File appears to be empty');
        }
        return content;
      } catch (error) {
        throw new Error('Failed to read text content from file');
      }
    } else {
      throw new Error('Unsupported file type. Please upload PDF, TXT, DOC, or DOCX files.');
    }
  }

  static validateFileContent(content: string): boolean {
    // Check if content is meaningful (not just whitespace or garbled text)
    const cleanContent = content.trim();
    
    if (cleanContent.length < 20) {
      return false;
    }
    
    // Check for reasonable text patterns (letters, numbers, common punctuation)
    const textPattern = /[a-zA-Z0-9\s.,!?;:()\-'"]/g;
    const matches = cleanContent.match(textPattern);
    const textRatio = matches ? matches.length / cleanContent.length : 0;
    
    return textRatio > 0.6; // At least 60% should be readable text
  }
}