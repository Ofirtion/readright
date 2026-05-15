// reportPdf.js — Hebrew-safe PDF report generator
// =================================
// Why html2canvas + jsPDF instead of jsPDF alone?
//   jsPDF doesn't bundle Hebrew fonts and its built-in fonts don't render
//   Hebrew/RTL correctly. The "right" fix would be to embed a Heebo TTF and
//   configure RTL — that's ~200KB of base64 font data plus brittle layout code.
//
//   Instead, we render the report as actual HTML/CSS in a hidden div (which
//   the browser handles perfectly: Hebrew fonts, RTL, niqqud, everything),
//   then html2canvas captures it as a high-DPI image, and jsPDF packages
//   that image into a PDF. Hebrew renders perfectly because it's just pixels.
//
//   Trade-off: file size is bigger (image-based vs text-based PDF), and the
//   text inside isn't selectable. For a 1-2 page parent report this is fine.

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ============================================
// MAIN EXPORT
// ============================================
export async function exportProgressReport({ child, report, timeSeries }) {
  // Build a hidden DOM node with the full report layout
  const container = buildReportContainer({ child, report, timeSeries });
  document.body.appendChild(container);

  try {
    // Capture as canvas — 2x DPI for crisp text
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#FAF6EF', // theme cream
      logging: false,
      useCORS: true,
    });

    // Build the PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Compute image dimensions: fit width, maintain aspect, paginate if tall
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    // If the content is taller than 1 page, paginate
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // negative offset for next page
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Build filename: "ReadRight_DaniCohen_2025-05-12.pdf"
    const dateStr = new Date().toISOString().slice(0, 10);
    const safeName = (child.name || 'child').replace(/[^\w\u0590-\u05FF]/g, '_');
    pdf.save(`ReadRight_${safeName}_${dateStr}.pdf`);
  } finally {
    // Always clean up the hidden DOM
    document.body.removeChild(container);
  }
}

// ============================================
// BUILD THE HTML REPORT
// ============================================
// Returns a styled <div> ready for html2canvas capture.
// We use inline styles (not classes) to avoid any CSS dependency.

function buildReportContainer({ child, report, timeSeries }) {
  const container = document.createElement('div');
  container.dir = 'rtl';
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;  /* A4 width at 96 DPI */
    padding: 40px 50px;
    background: #FAF6EF;
    font-family: 'Heebo', 'Frank Ruhl Libre', sans-serif;
    color: #1A2B4A;
    box-sizing: border-box;
  `;

  // Load fonts inline so html2canvas waits for them
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&family=Heebo:wght@400;700;900&display=swap';
  container.appendChild(link);

  // ============================================
  // HEADER
  // ============================================
  const header = document.createElement('div');
  header.style.cssText = `
    border-bottom: 3px solid #1A2B4A;
    padding-bottom: 20px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  `;
  header.innerHTML = `
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #C44536; letter-spacing: 2px; margin-bottom: 4px;">
        READRIGHT · דוח התקדמות
      </div>
      <div style="font-size: 32px; font-weight: 900; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A;">
        ${escapeHtml(child.name)}
      </div>
      <div style="font-size: 13px; color: #6B7280; margin-top: 6px;">
        ${child.age ? `גיל ${child.age} · ` : ''}תקופה: ${report.periodLabel} · ${report.sessionsInPeriod} קריאות
      </div>
    </div>
    <div style="text-align: left;">
      <div style="font-size: 11px; color: #6B7280;">תאריך הפקה</div>
      <div style="font-size: 14px; font-weight: 700; color: #1A2B4A;">
        ${new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  `;
  container.appendChild(header);

  // ============================================
  // OVERALL CARD
  // ============================================
  const overall = report.overall;
  const overallColors = {
    green: { bg: '#D8E8D0', fg: '#2D6A4F' },
    sun:   { bg: '#FCE9CC', fg: '#C44536' },
    rust:  { bg: '#FFE5DC', fg: '#C44536' },
  }[overall.color] || { bg: '#FCE9CC', fg: '#C44536' };

  const fluencyImp = report.metrics.fluencyImprovement;
  const overallCard = document.createElement('div');
  overallCard.style.cssText = `
    background: ${overallColors.bg};
    border: 1.5px solid ${overallColors.fg};
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 24px;
  `;
  overallCard.innerHTML = `
    <div style="font-size: 72px; line-height: 1;">${overall.emoji}</div>
    <div style="flex: 1;">
      <div style="font-size: 11px; font-weight: 700; color: ${overallColors.fg}; letter-spacing: 2px; margin-bottom: 4px;">
        רמה כללית
      </div>
      <div style="font-size: 40px; font-weight: 900; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A; margin-bottom: 4px;">
        ${escapeHtml(overall.label)}
      </div>
      ${fluencyImp ? `
        <div style="font-size: 13px; color: #6B7280;">
          <strong style="color: ${overallColors.fg};">
            ${fluencyImp.sinceStart >= 0 ? '+' : ''}${fluencyImp.sinceStart}%
          </strong>
          בשטף הקריאה מאז ההתחלה
        </div>
      ` : ''}
    </div>
  `;
  container.appendChild(overallCard);

  // ============================================
  // 4 METRICS GRID
  // ============================================
  const metricsGrid = document.createElement('div');
  metricsGrid.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  `;

  const metrics = [
    {
      label: 'שטף קריאה',
      value: report.metrics.fluency?.current ?? '—',
      unit: 'WCPM',
      subtitle: report.metrics.fluency ? `יעד גיל: ${report.metrics.fluency.target}` : '',
      improvement: report.metrics.fluencyImprovement,
    },
    {
      label: 'דיוק קריאה',
      value: report.metrics.accuracy?.current ?? '—',
      unit: '%',
      subtitle: 'אחוז מילים נכונות',
      improvement: report.metrics.accuracyImprovement,
    },
    {
      label: 'התמדה',
      value: report.metrics.consistency?.activeDays ?? '—',
      unit: report.metrics.consistency?.periodDays ? `מ-${report.metrics.consistency.periodDays} ימים` : 'ימים',
      subtitle: `קריאות ב${report.periodLabel}`,
    },
    {
      label: 'סיפורים שהושלמו',
      value: report.metrics.storiesCompleted?.inPeriod ?? 0,
      unit: 'סיפורים',
      subtitle: `${report.metrics.storiesCompleted?.sinceStart ?? 0} מאז ההתחלה`,
    },
  ];

  metrics.forEach((m) => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: #F5F0E6;
      border: 1px solid #E5DDD0;
      border-radius: 16px;
      padding: 16px;
    `;
    card.innerHTML = `
      <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #6B7280; margin-bottom: 8px;">
        ${escapeHtml(m.label)}
      </div>
      <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px;">
        <div style="font-size: 32px; font-weight: 900; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A;">
          ${m.value}
        </div>
        <div style="font-size: 12px; color: #6B7280;">${escapeHtml(m.unit)}</div>
      </div>
      <div style="font-size: 11px; color: #9CA3AF; margin-bottom: ${m.improvement ? '10px' : '0'};">
        ${escapeHtml(m.subtitle)}
      </div>
      ${m.improvement ? `
        <div style="display: flex; gap: 8px; align-items: center; font-size: 11px;">
          <span style="color: #6B7280;">מאז ההתחלה:</span>
          <span style="font-weight: 900; color: ${m.improvement.sinceStart >= 0 ? '#2D6A4F' : '#C44536'};">
            ${m.improvement.sinceStart >= 0 ? '+' : ''}${m.improvement.sinceStart}%
          </span>
        </div>
      ` : ''}
    `;
    metricsGrid.appendChild(card);
  });
  container.appendChild(metricsGrid);

  // ============================================
  // CHART (if enough data)
  // ============================================
  if (timeSeries && timeSeries.length >= 2) {
    const chartWrapper = document.createElement('div');
    chartWrapper.style.cssText = `
      background: #F5F0E6;
      border: 1px solid #E5DDD0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    `;
    chartWrapper.innerHTML = `
      <div style="font-weight: 900; font-size: 16px; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A; margin-bottom: 4px;">
        מגמת התקדמות
      </div>
      <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 12px;">
        שטף קריאה ודיוק לאורך זמן
      </div>
      ${buildChartSvg(timeSeries)}
      <div style="display: flex; justify-content: center; gap: 24px; margin-top: 12px; font-size: 11px; color: #6B7280;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 24px; height: 2px; background: #1A2B4A;"></div>
          <span>שטף (WCPM)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 24px; height: 2px; background: #C44536; border-top: 1px dashed #C44536;"></div>
          <span>דיוק (%)</span>
        </div>
      </div>
    `;
    container.appendChild(chartWrapper);
  }

  // ============================================
  // INSIGHTS
  // ============================================
  if (report.insights.length > 0) {
    const insightsDiv = document.createElement('div');
    insightsDiv.style.cssText = `
      background: #1A2B4A;
      color: #FAF6EF;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
    `;
    insightsDiv.innerHTML = `
      <div style="font-weight: 900; font-size: 16px; font-family: 'Frank Ruhl Libre', serif; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">✨</span> תובנות
      </div>
      ${report.insights.map((ins) => `
        <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; font-size: 13px; line-height: 1.5;">
          <div style="font-size: 18px; flex-shrink: 0;">${ins.icon}</div>
          <div>${escapeHtml(ins.text)}</div>
        </div>
      `).join('')}
    `;
    container.appendChild(insightsDiv);
  }

  // ============================================
  // COMMON ERRORS TABLE (for clinician)
  // ============================================
  if (report.commonErrors.length > 0) {
    const errorsDiv = document.createElement('div');
    errorsDiv.style.cssText = `
      background: #F5F0E6;
      border: 1px solid #E5DDD0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    `;

    let tableRows = '';
    report.commonErrors.forEach((err) => {
      tableRows += `
        <tr style="border-top: 1px solid #E5DDD0;">
          <td style="padding: 8px 12px; font-weight: 700; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A;">
            ${escapeHtml(err.word)}
          </td>
          <td style="padding: 8px 12px; color: #6B7280;">${err.count}</td>
          <td style="padding: 8px 12px; font-size: 11px; color: #9CA3AF;">
            ${err.attempts.length > 0 ? escapeHtml(err.attempts.slice(0, 3).join(', ')) : '—'}
          </td>
        </tr>
      `;
    });

    errorsDiv.innerHTML = `
      <div style="font-weight: 900; font-size: 16px; font-family: 'Frank Ruhl Libre', serif; color: #1A2B4A; margin-bottom: 4px;">
        מידע לאיש מקצוע
      </div>
      <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 12px;">
        מילים שחזרו על עצמן כקשות. שימושי לזיהוי דפוסים.
      </div>
      <table style="width: 100%; background: #FAF6EF; border-radius: 12px; overflow: hidden; font-size: 13px;">
        <thead>
          <tr style="background: #ECE3D2;">
            <th style="padding: 10px 12px; text-align: right; font-weight: 700; color: #1A2B4A;">המילה</th>
            <th style="padding: 10px 12px; text-align: right; font-weight: 700; color: #1A2B4A;">פעמים</th>
            <th style="padding: 10px 12px; text-align: right; font-weight: 700; color: #1A2B4A;">נקרא בטעות כ</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
    container.appendChild(errorsDiv);
  }

  // ============================================
  // FOOTER
  // ============================================
  const footer = document.createElement('div');
  footer.style.cssText = `
    border-top: 1px solid #E5DDD0;
    padding-top: 16px;
    font-size: 10px;
    color: #9CA3AF;
    text-align: center;
    line-height: 1.6;
  `;
  footer.innerHTML = `
    הדוח מבוסס על ${report.totalSessions} קריאות שנעשו דרך ReadRight.<br>
    האפליקציה אינה כלי אבחון רפואי — המדדים נועדים למעקב יומיומי בלבד.<br>
    הופק על ידי readright.app
  `;
  container.appendChild(footer);

  return container;
}

// ============================================
// SVG CHART BUILDER (same logic as ProgressDashboard, plain SVG string)
// ============================================
function buildChartSvg(data) {
  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 24, bottom: 24, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const xStep = chartW / Math.max(1, data.length - 1);
  const maxWcpm = Math.max(50, ...data.map((d) => d.wcpm));
  const yScaleWcpm = (v) => chartH - (v / maxWcpm) * chartH;
  const yScaleAcc = (v) => chartH - (v / 100) * chartH;
  const wcpmPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScaleWcpm(d.wcpm)}`).join(' ');
  const accPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScaleAcc(d.accuracy)}`).join(' ');
  const points = data.map((d, i) => `
    <circle cx="${i * xStep}" cy="${yScaleWcpm(d.wcpm)}" r="3" fill="#1A2B4A" />
    <circle cx="${i * xStep}" cy="${yScaleAcc(d.accuracy)}" r="3" fill="#C44536" />
  `).join('');

  return `
    <svg viewBox="0 0 ${W} ${H}" style="width: 100%; height: 200px;">
      <g transform="translate(${PAD.left}, ${PAD.top})">
        <line x1="0" x2="${chartW}" y1="0" y2="0" stroke="#E5DDD0" stroke-dasharray="2 4"/>
        <line x1="0" x2="${chartW}" y1="${chartH * 0.5}" y2="${chartH * 0.5}" stroke="#E5DDD0" stroke-dasharray="2 4"/>
        <line x1="0" x2="${chartW}" y1="${chartH}" y2="${chartH}" stroke="#E5DDD0" stroke-dasharray="2 4"/>
        <path d="${wcpmPath}" stroke="#1A2B4A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${accPath}" stroke="#C44536" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 3"/>
        ${points}
      </g>
    </svg>
  `;
}

// ============================================
// HTML escape — defense against weird names
// ============================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
