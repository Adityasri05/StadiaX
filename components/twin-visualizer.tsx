"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AlertTriangle } from "lucide-react";

interface TwinVisualizerProps {
  /** The simulation profile state determining particle flow color and layout structures */
  simulationState: "Normal" | "Prediction" | "Emergency" | "Evacuation" | "Traffic" | "Energy";
}

/**
 * TwinVisualizer Component
 * Instantiates a 3D WebGL Three.js canvas showcasing interactive stadium wireframes.
 * Simulates real-time crowd movement streams as glowing particle swarms
 * representing fans moving dynamically based on active simulation overlays.
 */
export default function TwinVisualizer({ simulationState }: TwinVisualizerProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- WebGL Capability Check ---
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setTimeout(() => setWebglError(true), 0);
      return;
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07111f);
    scene.fog = new THREE.FogExp2(0x07111f, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 100, 150);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear out container first
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // --- Add Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 2, 300);
    pointLight.position.set(0, 50, 0);
    scene.add(pointLight);

    // --- Draw Stadium Mesh ---
    // Seating Ring (Outer Bowl)
    const outerTorusGeom = new THREE.TorusGeometry(60, 16, 20, 60);
    const outerTorusMat = new THREE.MeshBasicMaterial({
      color: 0x132238,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const stadiumBowl = new THREE.Mesh(outerTorusGeom, outerTorusMat);
    stadiumBowl.rotation.x = Math.PI / 2;
    scene.add(stadiumBowl);

    // Inner wireframe glow rings
    const innerRingGeom = new THREE.RingGeometry(40, 42, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 5;
    scene.add(innerRing);

    // Playing Pitch
    const pitchGeom = new THREE.PlaneGeometry(60, 40);
    const pitchMat = new THREE.MeshBasicMaterial({
      color: 0x00d084,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const pitch = new THREE.Mesh(pitchGeom, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = -5;
    scene.add(pitch);

    // Pitch center line
    const pitchOutlineGeom = new THREE.EdgesGeometry(pitchGeom);
    const pitchOutlineMat = new THREE.LineBasicMaterial({ color: 0x00d084, transparent: true, opacity: 0.4 });
    const pitchOutline = new THREE.LineSegments(pitchOutlineGeom, pitchOutlineMat);
    pitchOutline.rotation.x = -Math.PI / 2;
    pitchOutline.position.y = -4.9;
    scene.add(pitchOutline);

    // --- Crowd Particle Flow System ---
    const particleCount = 600;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Store particle velocity & angles
    const velocities: { radius: number; angle: number; y: number; speed: number; dirY: number }[] = [];

    const cyan = new THREE.Color(0x00e5ff);
    const blue = new THREE.Color(0x3b82f6);
    const red = new THREE.Color(0xff4d6d);
    const green = new THREE.Color(0x00d084);
    const yellow = new THREE.Color(0xfacc15);

    for (let i = 0; i < particleCount; i++) {
      // Circle radius distribution
      const r = Math.random() * 25 + 40; 
      const theta = Math.random() * Math.PI * 2;
      const y = Math.random() * 15 - 5;
      
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      // Color profile
      const col = Math.random() > 0.6 ? cyan : blue;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      velocities.push({
        radius: r,
        angle: theta,
        y,
        speed: Math.random() * 0.01 + 0.005,
        dirY: Math.random() > 0.5 ? 0.2 : -0.2
      });
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleTexture = createCircleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 3,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // Helper: circular dot texture
    function createCircleTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    }

    // --- Interactive Orbit Drag Control ---
    let targetRotationX = 0.5;
    let targetRotationY = 0;
    let currentRotationX = 0.5;
    let currentRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => {
      isDragging = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      if (isDragging) {
        targetRotationY += deltaMove.x * 0.005;
        targetRotationX = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotationX + deltaMove.y * 0.005));
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    domEl.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- Animation Loop ---
    let frameId: number;
    const animate = () => {
      // Rotation interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      camera.position.x = Math.sin(currentRotationY) * Math.cos(currentRotationX) * 160;
      camera.position.z = Math.cos(currentRotationY) * Math.cos(currentRotationX) * 160;
      camera.position.y = Math.sin(currentRotationX) * 160;
      camera.lookAt(0, 0, 0);

      // Fluctuate central point light intensity
      pointLight.intensity = Math.sin(Date.now() * 0.003) * 0.5 + 2.0;

      // Animate Particles based on active Simulation state
      const posArr = particleSystem.geometry.attributes.position.array as Float32Array;
      const colArr = particleSystem.geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const vel = velocities[i];
        
        switch (simulationState) {
          case "Evacuation":
            // Flow rapidly outwards from center
            vel.radius += 1.8;
            if (vel.radius > 180) {
              vel.radius = Math.random() * 10 + 5; // respawn at center pitch
            }
            posArr[i * 3] = Math.cos(vel.angle) * vel.radius;
            posArr[i * 3 + 1] = Math.sin(vel.angle * 2) * 5 - 4;
            posArr[i * 3 + 2] = Math.sin(vel.angle) * vel.radius;

            // Paint red/orange
            colArr[i * 3] = red.r;
            colArr[i * 3 + 1] = red.g + (Math.random() * 0.2);
            colArr[i * 3 + 2] = red.b;
            break;

          case "Prediction":
            // Crowd bottlenecks at Gate 4 (Left)
            const targetX = -70;
            const targetZ = 0;
            
            // Move towards Gate 4 or circulate normally with attraction
            const px = posArr[i * 3];
            const pz = posArr[i * 3 + 2];
            const dx = targetX - px;
            const dz = targetZ - pz;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 15 && i % 3 === 0) {
              posArr[i * 3] += dx * 0.01;
              posArr[i * 3 + 2] += dz * 0.01;
            } else {
              vel.angle += vel.speed * 0.5;
              posArr[i * 3] = Math.cos(vel.angle) * vel.radius;
              posArr[i * 3 + 2] = Math.sin(vel.angle) * vel.radius;
            }
            
            // Bottleneck area lights red
            if (px < -50 && Math.abs(pz) < 25) {
              colArr[i * 3] = red.r;
              colArr[i * 3 + 1] = red.g;
              colArr[i * 3 + 2] = red.b;
            } else {
              colArr[i * 3] = cyan.r;
              colArr[i * 3 + 1] = cyan.g;
              colArr[i * 3 + 2] = cyan.b;
            }
            break;

          case "Traffic":
            // Pool in parking areas (Left and Right extremes)
            const isLeft = i % 2 === 0;
            vel.angle += vel.speed * 0.3;
            
            posArr[i * 3] = isLeft ? -90 + Math.sin(vel.angle) * 15 : 90 + Math.cos(vel.angle) * 15;
            posArr[i * 3 + 1] = -5;
            posArr[i * 3 + 2] = Math.sin(vel.angle * 2) * 15;

            colArr[i * 3] = yellow.r;
            colArr[i * 3 + 1] = yellow.g;
            colArr[i * 3 + 2] = yellow.b;
            break;

          case "Energy":
            // Sectors display warm vs cool energy profiles
            vel.angle += vel.speed;
            posArr[i * 3] = Math.cos(vel.angle) * vel.radius;
            posArr[i * 3 + 2] = Math.sin(vel.angle) * vel.radius;

            // Segment color based on position angle
            if (Math.cos(vel.angle) > 0.3) {
              colArr[i * 3] = red.r;
              colArr[i * 3 + 1] = red.g * 0.4;
              colArr[i * 3 + 2] = red.b * 0.2;
            } else {
              colArr[i * 3] = green.r;
              colArr[i * 3 + 1] = green.g;
              colArr[i * 3 + 2] = green.b;
            }
            break;

          default:
            // "Normal" or "Emergency" simple orbital flow
            vel.angle += vel.speed;
            posArr[i * 3] = Math.cos(vel.angle) * vel.radius;
            posArr[i * 3 + 1] += vel.dirY;
            if (posArr[i * 3 + 1] > 12 || posArr[i * 3 + 1] < -6) {
              vel.dirY *= -1;
            }
            posArr[i * 3 + 2] = Math.sin(vel.angle) * vel.radius;

            // Reset standard blue/cyan gradient
            const defaultCol = i % 2 === 0 ? cyan : blue;
            colArr[i * 3] = defaultCol.r;
            colArr[i * 3 + 1] = defaultCol.g;
            colArr[i * 3 + 2] = defaultCol.b;
            break;
        }
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.color.needsUpdate = true;

      // Gentle orbital rot
      stadiumBowl.rotation.z += 0.001;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- Clean Up ---
    return () => {
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("mousedown", handleMouseDown);
      domEl.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [simulationState]);

  // Fallback rendering in case WebGL fails
  if (webglError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#07111F] text-[#94A3B8] p-6 text-center border border-white/5 rounded-xl">
        <AlertTriangle className="w-12 h-12 text-[#FACC15] mb-2 animate-bounce" />
        <h4 className="text-sm font-bold text-white">WebGL Rendering Blocked</h4>
        <p className="text-xs max-w-sm mt-1 leading-relaxed">
          Browser sandbox settings or driver hardware acceleration have disabled WebGL. 
          Standard 3D twin wireframes are offline.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full min-h-[400px] relative overflow-hidden" />;
}
