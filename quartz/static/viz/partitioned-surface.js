import { POINTS, getPalette, setupCanvas, resizeCanvas, getPlotArea, toPixel, drawAxes, drawPoint, drawLabel } from './lib/surface-common.js';

export function init(container, options) {
  const palette = getPalette(options.dark);

  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  container.appendChild(wrapper);

  // Toggle buttons
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;';

  function makeBtn(label, active) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      padding: 6px 16px;
      border-radius: 6px;
      border: 1.5px solid ${active ? '#7F77DD' : palette.axisLine};
      background: ${active ? 'rgba(127,119,221,0.12)' : 'transparent'};
      color: ${active ? '#7F77DD' : palette.textSecondary};
      font: 13px system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s;
    `;
    return btn;
  }

  const btnPartitioned = makeBtn("Society's map", true);
  const btnOpen = makeBtn("Remove the partitions", false);
  btnRow.appendChild(btnPartitioned);
  btnRow.appendChild(btnOpen);
  wrapper.appendChild(btnRow);

  // Canvas
  const canvasContainer = document.createElement('div');
  wrapper.appendChild(canvasContainer);
  let { canvas, ctx, width, height } = setupCanvas(canvasContainer, options);

  // Axiom text
  const axiomDiv = document.createElement('div');
  axiomDiv.style.cssText = `
    margin-top: 16px;
    padding: 12px 16px;
    border-left: 3px solid ${palette.accent};
    font: italic 14px/1.5 system-ui, sans-serif;
    color: ${palette.textSecondary};
  `;
  axiomDiv.innerHTML = '"It is absurd to think that you should get everything you need from a single person."';
  wrapper.appendChild(axiomDiv);

  let state = 'partitioned'; // or 'open'
  let animT = 1; // 1 = partitioned, 0 = open
  let animTarget = 1;
  let animFrame = null;

  const zones = [
    { label: 'Partner', x1: 0.45, y1: 0.6, x2: 1.0, y2: 1.0, fill: palette.zonePurple, border: palette.zonePurpleBorder, dashed: false },
    { label: 'Friends', x1: 0.0, y1: 0.3, x2: 0.45, y2: 1.0, fill: palette.zoneTeal, border: palette.zoneTealBorder, dashed: false },
    { label: 'Acquaintances', x1: 0.0, y1: 0.0, x2: 0.45, y2: 0.3, fill: palette.zoneGray, border: palette.zoneGrayBorder, dashed: false },
    { label: 'Casual / hookups', x1: 0.45, y1: 0.0, x2: 1.0, y2: 0.35, fill: palette.zoneCoral, border: palette.zoneCoralBorder, dashed: false },
    { label: '???', x1: 0.45, y1: 0.35, x2: 1.0, y2: 0.6, fill: palette.zonePink, border: palette.zonePinkBorder, dashed: true },
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawAxes(ctx, width, height, palette);

    const area = getPlotArea(width, height);

    // Draw zones with animated opacity
    if (animT > 0.01) {
      for (const zone of zones) {
        const tl = toPixel(zone.x1, zone.y2, area); // top-left in pixel space
        const br = toPixel(zone.x2, zone.y1, area); // bottom-right
        const zw = br.px - tl.px;
        const zh = br.py - tl.py;

        // Fill
        ctx.globalAlpha = animT * 0.8;
        ctx.fillStyle = zone.fill;
        ctx.fillRect(tl.px, tl.py, zw, zh);

        // Border
        ctx.strokeStyle = zone.border;
        ctx.lineWidth = 1.5;
        if (zone.dashed) ctx.setLineDash([5, 3]);
        else ctx.setLineDash([]);
        ctx.strokeRect(tl.px, tl.py, zw, zh);
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = palette.textSecondary;
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        const labelText = zone.label === '???' ? 'Socially ambiguous' : zone.label;
        ctx.fillText(labelText, tl.px + zw / 2, tl.py + zh / 2 + 4);
        ctx.globalAlpha = 1;
      }
    }

    // Draw points
    for (const pt of POINTS) {
      const { px, py } = toPixel(pt.x, pt.y, area);
      drawPoint(ctx, px, py, 5, palette.accent, 0.85);
      drawLabel(ctx, pt.label, px, py, palette, 0.7);
    }
  }

  function animate() {
    const speed = 0.04;
    if (Math.abs(animT - animTarget) > 0.005) {
      animT += (animTarget - animT) * speed + Math.sign(animTarget - animT) * 0.008;
      animT = Math.max(0, Math.min(1, animT));
      draw();
      animFrame = requestAnimationFrame(animate);
    } else {
      animT = animTarget;
      draw();
      animFrame = null;
    }
  }

  function setActiveBtn(active) {
    const isPartitioned = active === 'partitioned';
    btnPartitioned.style.borderColor = isPartitioned ? '#7F77DD' : palette.axisLine;
    btnPartitioned.style.background = isPartitioned ? 'rgba(127,119,221,0.12)' : 'transparent';
    btnPartitioned.style.color = isPartitioned ? '#7F77DD' : palette.textSecondary;
    btnOpen.style.borderColor = !isPartitioned ? '#7F77DD' : palette.axisLine;
    btnOpen.style.background = !isPartitioned ? 'rgba(127,119,221,0.12)' : 'transparent';
    btnOpen.style.color = !isPartitioned ? '#7F77DD' : palette.textSecondary;
  }

  function onClickPartitioned() {
    state = 'partitioned';
    animTarget = 1;
    setActiveBtn('partitioned');
    axiomDiv.innerHTML = '"It is absurd to think that you should get everything you need from a single person."';
    if (!animFrame) animFrame = requestAnimationFrame(animate);
  }

  function onClickOpen() {
    state = 'open';
    animTarget = 0;
    setActiveBtn('open');
    axiomDiv.innerHTML = '"It is absurd to think that you should get everything you need from a single person."<br><br><span style="color:' + palette.textPrimary + '">...but now where does each need go?</span>';
    if (!animFrame) animFrame = requestAnimationFrame(animate);
  }

  btnPartitioned.addEventListener('click', onClickPartitioned);
  btnOpen.addEventListener('click', onClickOpen);

  draw();

  return {
    destroy() {
      btnPartitioned.removeEventListener('click', onClickPartitioned);
      btnOpen.removeEventListener('click', onClickOpen);
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
