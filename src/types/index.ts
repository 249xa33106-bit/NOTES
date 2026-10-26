export type EducationLevel = 
  | 'High School (11th-12th)'
  | 'B.Tech / Undergraduate'
  | 'Postgraduate / Master\'s'
  | 'Competitive Exams (GATE/GRE)'
  | 'Professional / Industry';

export type NoteDepth = 'quick' | 'detailed' | 'comprehensive';

export type ExamFormat = 
  | 'Semester Exam Format (2, 5, 10 marks)'
  | '2-Mark Short Conceptual'
  | '5-Mark Analytical & Algorithmic'
  | '10-16 Mark Comprehensive & Derivations'
  | 'MCQ & Quiz Format';

export type ProgrammingLanguage = 
  | 'Python'
  | 'C'
  | 'C++'
  | 'Java'
  | 'JavaScript'
  | 'Rust'
  | 'Go'
  | 'None (Theoretical / Non-Code)';

export interface NoteGenerationRequest {
  subject: string;
  topic: string;
  syllabusOrUnit?: string;
  educationLevel: EducationLevel;
  depth: NoteDepth;
  language: string;
  examFormat: ExamFormat;
  preferredLanguage: ProgrammingLanguage;
  includeDiagrams: boolean;
  includeCode: boolean;
  includePractical: boolean;
  includeExamQuestions: boolean;
  includeRevisionSheet: boolean;
  sourceMaterial?: string;
  sourceFileName?: string;
}

export type BlockType = 
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'table'
  | 'diagram'
  | 'equation'
  | 'code'
  | 'callout'
  | 'examQuestion';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered: boolean;
  items: string[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface DiagramBlock extends BaseBlock {
  type: 'diagram';
  diagramType: 'mermaid' | 'flowchart' | 'tree' | 'architecture';
  source: string;
  caption: string;
  description?: string;
}

export interface EquationBlock extends BaseBlock {
  type: 'equation';
  latex: string;
  isBlock: boolean;
  caption?: string;
  derivationSteps?: { step: string; explanation: string }[];
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  code: string;
  caption?: string;
  expectedOutput?: string;
  verifiedOutput?: string;
  sampleInputs?: string;
  explanation?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: 'note' | 'tip' | 'important' | 'warning' | 'formula';
  title: string;
  content: string;
}

export interface ExamQuestionBlock extends BaseBlock {
  type: 'examQuestion';
  questionType: 'short' | 'long' | 'mcq' | 'viva';
  marks?: number;
  question: string;
  answer: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
}

export type ContentBlock = 
  | ParagraphBlock 
  | HeadingBlock 
  | ListBlock 
  | TableBlock 
  | DiagramBlock 
  | EquationBlock 
  | CodeBlock 
  | CalloutBlock 
  | ExamQuestionBlock;

export interface NoteSection {
  id: string;
  title: string;
  category: 
    | 'intro'
    | 'definitions'
    | 'explanations'
    | 'formulas'
    | 'diagrams'
    | 'algorithms'
    | 'code'
    | 'comparisons'
    | 'exam'
    | 'revision'
    | 'references';
  blocks: ContentBlock[];
}

export interface NoteDocument {
  id: string;
  title: string;
  subject: string;
  topic: string;
  educationLevel: EducationLevel;
  depth: NoteDepth;
  examFormat: ExamFormat;
  preferredLanguage: ProgrammingLanguage;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sections: NoteSection[];
  tableOfContents: { id: string; title: string; level: number }[];
  metadata: {
    generationDurationMs?: number;
    wordCount: number;
    diagramCount: number;
    codeBlockCount: number;
    sourceFileName?: string;
    aiModel?: string;
  };
  versionHistory?: {
    versionId: string;
    timestamp: string;
    label: string;
  }[];
}

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'lumixora-academic';
  apiKey?: string;
  modelName: string;
  temperature: number;
}

export interface CloudStorageConfig {
  provider: 'local' | 'supabase' | 'firebase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  firebaseApiKey?: string;
  firebaseProjectId?: string;
  connected: boolean;
}
