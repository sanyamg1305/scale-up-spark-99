import jsPDF from "jspdf";
import type { DiagnosisResult } from "@/components/ResultsScreen";

export async function generateReport(result: DiagnosisResult) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 20;

  const gold = [194, 154, 52] as const;
  const dark = [26, 26, 26] as const;
  const muted = [120, 120, 120] as const;

  const checkPage = (need: number) => {
    if (y + need > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const heading = (text: string) => {
    checkPage(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...gold);
    
    // Draw a decorative marker instead of emoji
    doc.setFillColor(...gold);
    doc.rect(margin, y - 4, 3, 3, "F");
    
    doc.text(text.toUpperCase(), margin + 6, y - 1);
    y += 2;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentW, y);
    y += 8;
  };

  const bodyText = (text: string, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...dark);
    const lines = doc.splitTextToSize(text, contentW - indent);
    checkPage(lines.length * 5 + 2);
    doc.text(lines, margin + indent, y);
    y += lines.length * 5 + 2;
  };

  const bullet = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...dark);
    const lines = doc.splitTextToSize(text, contentW - 8);
    checkPage(lines.length * 5 + 2);
    doc.text("-", margin + 2, y); // Using simple dash instead of bullet symbol
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 3;
  };

  // Header Background
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 50, "F");

  // Logo (Centered)
  try {
    const imgData = await fetch("/logo.png").then((res) => res.arrayBuffer());
    const uint8Array = new Uint8Array(imgData);
    const logoSize = 18;
    doc.addImage(uint8Array, "PNG", (W - logoSize) / 2, 8, logoSize, logoSize);
  } catch (err) {
    console.error("Failed to load logo for PDF", err);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("SKC.WORLD", W / 2, 18, { align: "center" });
  }

  // Header Text (Centered)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...gold);
  doc.text("Success | Scale | Joy Reflection Report", W / 2, 34, { align: "center" });
  
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, W / 2, 40, { align: "center" });
  
  y = 65;

  // Summary
  heading("Summary");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...dark);
  doc.text(result.identity, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(`Current State: ${result.state}`, margin, y);
  y += 6;
  doc.text(`Execution Energy: ${result.entrepreneurship_score}/100`, margin, y);
  y += 6;
  doc.text(`Alignment Energy: ${result.consciousness_score}/100`, margin, y);
  y += 10;

  // What May Be Noticed
  heading("What May Be Noticed");
  result.insights.forEach((i) => bullet(i));
  y += 4;

  // What May Be Unresolved
  heading("What May Be Unresolved");
  result.business_leaks.forEach((leak) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...dark);
    checkPage(12);
    doc.text(`${leak.type}`, margin + 2, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    const lines = doc.splitTextToSize(leak.description, contentW - 8);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 4;
  });
  y += 2;

  // Areas to Examine
  heading("Areas to Examine");
  result.quest_chain.forEach((quest) => {
    checkPage(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text(`Level ${quest.level}: ${quest.name}`, margin + 2, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...dark);
    bodyText(quest.objective, 4);
    bodyText(`Action: ${quest.action}`, 4);
    doc.setTextColor(...muted);
    bodyText(`Outcome: ${quest.reward}`, 4);
    y += 2;
  });

  // Action Checklist
  heading("Action Checklist");
  result.quest_chain.forEach((quest) => {
    const actions = quest.action.split(/[.;]\s*/).filter(Boolean);
    actions.forEach((a) => {
      checkPage(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...dark);
      // Small square for checkbox
      doc.setDrawColor(...muted);
      doc.setLineWidth(0.2);
      doc.rect(margin + 2, y - 3.5, 3.5, 3.5);
      
      const lines = doc.splitTextToSize(a.trim().replace(/^\d+[\.\)]\s*/, ""), contentW - 12);
      doc.text(lines, margin + 9, y);
      y += lines.length * 5 + 3;
    });
  });
  y += 4;

  // What This May Mean
  heading("What This May Mean for You");
  bodyText(result.future_warning);
  y += 4;

  // Path Toward Success | Scale | Joy
  heading("Path Toward Success | Scale | Joy");
  result.path_to_success_scale_joy.forEach((step, i) => {
    checkPage(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text(`${i + 1}.`, margin + 2, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...dark);
    const lines = doc.splitTextToSize(step, contentW - 12);
    doc.text(lines, margin + 10, y);
    y += lines.length * 5 + 3;
  });

  // Footer
  checkPage(20);
  y += 6;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentW, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("SKC.World - Based on the Conscious Entrepreneurship Quadrant framework.", margin, y);
  doc.text("Interested in a Guided Conversation? Book your Leadership Reflection Call.", margin, y + 5);

  doc.save("Success-Scale-Joy-Reflection-Report.pdf");
}
