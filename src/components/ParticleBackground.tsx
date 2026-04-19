"use client";

import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity?: number;
  brightness?: number;
  twinklePhase?: number;
  twinkleSpeed?: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    let backgroundNodes: NodePoint[] = [];
    let midgroundNodes: NodePoint[] = [];
    let foregroundNodes: NodePoint[] = [];
    let dustParticles: NodePoint[] = [];

    const setCanvasSize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createLayer = (count: number, options: { speed: number; minRadius: number; radiusRange: number; opacity?: [number, number]; brightness?: [number, number]; twinkle?: boolean; }) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * options.speed,
        vy: (Math.random() - 0.5) * options.speed,
        radius: Math.random() * options.radiusRange + options.minRadius,
        opacity: options.opacity ? Math.random() * (options.opacity[1] - options.opacity[0]) + options.opacity[0] : undefined,
        brightness: options.brightness ? Math.random() * (options.brightness[1] - options.brightness[0]) + options.brightness[0] : undefined,
        twinklePhase: options.twinkle ? Math.random() * Math.PI * 2 : undefined,
        twinkleSpeed: options.twinkle ? Math.random() * 0.03 + 0.01 : undefined,
      }));

    const createScene = () => {
      backgroundNodes = createLayer(22, { speed: reducedMotion ? 0 : 0.06, minRadius: 4, radiusRange: 6, opacity: [0.04, 0.12] });
      midgroundNodes = createLayer(70, { speed: reducedMotion ? 0 : 0.2, minRadius: 1, radiusRange: 2.4, brightness: [0.45, 0.95] });
      foregroundNodes = createLayer(12, { speed: reducedMotion ? 0 : 0.1, minRadius: 8, radiusRange: 9, opacity: [0.02, 0.08] });
      dustParticles = createLayer(64, { speed: reducedMotion ? 0 : 0.08, minRadius: 0.4, radiusRange: 1.1, twinkle: true });
    };

    const wrapNode = (node: NodePoint) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -60) node.x = window.innerWidth + 60;
      if (node.x > window.innerWidth + 60) node.x = -60;
      if (node.y < -60) node.y = window.innerHeight + 60;
      if (node.y > window.innerHeight + 60) node.y = -60;
    };

    const draw = () => {
      frame += 1;

      const background = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        Math.max(window.innerWidth, window.innerHeight) * 0.8,
      );
      background.addColorStop(0, "#0c1730");
      background.addColorStop(0.55, "#08101d");
      background.addColorStop(1, "#040913");

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      backgroundNodes.forEach((node) => {
        wrapNode(node);

        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
        glow.addColorStop(0, `rgba(92, 154, 255, ${node.opacity})`);
        glow.addColorStop(0.4, `rgba(124, 140, 255, ${(node.opacity ?? 0) * 0.5})`);
        glow.addColorStop(1, "rgba(24, 67, 145, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      dustParticles.forEach((particle) => {
        wrapNode(particle);
        const twinkle = Math.sin(frame * 0.03 + (particle.twinklePhase ?? 0) * (particle.twinkleSpeed ?? 1)) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(198, 227, 255, ${twinkle * 0.38})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const maxDistance = 180;
      for (let i = 0; i < midgroundNodes.length; i += 1) {
        for (let j = i + 1; j < midgroundNodes.length; j += 1) {
          const first = midgroundNodes[i];
          const second = midgroundNodes[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = 0.4 * (1 - distance / maxDistance);
            const line = ctx.createLinearGradient(first.x, first.y, second.x, second.y);
            line.addColorStop(0, `rgba(87, 178, 255, ${opacity})`);
            line.addColorStop(0.5, `rgba(155, 107, 255, ${opacity * 0.75})`);
            line.addColorStop(1, `rgba(65, 214, 255, ${opacity})`);

            ctx.strokeStyle = line;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(second.x, second.y);
            ctx.stroke();
          }
        }
      }

      midgroundNodes.forEach((node) => {
        wrapNode(node);

        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6);
        glow.addColorStop(0, `rgba(198, 227, 255, ${(node.brightness ?? 0.6) * 0.75})`);
        glow.addColorStop(0.3, `rgba(124, 140, 255, ${(node.brightness ?? 0.6) * 0.45})`);
        glow.addColorStop(1, "rgba(10, 16, 29, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(236, 243, 255, ${node.brightness ?? 0.65})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      foregroundNodes.forEach((node) => {
        wrapNode(node);

        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
        glow.addColorStop(0, `rgba(87, 178, 255, ${node.opacity})`);
        glow.addColorStop(0.45, `rgba(155, 107, 255, ${(node.opacity ?? 0) * 0.45})`);
        glow.addColorStop(1, "rgba(8, 16, 29, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = window.requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setCanvasSize();
      createScene();
    };

    handleResize();
    draw();
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-95" aria-hidden="true" />;
}
