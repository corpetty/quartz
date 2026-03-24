import { POINTS, getPalette, setupCanvas, resizeCanvas, getPlotArea, toPixel, drawAxes, drawPoint, drawLabel, hitTest } from './lib/surface-common.js';

export function init(container, options) {
  const palette = getPalette(options.dark);
  let { canvas, ctx, width, height } = setupCanvas(container, options);
  let hovered = null;
  let animFrame = null;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawAxes(ctx, width, height, palette);

    const area = getPlotArea(width, height);

    // Draw points
    for (const pt of POINTS) {
      const { px, py } = toPixel(pt.x, pt.y, area);
      const isHovered = hovered && hovered.id === pt.id;
      const radius = isHovered ? 7 : 5;
      const alpha = isHovered ? 1 : 0.8;

      drawPoint(ctx, px, py, radius, palette.accent, alpha);

      // Always show labels but highlight hovered one
      if (isHovered) {
        // Draw description tooltip
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillStyle = palette.textPrimary;
        ctx.textAlign = 'left';

        const labelWidth = ctx.measureText(pt.label).width;
        const descWidth = ctx.measureText(pt.desc).width;
        const boxWidth = Math.max(labelWidth, descWidth) + 20;
        const boxHeight = 48;

        // Position tooltip — prefer right, flip if near edge
        let tooltipX = px + 14;
        let tooltipY = py - boxHeight / 2;
        if (tooltipX + boxWidth > width - 10) {
          tooltipX = px - boxWidth - 14;
        }
        if (tooltipY < 5) tooltipY = 5;
        if (tooltipY + boxHeight > height - 5) tooltipY = height - boxHeight - 5;

        // Tooltip background
        ctx.fillStyle = palette.bg;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        roundRect(ctx, tooltipX, tooltipY, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        roundRect(ctx, tooltipX, tooltipY, boxWidth, boxHeight, 6);
        ctx.stroke();

        ctx.fillStyle = palette.textPrimary;
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText(pt.label, tooltipX + 10, tooltipY + 18);
        ctx.font = '11px system-ui, sans-serif';
        ctx.fillStyle = palette.textSecondary;
        ctx.fillText(pt.desc, tooltipX + 10, tooltipY + 36);
      } else {
        drawLabel(ctx, pt.label, px, py, palette, 0.7);
      }
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    let mx, my;
    if (e.touches) {
      mx = e.touches[0].clientX - rect.left;
      my = e.touches[0].clientY - rect.top;
    } else {
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }
    const prev = hovered;
    hovered = hitTest(mx, my, width, height, 25);
    if (hovered !== prev) {
      canvas.style.cursor = hovered ? 'pointer' : 'default';
      draw();
    }
  }

  function onLeave() {
    if (hovered) {
      hovered = null;
      canvas.style.cursor = 'default';
      draw();
    }
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('touchstart', onMove, { passive: true });
  canvas.addEventListener('mouseleave', onLeave);

  draw();

  return {
    destroy() {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchstart', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      if (animFrame) cancelAnimationFrame(animFrame);
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
