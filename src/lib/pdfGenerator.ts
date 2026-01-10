import { jsPDF } from 'jspdf';

interface PlanData {
  subject: string;
  schoolLevel: string;
  age: string;
  averageGrade?: string;
  learningDifficulties?: string;
  specificRequests?: string;
  generatedPlan?: string;
}

// Fonction pour nettoyer les caractères spéciaux et formules mathématiques
const cleanText = (text: string): string => {
  if (!text) return '';
  
  return text
    // Supprimer les balises markdown
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[^`]*```/g, '')
    // Remplacer les formules LaTeX courantes
    .replace(/\$\$([^$]+)\$\$/g, (_, formula) => convertLatexToText(formula))
    .replace(/\$([^$]+)\$/g, (_, formula) => convertLatexToText(formula))
    // Supprimer les caractères d'échappement
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\//g, '/')
    // Nettoyer les listes markdown
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, (match) => match)
    // Supprimer les liens markdown mais garder le texte
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Nettoyer les retours à la ligne excessifs
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Convertir les formules LaTeX simples en texte lisible
const convertLatexToText = (latex: string): string => {
  return latex
    // Fractions
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    // Puissances
    .replace(/\^(\{[^}]+\}|\d+)/g, (_, exp) => {
      const expText = exp.replace(/[{}]/g, '');
      const superscripts: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'n': 'ⁿ', 'x': 'ˣ'
      };
      return expText.split('').map((c: string) => superscripts[c] || `^${c}`).join('');
    })
    // Indices
    .replace(/_(\{[^}]+\}|\d+)/g, (_, sub) => {
      const subText = sub.replace(/[{}]/g, '');
      const subscripts: { [key: string]: string } = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
      };
      return subText.split('').map((c: string) => subscripts[c] || `_${c}`).join('');
    })
    // Racine carrée
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '∛($2)')
    // Symboles grecs
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ').replace(/\\epsilon/g, 'ε').replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ').replace(/\\pi/g, 'π')
    .replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω').replace(/\\phi/g, 'φ')
    .replace(/\\Delta/g, 'Δ').replace(/\\Sigma/g, 'Σ').replace(/\\Omega/g, 'Ω')
    // Opérateurs
    .replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈').replace(/\\infty/g, '∞')
    // Fonctions
    .replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log').replace(/\\ln/g, 'ln').replace(/\\exp/g, 'exp')
    // Nettoyer les accolades restantes
    .replace(/[{}\\]/g, '')
    .trim();
};

// Fonction pour obtenir le niveau scolaire formaté
const getSchoolLevelText = (level: string): string => {
  switch (level) {
    case 'primaire': return 'Primaire';
    case 'college': return 'Collège';
    case 'lycee': return 'Lycée';
    case 'superieur': return 'Études supérieures';
    default: return level;
  }
};

export const generatePDF = (planData: PlanData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Fonction pour ajouter du texte avec retour à la ligne automatique
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;
    
    for (const line of lines) {
      checkNewPage(lineHeight);
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    }
  };

  // Fonction pour dessiner un rectangle de fond
  const drawBackground = (height: number, color: [number, number, number]) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(margin - 5, yPosition - 5, contentWidth + 10, height, 'F');
  };

  // === EN-TÊTE ===
  // Fond coloré pour l'en-tête
  doc.setFillColor(254, 198, 161); // Couleur warm-orange
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Titre principal
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 50, 30);
  doc.text("Plan d'Apprentissage Personnalisé", pageWidth / 2, 25, { align: 'center' });
  
  // Sous-titre avec la matière
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 70, 50);
  doc.text(planData.subject, pageWidth / 2, 38, { align: 'center' });
  
  yPosition = 65;

  // === INFORMATIONS DE BASE ===
  drawBackground(35, [255, 250, 245]);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 120, 80);
  doc.text('Informations de base', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const infoText = [
    `Niveau: ${getSchoolLevelText(planData.schoolLevel)}`,
    `Âge: ${planData.age} ans`,
    planData.averageGrade ? `Moyenne: ${planData.averageGrade}` : null
  ].filter(Boolean).join('   |   ');
  
  doc.text(infoText, margin, yPosition);
  yPosition += 20;

  // === DIFFICULTÉS ===
  if (planData.learningDifficulties) {
    checkNewPage(30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 120, 80);
    doc.text("Difficultés d'apprentissage", margin, yPosition);
    yPosition += 8;
    
    addText(cleanText(planData.learningDifficulties), 10, false, [80, 80, 80]);
    yPosition += 10;
  }

  // === DEMANDES SPÉCIFIQUES ===
  if (planData.specificRequests) {
    checkNewPage(30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 120, 80);
    doc.text('Demandes spécifiques', margin, yPosition);
    yPosition += 8;
    
    addText(cleanText(planData.specificRequests), 10, false, [80, 80, 80]);
    yPosition += 10;
  }

  // === LIGNE DE SÉPARATION ===
  checkNewPage(20);
  doc.setDrawColor(230, 200, 180);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // === PLAN D'APPRENTISSAGE ===
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 120, 80);
  doc.text("Plan d'apprentissage", margin, yPosition);
  yPosition += 12;

  if (planData.generatedPlan) {
    const cleanedPlan = cleanText(planData.generatedPlan);
    const paragraphs = cleanedPlan.split('\n\n');
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;
      
      checkNewPage(15);
      
      const lines = paragraph.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Détecter si c'est un titre (commence par des caractères spéciaux ou est plus court)
        const isTitle = line.length < 60 && (
          line.startsWith('•') || 
          /^\d+[\.\)]\s/.test(line) ||
          line.toUpperCase() === line ||
          line.endsWith(':')
        );
        
        if (isTitle) {
          checkNewPage(12);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(80, 60, 50);
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
        }
        
        const textLines = doc.splitTextToSize(line, contentWidth);
        for (const textLine of textLines) {
          checkNewPage(6);
          doc.text(textLine, margin, yPosition);
          yPosition += 5;
        }
      }
      yPosition += 3;
    }
  }

  // === PIED DE PAGE ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} / ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Généré par LearnAI - ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Télécharger le PDF
  const fileName = `Plan_${planData.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
