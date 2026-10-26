import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedDocument {
  fileName: string;
  fileSize: number;
  fileType: string;
  extractedText: string;
  detectedSubject?: string;
  detectedTopics: string[];
  units: {
    unitTitle: string;
    topics: string[];
  }[];
}

export const documentParser = {
  async parseFile(file: File): Promise<ExtractedDocument> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let text = '';

    if (extension === 'pdf') {
      text = await this.extractTextFromPdf(file);
    } else if (extension === 'docx') {
      text = await this.extractTextFromDocx(file);
    } else {
      text = await this.extractTextFromPlainText(file);
    }

    const { detectedSubject, detectedTopics, units } = this.analyzeSyllabus(text, file.name);

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: extension || 'unknown',
      extractedText: text,
      detectedSubject,
      detectedTopics,
      units,
    };
  },

  async extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 30); pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map((item: any) => item.str);
      fullText += `--- Page ${pageNum} ---\n` + pageStrings.join(' ') + '\n\n';
    }

    return fullText;
  },

  async extractTextFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  },

  async extractTextFromPlainText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  analyzeSyllabus(text: string, fileName: string): {
    detectedSubject?: string;
    detectedTopics: string[];
    units: { unitTitle: string; topics: string[] }[];
  } {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const units: { unitTitle: string; topics: string[] }[] = [];
    let currentUnit: { unitTitle: string; topics: string[] } | null = null;
    const detectedTopics: string[] = [];

    // Common syllabus keywords
    const unitRegex = /^(unit|module|chapter|part)\s*([0-9ivx]+)[:\s\-]*(.*)$/i;

    lines.forEach((line) => {
      const match = line.match(unitRegex);
      if (match) {
        if (currentUnit) {
          units.push(currentUnit);
        }
        currentUnit = {
          unitTitle: line,
          topics: [],
        };
      } else if (currentUnit) {
        // Collect subtopics if separated by commas or bullets
        if (line.length > 5 && line.length < 120 && !line.startsWith('---')) {
          const parts = line.split(/[,;•\t]/).map((p) => p.trim()).filter((p) => p.length > 2);
          currentUnit.topics.push(...parts);
          detectedTopics.push(...parts);
        }
      }
    });

    if (currentUnit) {
      units.push(currentUnit);
    }

    // Attempt to deduce subject from filename or text
    let detectedSubject = '';
    const cleanName = fileName.toLowerCase();
    if (cleanName.includes('data structure') || cleanName.includes('dsa')) {
      detectedSubject = 'Data Structures & Algorithms';
    } else if (cleanName.includes('os') || cleanName.includes('operating')) {
      detectedSubject = 'Operating Systems';
    } else if (cleanName.includes('dbms') || cleanName.includes('database')) {
      detectedSubject = 'Database Management Systems';
    } else if (cleanName.includes('cn') || cleanName.includes('network')) {
      detectedSubject = 'Computer Networks';
    } else if (cleanName.includes('math') || cleanName.includes('calculus')) {
      detectedSubject = 'Engineering Mathematics';
    }

    return {
      detectedSubject: detectedSubject || undefined,
      detectedTopics: Array.from(new Set(detectedTopics)).slice(0, 15),
      units,
    };
  },
};
