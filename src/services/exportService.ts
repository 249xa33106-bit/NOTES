import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  PageBreak,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';
import { NoteDocument, ContentBlock } from '../types';

export const exportService = {
  // 1. Export as Real DOCX Document (.docx)
  async exportToDocx(doc: NoteDocument): Promise<boolean> {
    try {
      const docChildren: any[] = [];

      // --- COVER PAGE ---
      docChildren.push(
        new Paragraph({
          text: '',
          spacing: { before: convertInchesToTwip(1.5) },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'LUMIXORA NOTES AI',
              bold: true,
              size: 24,
              color: '4F46E5',
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: doc.title,
              bold: true,
              size: 52,
              color: '0F172A',
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Subject: ${doc.subject} | Level: ${doc.educationLevel}`,
              italics: true,
              size: 24,
              color: '64748B',
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Exam Target: ${doc.examFormat} | Depth: ${doc.depth.toUpperCase()}`,
              size: 20,
              color: '64748B',
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 500 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on: ${new Date(doc.createdAt).toLocaleDateString()} | Verified Technical Study Guide`,
              size: 18,
              color: '94A3B8',
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // --- TABLE OF CONTENTS ---
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Table of Contents',
              bold: true,
              size: 36,
              color: '1E1B4B',
              font: 'Calibri',
            }),
          ],
          spacing: { before: 200, after: 250 },
        })
      );

      doc.sections.forEach((sec, idx) => {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${sec.title}`,
                size: 22,
                color: '334155',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });

      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // --- SECTIONS & CONTENT BLOCKS ---
      for (const section of doc.sections) {
        // Section Title
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.title,
                bold: true,
                size: 32,
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );

        for (const block of section.blocks) {
          switch (block.type) {
            case 'paragraph': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: block.content,
                      size: 22,
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { after: 140 },
                })
              );
              break;
            }

            case 'heading': {
              const headingLevel =
                block.level === 2
                  ? HeadingLevel.HEADING_2
                  : block.level === 3
                  ? HeadingLevel.HEADING_3
                  : HeadingLevel.HEADING_4;
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: block.text,
                      bold: true,
                      size: block.level === 2 ? 26 : 22,
                      color: '1E293B',
                      font: 'Calibri',
                    }),
                  ],
                  heading: headingLevel,
                  spacing: { before: 240, after: 120 },
                })
              );
              break;
            }

            case 'list': {
              block.items.forEach((item, itemIdx) => {
                docChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: block.ordered ? `${itemIdx + 1}. ` : '• ',
                        bold: true,
                        size: 22,
                        font: 'Calibri',
                      }),
                      new TextRun({
                        text: item,
                        size: 22,
                        font: 'Calibri',
                      }),
                    ],
                    indent: { left: 400 },
                    spacing: { after: 80 },
                  })
                );
              });
              break;
            }

            case 'table': {
              const tableRows: TableRow[] = [];

              // Header row
              tableRows.push(
                new TableRow({
                  children: block.headers.map(
                    (h) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: h,
                                bold: true,
                                size: 20,
                                color: 'FFFFFF',
                                font: 'Calibri',
                              }),
                            ],
                            alignment: AlignmentType.LEFT,
                          }),
                        ],
                        shading: {
                          type: ShadingType.CLEAR,
                          fill: '2563EB',
                        },
                        margins: { top: 120, bottom: 120, left: 140, right: 140 },
                      })
                  ),
                })
              );

              // Data rows
              block.rows.forEach((row, rIdx) => {
                tableRows.push(
                  new TableRow({
                    children: row.map(
                      (cell) =>
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: cell,
                                  size: 20,
                                  font: 'Calibri',
                                }),
                              ],
                            }),
                          ],
                          shading: {
                            type: ShadingType.CLEAR,
                            fill: rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF',
                          },
                          margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        })
                    ),
                  })
                );
              });

              docChildren.push(
                new Table({
                  rows: tableRows,
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
                new Paragraph({ text: '', spacing: { after: 150 } })
              );
              break;
            }

            case 'callout': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `[${block.variant.toUpperCase()}] ${block.title}`,
                      bold: true,
                      size: 22,
                      color: '4338CA',
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { before: 100, after: 80 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: block.content,
                      italics: true,
                      size: 21,
                      color: '334155',
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { after: 180 },
                  indent: { left: 300 },
                })
              );
              break;
            }

            case 'code': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Code [${block.language}]: ${block.caption || ''}`,
                      bold: true,
                      size: 20,
                      color: '475569',
                      font: 'Courier New',
                    }),
                  ],
                  spacing: { before: 100, after: 60 },
                })
              );

              const lines = block.code.split('\n');
              lines.forEach((line) => {
                docChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line || ' ',
                        size: 19,
                        font: 'Courier New',
                        color: '1E293B',
                      }),
                    ],
                    indent: { left: 400 },
                    spacing: { line: 240, after: 20 },
                  })
                );
              });

              if (block.expectedOutput) {
                docChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Expected Output:',
                        bold: true,
                        size: 19,
                        color: '059669',
                        font: 'Courier New',
                      }),
                    ],
                    indent: { left: 400 },
                    spacing: { before: 80, after: 40 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: block.expectedOutput,
                        size: 18,
                        color: '334155',
                        font: 'Courier New',
                      }),
                    ],
                    indent: { left: 400 },
                    spacing: { after: 160 },
                  })
                );
              }
              break;
            }

            case 'equation': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Formula: ${block.latex}`,
                      bold: true,
                      size: 22,
                      color: '5B21B6',
                      font: 'Cambria Math',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 120 },
                })
              );
              break;
            }

            case 'diagram': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `[Diagram: ${block.caption}]`,
                      bold: true,
                      size: 22,
                      color: '2563EB',
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { before: 120, after: 60 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: block.source,
                      size: 18,
                      font: 'Courier New',
                      color: '475569',
                    }),
                  ],
                  indent: { left: 300 },
                  spacing: { after: 160 },
                })
              );
              break;
            }

            case 'examQuestion': {
              docChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `[Exam Question - ${block.questionType.toUpperCase()} - ${block.marks || 2} Marks]`,
                      bold: true,
                      size: 22,
                      color: 'B45309',
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { before: 120, after: 60 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: block.question,
                      bold: true,
                      size: 21,
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { after: 60 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Model Solution: ${block.answer}`,
                      size: 20,
                      color: '1E293B',
                      font: 'Calibri',
                    }),
                  ],
                  indent: { left: 300 },
                  spacing: { after: 180 },
                })
              );
              break;
            }

            default:
              break;
          }
        }
      }

      const wordDoc = new Document({
        title: doc.title,
        description: `Generated by Lumixora Notes AI - ${doc.subject}`,
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(1),
                  right: convertInchesToTwip(1),
                  bottom: convertInchesToTwip(1),
                  left: convertInchesToTwip(1),
                },
              },
            },
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(wordDoc);
      const safeFilename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
      saveAs(blob, safeFilename);
      return true;
    } catch (err) {
      console.error('Error generating DOCX document:', err);
      return false;
    }
  },

  // 2. Export as Markdown (.md)
  exportToMarkdown(doc: NoteDocument): void {
    let md = `# ${doc.title}\n\n`;
    md += `**Subject:** ${doc.subject}  \n`;
    md += `**Education Level:** ${doc.educationLevel}  \n`;
    md += `**Depth:** ${doc.depth}  \n`;
    md += `**Target Exam Format:** ${doc.examFormat}  \n`;
    md += `**Generated with:** Lumixora Notes AI  \n`;
    md += `**Date:** ${new Date(doc.createdAt).toLocaleDateString()}  \n\n`;
    md += `---\n\n## Table of Contents\n\n`;

    doc.sections.forEach((s) => {
      md += `- [${s.title}](#${s.id})\n`;
    });
    md += `\n---\n\n`;

    doc.sections.forEach((section) => {
      md += `\n## ${section.title}\n\n`;

      section.blocks.forEach((block) => {
        switch (block.type) {
          case 'paragraph':
            md += `${block.content}\n\n`;
            break;
          case 'heading':
            md += `${'#'.repeat(block.level)} ${block.text}\n\n`;
            break;
          case 'list':
            block.items.forEach((item, idx) => {
              md += block.ordered ? `${idx + 1}. ${item}\n` : `- ${item}\n`;
            });
            md += '\n';
            break;
          case 'table':
            md += `| ${block.headers.join(' | ')} |\n`;
            md += `| ${block.headers.map(() => '---').join(' | ')} |\n`;
            block.rows.forEach((row) => {
              md += `| ${row.join(' | ')} |\n`;
            });
            md += '\n';
            break;
          case 'diagram':
            md += `\`\`\`mermaid\n${block.source}\n\`\`\`\n*${block.caption}*\n\n`;
            break;
          case 'equation':
            md += `$$\n${block.latex}\n$$\n*${block.caption || ''}*\n\n`;
            break;
          case 'code':
            md += `\`\`\`${block.language}\n${block.code}\n\`\`\`\n`;
            if (block.expectedOutput) {
              md += `**Expected Output:**\n\`\`\`\n${block.expectedOutput}\n\`\`\`\n\n`;
            }
            break;
          case 'callout':
            md += `> **[${block.variant.toUpperCase()}] ${block.title}**\n>\n> ${block.content.replace(/\n/g, '\n> ')}\n\n`;
            break;
          case 'examQuestion':
            md += `### ${block.question}\n\n`;
            md += `**Type:** ${block.questionType} | **Marks:** ${block.marks || 2}\n\n`;
            if (block.options && block.options.length > 0) {
              block.options.forEach((opt, oIdx) => {
                md += `- ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
              });
              md += `\n**Answer:** ${block.answer}\n\n`;
            } else {
              md += `**Model Solution:**\n${block.answer}\n\n`;
            }
            break;
          default:
            break;
        }
      });
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const safeFilename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    saveAs(blob, safeFilename);
  },

  // 3. Print / PDF Export
  triggerPrintPdf(): void {
    window.print();
  },
};
