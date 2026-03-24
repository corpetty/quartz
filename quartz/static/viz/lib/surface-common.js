// Shared utilities for Canvas 2D surface visualizations

export const POINTS = [
  { id: 'acquaintance', label: 'Acquaintance', x: 0.15, y: 0.08, desc: 'Surface-level connection' },
  { id: 'colleague', label: 'Work colleague', x: 0.20, y: 0.20, desc: 'Low on both axes' },
  { id: 'mentor', label: 'Mentor', x: 0.08, y: 0.55, desc: 'Emotional guidance, non-physical' },
  { id: 'crush', label: 'New crush', x: 0.55, y: 0.30, desc: 'Physical tension, emotional uncertainty' },
  { id: 'casual', label: 'Casual sex', x: 0.85, y: 0.25, desc: 'Physical, low emotional depth' },
  { id: 'onenight', label: 'One-night stand', x: 0.95, y: 0.08, desc: 'Purely physical, minimal intimacy' },
  { id: 'cuddly', label: 'Cuddly friend', x: 0.40, y: 0.50, desc: 'Some physical comfort, emotional closeness' },
  { id: 'fwb', label: 'Friends with benefits', x: 0.70, y: 0.40, desc: 'Physical with moderate emotional bond' },
  { id: 'deep', label: 'Deep friendship', x: 0.15, y: 0.85, desc: 'Emotionally intimate, non-physical' },
  { id: 'childhood', label: 'Childhood best friend', x: 0.10, y: 0.92, desc: 'Deep emotional history, non-physical' },
  { id: 'affair', label: 'Long-term affair', x: 0.75, y: 0.70, desc: 'Deep on both, socially hidden' },
  { id: 'partner', label: 'Romantic partner', x: 0.65, y: 0.88, desc: 'High physical and emotional depth' },
];

export function getPalette(dark) {
  return dark ? {
    textPrimary: '#e0ded6',
    textSecondary: '#9c9a92',
    textTertiary: '#73726c',
    gridLine: 'rgba(255,255,255,0.06)',
    axisLine: 'rgba(255,255,255,0.2)',
    bg: '#1a1a1a',
    accent: '#7F77DD',
    accentFaded: 'rgba(127,119,221,0.15)',
    diagonal: '#D85A30',
    zonePurple: 'rgba(127,119,221,0.12)',
    zoneTeal: 'rgba(26,138,138,0.12)',
    zoneGray: 'rgba(156,154,146,0.08)',
    zoneCoral: 'rgba(216,90,48,0.12)',
    zonePink: 'rgba(200,120,180,0.10)',
    zonePurpleBorder: 'rgba(127,119,221,0.5)',
    zoneTealBorder: 'rgba(26,138,138,0.5)',
    zoneGrayBorder: 'rgba(156,154,146,0.3)',
    zoneCoralBorder: 'rgba(216,90,48,0.5)',
    zonePinkBorder: 'rgba(200,120,180,0.4)',
    overlay: 'rgba(26,26,26,0.55)',
  } : {
    textPrimary: '#2c2c2a',
    textSecondary: '#73726c',
    textTertiary: '#9c9a92',
    gridLine: 'rgba(0,0,0,0.06)',
    axisLine: 'rgba(0,0,0,0.2)',
    bg: '#fafaf8',
    accent: '#7F77DD',
    accentFaded: 'rgba(127,119,221,0.12)',
    diagonal: '#D85A30',
    zonePurple: 'rgba(127,119,221,0.08)',
    zoneTeal: 'rgba(26,138,138,0.08)',
    zoneGray: 'rgba(156,154,146,0.06)',
    zoneCoral: 'rgba(216,90,48,0.08)',
    zonePink: 'rgba(200,120,180,0.08)',
    zonePurpleBorder: 'rgba(127,119,221,0.4)',
    zoneTealBorder: 'rgba(26,138,138,0.4)',
    zoneGrayBorder: 'rgba(156,154,146,0.25)',
    zoneCoralBorder: 'rgba(216,90,48,0.4)',
    zonePinkBorder: 'rgba(200,120,180,0.35)',
    overlay: 'rgba(250,250,248,0.55)',
  };
}

export function getDpr() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

export function setupCanvas(container, options) {
  const height = parseInt(options.height || '520', 10);
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = height + 'px';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const dpr = getDpr();
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return { canvas, ctx, width: rect.width, height: rect.height, dpr };
}

export function resizeCanvas(canvas) {
  const dpr = getDpr();
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, width: rect.width, height: rect.height, dpr };
}

// Returns the plot area within the canvas (with margins for axes)
export function getPlotArea(width, height) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  return {
    margin,
    plotX: margin.left,
    plotY: margin.top,
    plotW: width - margin.left - margin.right,
    plotH: height - margin.top - margin.bottom,
  };
}

// Convert normalized (0-1) coords to pixel coords within the plot area
export function toPixel(nx, ny, plotArea) {
  return {
    px: plotArea.plotX + nx * plotArea.plotW,
    py: plotArea.plotY + (1 - ny) * plotArea.plotH, // y is inverted (0 at bottom)
  };
}

// Draw the grid, axes, and axis labels
export function drawAxes(ctx, width, height, palette) {
  const area = getPlotArea(width, height);

  // Grid lines
  ctx.strokeStyle = palette.gridLine;
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const frac = i / 4;
    // Vertical
    const vx = area.plotX + frac * area.plotW;
    ctx.beginPath();
    ctx.moveTo(vx, area.plotY);
    ctx.lineTo(vx, area.plotY + area.plotH);
    ctx.stroke();
    // Horizontal
    const hy = area.plotY + frac * area.plotH;
    ctx.beginPath();
    ctx.moveTo(area.plotX, hy);
    ctx.lineTo(area.plotX + area.plotW, hy);
    ctx.stroke();
  }

  // Axis lines
  ctx.strokeStyle = palette.axisLine;
  ctx.lineWidth = 1.5;
  // X axis
  ctx.beginPath();
  ctx.moveTo(area.plotX, area.plotY + area.plotH);
  ctx.lineTo(area.plotX + area.plotW, area.plotY + area.plotH);
  ctx.stroke();
  // Y axis
  ctx.beginPath();
  ctx.moveTo(area.plotX, area.plotY);
  ctx.lineTo(area.plotX, area.plotY + area.plotH);
  ctx.stroke();

  // Axis labels
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = palette.textSecondary;
  ctx.textAlign = 'center';
  ctx.fillText('Emotional', area.plotX + area.plotW * 0.15, area.plotY + area.plotH + 35);
  ctx.fillText('Expression', area.plotX + area.plotW * 0.5, area.plotY + area.plotH + 35);
  ctx.fillText('Physical', area.plotX + area.plotW * 0.85, area.plotY + area.plotH + 35);

  // Y axis label (rotated)
  ctx.save();
  ctx.translate(15, area.plotY + area.plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Depth of intimacy', 0, 0);
  ctx.restore();

  // Y axis tick labels
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = palette.textTertiary;
  ctx.textAlign = 'right';
  ctx.fillText('Shallow', area.plotX - 8, area.plotY + area.plotH - 4);
  ctx.fillText('Deep', area.plotX - 8, area.plotY + 12);
}

// Draw a single relationship point
export function drawPoint(ctx, px, py, radius, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Draw label for a point
export function drawLabel(ctx, text, px, py, palette, alpha) {
  ctx.globalAlpha = alpha;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = palette.textSecondary;
  ctx.textAlign = 'left';
  ctx.fillText(text, px + 10, py + 4);
  ctx.globalAlpha = 1;
}

// Draw all standard points with labels
export function drawAllPoints(ctx, width, height, palette, alphaFn) {
  const area = getPlotArea(width, height);
  for (const pt of POINTS) {
    const { px, py } = toPixel(pt.x, pt.y, area);
    const alpha = alphaFn ? alphaFn(pt) : 1;
    drawPoint(ctx, px, py, 5, palette.accent, alpha);
    drawLabel(ctx, pt.label, px, py, palette, alpha);
  }
}

// Hit-test: find closest point to mouse position
export function hitTest(mouseX, mouseY, width, height, threshold) {
  const area = getPlotArea(width, height);
  let closest = null;
  let closestDist = threshold || 20;
  for (const pt of POINTS) {
    const { px, py } = toPixel(pt.x, pt.y, area);
    const dist = Math.hypot(mouseX - px, mouseY - py);
    if (dist < closestDist) {
      closest = pt;
      closestDist = dist;
    }
  }
  return closest;
}
