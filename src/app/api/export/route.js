import { authenticateRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Board from '@/models/Board';
import Card from '@/models/Card';
import { jsPDF } from 'jspdf';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { boardId, format } = await request.json();
    
    const board = await Board.findById(boardId);
    const cards = await Card.find({ boardId });
    
    if (format === 'markdown') {
      const markdown = await generateMarkdown(board, cards);
      return NextResponse.json({ content: markdown, format: 'markdown' });
    } else if (format === 'pdf') {
      const pdfContent = await generatePDF(board, cards);
      return NextResponse.json({ content: pdfContent, format: 'pdf' });
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}

async function generateMarkdown(board, cards) {
  let markdown = `# ${board.title}\n\n`;
  markdown += `*Generated on ${new Date().toLocaleDateString()}*\n\n`;
  
  // Add AI Summary if exists
  if (board.aiSummary) {
    markdown += `## AI Summary\n\n`;
    markdown += `### Key Themes\n`;
    board.aiSummary.themes?.forEach(theme => {
      markdown += `- ${theme}\n`;
    });
    
    markdown += `\n### Top Ideas\n`;
    board.aiSummary.topIdeas?.forEach((idea, index) => {
      markdown += `${index + 1}. ${idea}\n`;
    });
    
    markdown += `\n### Next Steps\n`;
    board.aiSummary.nextSteps?.forEach(step => {
      markdown += `- [ ] ${step}\n`;
    });
    markdown += '\n---\n\n';
  }
  
  // Add columns and cards
  for (const column of board.columns) {
    markdown += `## ${column.title}\n\n`;
    
    const columnCards = cards.filter(card => card.columnId === column.id);
    columnCards.forEach(card => {
      markdown += `### ${card.content}\n`;
      
      if (card.mood) {
        markdown += `*Mood: ${card.mood}*\n`;
      }
      
      if (card.suggestions?.length > 0) {
        markdown += `\n**AI Suggestions:**\n`;
        card.suggestions.forEach(suggestion => {
          markdown += `- ${suggestion}\n`;
        });
      }
      markdown += '\n';
    });
  }
  
  return markdown;
}

async function generatePDF(board, cards) {
  const doc = new jsPDF();
  
  doc.setFontSize(24);
  doc.text(board.title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  
  if (board.aiSummary) {
    doc.setFontSize(16);
    doc.text('AI Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    board.aiSummary.themes?.forEach(theme => {
      doc.text(`• ${theme}`, 25, yPosition);
      yPosition += 7;
    });
  }
  
  const pdfOutput = doc.output('datauristring');
  return pdfOutput;
}