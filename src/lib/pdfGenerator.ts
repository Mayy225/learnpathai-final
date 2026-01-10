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
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkNewPage = (requiredSpace: number = 25) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPosition = 30;
      return true;
    }
    return false;
  };

  // Fonction pour ajouter une ligne horizontale décorative
  const addDecorativeLine = (color: [number, number, number] = [254, 198, 161]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
  };

  // Fonction pour ajouter un titre de section
  const addSectionTitle = (title: string) => {
    checkNewPage(25);
    yPosition += 8;
    
    // Ligne décorative avant le titre
    doc.setFillColor(254, 198, 161);
    doc.rect(margin, yPosition, 4, 8, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 50, 30);
    doc.text(title, margin + 10, yPosition + 6);
    yPosition += 18;
  };

  // Fonction pour ajouter un sous-titre
  const addSubTitle = (title: string) => {
    checkNewPage(15);
    yPosition += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 120, 80);
    doc.text(title, margin, yPosition);
    yPosition += 10;
  };

  // Fonction pour ajouter du texte normal
  const addParagraph = (text: string, indent: number = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    
    for (const line of lines) {
      checkNewPage(7);
      doc.text(line, margin + indent, yPosition);
      yPosition += 6;
    }
    yPosition += 3;
  };

  // Fonction pour ajouter une puce
  const addBulletPoint = (text: string) => {
    checkNewPage(10);
    
    doc.setFillColor(254, 198, 161);
    doc.circle(margin + 3, yPosition - 1.5, 1.5, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const lines = doc.splitTextToSize(text, contentWidth - 12);
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) checkNewPage(6);
      doc.text(lines[i], margin + 10, yPosition);
      yPosition += 6;
    }
    yPosition += 2;
  };

  // === EN-TÊTE PRINCIPAL ===
  // Grand fond coloré avec dégradé simulé
  doc.setFillColor(254, 198, 161);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Bande décorative plus foncée
  doc.setFillColor(250, 180, 140);
  doc.rect(0, 55, pageWidth, 5, 'F');
  
  // Logo/Icône décorative
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, 18, 8, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(254, 198, 161);
  doc.text('LA', pageWidth / 2, 21, { align: 'center' });
  
  // Titre principal
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 50, 30);
  doc.text("PLAN D'APPRENTISSAGE", pageWidth / 2, 38, { align: 'center' });
  
  // Sous-titre avec la matière
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 70, 50);
  doc.text(planData.subject.toUpperCase(), pageWidth / 2, 50, { align: 'center' });
  
  yPosition = 80;

  // === SECTION INFORMATIONS ===
  addSectionTitle('Informations generales');
  
  // Cadre pour les informations
  doc.setFillColor(255, 252, 248);
  doc.setDrawColor(254, 220, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition - 5, contentWidth, 35, 3, 3, 'FD');
  
  const infoStartY = yPosition;
  
  // Niveau scolaire
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 120, 80);
  doc.text('NIVEAU', margin + 10, infoStartY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.text(getSchoolLevelText(planData.schoolLevel), margin + 10, infoStartY + 13);
  
  // Âge
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 120, 80);
  doc.text('AGE', margin + 60, infoStartY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.text(`${planData.age} ans`, margin + 60, infoStartY + 13);
  
  // Moyenne (si disponible)
  if (planData.averageGrade) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 120, 80);
    doc.text('MOYENNE', margin + 100, infoStartY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.text(planData.averageGrade, margin + 100, infoStartY + 13);
  }
  
  yPosition = infoStartY + 40;

  // === SECTION DIFFICULTÉS ===
  if (planData.learningDifficulties && planData.learningDifficulties.trim()) {
    addSectionTitle("Difficultes d'apprentissage");
    addParagraph(cleanText(planData.learningDifficulties));
    yPosition += 5;
  }

  // === SECTION DEMANDES SPÉCIFIQUES ===
  if (planData.specificRequests && planData.specificRequests.trim()) {
    addSectionTitle('Demandes specifiques');
    addParagraph(cleanText(planData.specificRequests));
    yPosition += 5;
  }

  // === SECTION PLAN D'APPRENTISSAGE ===
  checkNewPage(30);
  yPosition += 10;
  
  // Grande ligne de séparation avant le plan
  doc.setFillColor(254, 198, 161);
  doc.rect(margin, yPosition, contentWidth, 2, 'F');
  yPosition += 15;
  
  // Titre du plan
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 50, 30);
  doc.text("Votre Plan Personnalise", pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  addDecorativeLine();
  yPosition += 5;

  if (planData.generatedPlan) {
    const cleanedPlan = cleanText(planData.generatedPlan);
    const sections = cleanedPlan.split('\n\n');
    
    let currentWeekOrModule = '';
    
    for (const section of sections) {
      if (!section.trim()) continue;
      
      const lines = section.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const trimmedLine = line.trim();
        
        // Détecter les titres principaux (Semaine, Module, Partie, etc.)
        if (/^(Semaine|Module|Partie|Chapitre|Phase|Etape|Jour)\s*\d*/i.test(trimmedLine) ||
            /^\d+[\.\)]\s*[A-Z]/.test(trimmedLine)) {
          checkNewPage(25);
          yPosition += 8;
          
          // Cadre coloré pour les titres principaux
          doc.setFillColor(255, 245, 235);
          doc.setDrawColor(254, 198, 161);
          doc.setLineWidth(0.5);
          doc.roundedRect(margin, yPosition - 6, contentWidth, 12, 2, 2, 'FD');
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(80, 50, 30);
          doc.text(trimmedLine, margin + 5, yPosition + 2);
          yPosition += 15;
          currentWeekOrModule = trimmedLine;
          
        // Détecter les sous-titres (terminant par ":")
        } else if (trimmedLine.endsWith(':') && trimmedLine.length < 80) {
          addSubTitle(trimmedLine);
          
        // Détecter les puces
        } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
          const bulletText = trimmedLine.replace(/^[•\-\*]\s*/, '');
          addBulletPoint(bulletText);
          
        // Détecter les listes numérotées
        } else if (/^\d+[\.\)]\s/.test(trimmedLine)) {
          checkNewPage(10);
          
          const match = trimmedLine.match(/^(\d+[\.\)])\s*(.*)$/);
          if (match) {
            doc.setFillColor(254, 198, 161);
            doc.circle(margin + 5, yPosition - 1, 5, 'F');
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(match[1].replace(/[\.\)]/, ''), margin + 5, yPosition + 0.5, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            
            const textLines = doc.splitTextToSize(match[2], contentWidth - 18);
            for (let i = 0; i < textLines.length; i++) {
              if (i > 0) checkNewPage(6);
              doc.text(textLines[i], margin + 14, yPosition);
              yPosition += 6;
            }
            yPosition += 3;
          }
          
        // Texte normal
        } else {
          addParagraph(trimmedLine);
        }
      }
      
      // Espace entre les sections
      yPosition += 5;
    }
  }

  // === PIED DE PAGE ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Ligne de séparation du pied de page
    doc.setDrawColor(254, 220, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    // Numéro de page
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${totalPages}`,
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );
    // Date et signature
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(
      `Genere par LearnAI le ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }

  // Télécharger le PDF
  const fileName = `Plan_${planData.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
