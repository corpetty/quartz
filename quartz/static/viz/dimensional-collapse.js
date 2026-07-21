import { POINTS, getPalette, setupCanvas, resizeCanvas, getPlotArea, toPixel, drawAxes, drawPoint, drawLabel } from './lib/surface-common.js';

export function init(container, options) {
  const palette = getPalette(options.dark);

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  container.appendChild(wrapper);

  // Slider UI
  const sliderRow = document.createElement('div');
  sliderRow.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:0 4px;font:13px system-ui,sans-serif;';

  const sliderLabel = document.createElement('span');
  sliderLabel.style.color = palette.textSecondary;
  sliderLabel.style.whiteSpace = 'nowrap';
  sliderLabel.textContent = "Society's view";

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = '0';
  slider.style.cssText = 'flex:1;accent-color:#7F77DD;cursor:pointer;';

  const stateLabel = document.createElement('span');
  stateLabel.style.cssText = `color:${palette.textSecondary};min-width:120px;text-align:right;white-space:nowrap;`;
  stateLabel.textContent = 'Full surface';

  sliderRow.appendChild(sliderLabel);
  sliderRow.appendChild(slider);
  sliderRow.appendChild(stateLabel);
  wrapper.appendChild(sliderRow);

  // Canvas
  const canvasContainer = document.createElement('div');
  wrapper.appendChild(canvasContainer);
  let { canvas, ctx, width, height } = setupCanvas(canvasContainer, options);

  let t = 0; // 0-1 collapse parameter

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawAxes(ctx, width, height, palette);

    const area = getPlotArea(width, height);

    if (t > 0.05) {
      // Draw diagonal line
      const start = toPixel(0, 0, area);
      const end = toPixel(1, 1, area);

      ctx.save();
      ctx.globalAlpha = t;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = palette.diagonal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.px, start.py);
      ctx.lineTo(end.px, end.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label the diagonal
      if (t > 0.3) {
        ctx.font = 'italic 12px system-ui, sans-serif';
        ctx.fillStyle = palette.diagonal;
        ctx.globalAlpha = Math.min(1, (t - 0.3) / 0.3);
        ctx.save();
        const midX = (start.px + end.px) / 2;
        const midY = (start.py + end.py) / 2;
        ctx.translate(midX + 8, midY - 12);
        const angle = Math.atan2(start.py - end.py, end.px - start.px);
        ctx.rotate(-angle);
        ctx.textAlign = 'center';
        ctx.fillText('The escalator', 0, 0);
        ctx.restore();
      }

      // Draw overlay zones
      if (t > 0.2) {
        const zoneAlpha = Math.min(0.8, (t - 0.2) / 0.5) * 0.6;

        // "Just friends" — upper-left triangle
        ctx.globalAlpha = zoneAlpha;
        ctx.fillStyle = palette.overlay;
        ctx.beginPath();
        ctx.moveTo(area.plotX, area.plotY);
        ctx.lineTo(area.plotX + area.plotW, area.plotY);
        ctx.lineTo(area.plotX, area.plotY + area.plotH);
        ctx.closePath();
        ctx.fill();

        // "Just sex" — lower-right triangle
        ctx.beginPath();
        ctx.moveTo(area.plotX + area.plotW, area.plotY + area.plotH);
        ctx.lineTo(area.plotX + area.plotW, area.plotY);
        ctx.lineTo(area.plotX, area.plotY + area.plotH);
        ctx.closePath();
        ctx.fill();

        // Zone labels
        if (t > 0.5) {
          ctx.globalAlpha = Math.min(1, (t - 0.5) / 0.3);
          ctx.font = 'italic 14px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = palette.textTertiary;
          ctx.fillText('"Just friends"', area.plotX + area.plotW * 0.25, area.plotY + area.plotH * 0.3);
          ctx.fillText('"Just sex"', area.plotX + area.plotW * 0.75, area.plotY + area.plotH * 0.75);
        }
      }

      ctx.restore();
    }

    // Draw points — interpolate toward diagonal
    for (const pt of POINTS) {
      // Project point onto diagonal (y=x line)
      const projX = (pt.x + pt.y) / 2;
      const projY = projX;

      const currentX = pt.x + t * (projX - pt.x);
      const currentY = pt.y + t * (projY - pt.y);

      const { px, py } = toPixel(currentX, currentY, area);

      // Distance from diagonal determines how much the point fades
      const distFromDiag = Math.abs(pt.x - pt.y) / Math.sqrt(2);
      const alpha = 1 - t * distFromDiag * 1.5;
      const finalAlpha = Math.max(0.15, Math.min(1, alpha));

      // Color shifts: near-diagonal stays purple, far fades to gray
      const grayMix = t * distFromDiag * 2;
      const clampedGray = Math.min(1, grayMix);

      if (clampedGray < 0.8) {
        drawPoint(ctx, px, py, 5, palette.accent, finalAlpha);
      } else {
        drawPoint(ctx, px, py, 4, palette.textTertiary, finalAlpha * 0.6);
      }
      drawLabel(ctx, pt.label, px, py, palette, finalAlpha * 0.8);
    }
  }

  function onSliderInput() {
    t = parseInt(slider.value) / 100;
    if (t < 0.1) stateLabel.textContent = 'Full surface';
    else if (t < 0.4) stateLabel.textContent = 'Compressing...';
    else if (t < 0.7) stateLabel.textContent = 'Collapsing';
    else stateLabel.textContent = 'One dimension';
    draw();
  }

  slider.addEventListener('input', onSliderInput);
  draw();

  return {
    destroy() {
      slider.removeEventListener('input', onSliderInput);
      container.innerHTML = '';
    },
    resize() {
      const result = resizeCanvas(canvas);
      ctx = result.ctx;
      width = result.width;
      height = result.height;
      draw();
    }
  };
}
