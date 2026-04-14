import jsPDF from "jspdf";
import type { DiagnosisResult } from "@/components/ResultsScreen";

export function generateReport(result: DiagnosisResult) {
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

  const heading = (text: string, emoji: string) => {
    checkPage(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...gold);
    doc.text(`${emoji}  ${text.toUpperCase()}`, margin, y);
    y += 3;
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
    doc.text("•", margin + 2, y);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 3;
  };

  // Header
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 45, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("SKC.World", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text("Your Success | State | Joy (SSJ) Reflection Report", margin, 28);
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 36);
  y = 55;

  // Summary
  heading("Summary", "📊");
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
  heading("What May Be Noticed", "🧠");
  result.insights.forEach((i) => bullet(i));
  y += 4;

  // What May Be Unresolved
  heading("What May Be Unresolved", "⚠️");
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
  heading("Areas to Examine", "🎯");
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
  heading("Checklist", "✅");
  result.quest_chain.forEach((quest) => {
    const actions = quest.action.split(/[.;]\s*/).filter(Boolean);
    actions.forEach((a) => {
      checkPage(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...dark);
      doc.rect(margin + 2, y - 3.5, 3.5, 3.5);
      const lines = doc.splitTextToSize(a.trim().replace(/^\d+[\.\)]\s*/, ""), contentW - 12);
      doc.text(lines, margin + 9, y);
      y += lines.length * 5 + 3;
    });
  });
  y += 4;

  // What This May Mean
  heading("What This May Mean for You", "🌱");
  bodyText(result.future_warning);
  y += 4;

  // Path Toward SSJ
  heading("Path Toward SSJ", "🚀");
  result.path_to_ssj.forEach((step, i) => {
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
  doc.text("SKC.World - Based on the Conscious Entrepreneurship Quadrant© framework.", margin, y);
  doc.text("Ready for Step 2? Book your Leadership Reflection Call", margin, y + 5);

  doc.save("SSJ-Reflection-Report.pdf");
}
