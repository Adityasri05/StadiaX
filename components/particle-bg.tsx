"use client";

import { useEffect, useRef } from "react";

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

export default function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 120;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const colors = ["#00E5FF", "#3B82F6", "#00D084", "#FF4D6D"];
      
      for (let i = 0; i < particleCount; i++) {
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.4 + 50;
        particles.push({
          x: 0,
          y: 0,
          size: Math.random() * 2 + 1,
          speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
          angle: Math.random() * Math.PI * 2,
          distance,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(7, 17, 31, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw glowing central stadium wireframe ring
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

      // Render flowing particles
      particles.forEach((p) => {
        p.angle += p.speed;
        
        // Calculate orbit position (isometric/elliptical projection)
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
      });

      // Draw faint lines between close particles in the outer rings
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.07 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
