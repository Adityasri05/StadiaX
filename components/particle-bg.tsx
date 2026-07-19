"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  distance: number;
  color: string;
  opacity: number;
}

/** Maximum distance (px) to draw connection lines between particles */
const LINE_THRESHOLD = 80;
/** Number of particles — kept at 70 for 60fps performance */
const PARTICLE_COUNT = 70;

/**
 * ParticleBg — animated canvas background with orbiting particles and
 * connection lines. Uses a spatial grid to reduce line-drawing from
 * O(n²) to O(n) complexity, enabling smooth 60fps rendering.
 */
export default function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initParticles = useCallback((width: number, height: number): Particle[] => {
    const colors = ["#00E5FF", "#3B82F6", "#00D084", "#FF4D6D"];
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: 0,
      y: 0,
      size: Math.random() * 2 + 1,
      speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * Math.min(width, height) * 0.4 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = initParticles(canvas.width, canvas.height);
    };

    /**
     * Draws connection lines between nearby particles using a spatial grid
     * for O(n) average complexity instead of O(n²) brute-force.
     */
    const drawLines = (pts: Particle[]) => {
      // Build grid cells of size LINE_THRESHOLD
      const cellSize = LINE_THRESHOLD;
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const grid = new Map<number, Particle[]>();

      for (const p of pts) {
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);
        const key = row * cols + col;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      ctx.lineWidth = 0.5;
      for (const p of pts) {
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);

        // Only check the 9 neighboring cells (instead of all n particles)
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const key = (row + dr) * cols + (col + dc);
            const neighbors = grid.get(key);
            if (!neighbors) continue;
            for (const neighbor of neighbors) {
              if (neighbor === p) continue;
              const dx = p.x - neighbor.x;
              const dy = p.y - neighbor.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < LINE_THRESHOLD) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.07 * (1 - dist / LINE_THRESHOLD)})`;
                ctx.stroke();
              }
            }
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(7, 17, 31, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Decorative stadium wireframe rings
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, canvas.width * 0.25, canvas.height * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.06)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, canvas.width * 0.35, canvas.height * 0.25, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Update particle positions
      for (const p of particles) {
        p.angle += p.speed;
        p.x = centerX + Math.cos(p.angle) * p.distance * 1.5;
        p.y = centerY + Math.sin(p.angle) * p.distance * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      drawLines(particles);
      animationFrameId = requestAnimationFrame(animate);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
