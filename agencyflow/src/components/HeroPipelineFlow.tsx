'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroPipelineFlowProps {
  isAuthenticated?: boolean;
}

interface PipelineStep {
  icon: string;
  label: string;
  sub: string;
  color: string;
  active?: boolean;
}

export default function HeroPipelineFlow({ isAuthenticated = false }: HeroPipelineFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const steps: PipelineStep[] = [
    { icon: '◇', label: 'Lead', sub: 'captured', color: '#2dd4bf' },
    { icon: '▤', label: 'Proposal', sub: 'sent → viewed', color: '#a855f7', active: true },
    { icon: '✓', label: 'Client', sub: 'signed', color: '#60a5fa' },
    { icon: '▦', label: 'Project', sub: 'kicked off', color: '#34d399' },
    { icon: '$', label: 'Invoice', sub: 'paid', color: '#f472b6' },
  ];

  useEffect(() => {
    let animId: number;
    let isCancelled = false;
    let renderer: any = null;
    let onResize: () => void;
    let onMouseMove: (e: MouseEvent) => void;

    const initScene = (THREE: any) => {
      const containerEl = containerRef.current;
      if (!containerEl || isCancelled) return;

      const width = containerEl.clientWidth || 500;
      const height = containerEl.clientHeight || 450;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
      camera.position.z = 8.6;
      camera.position.y = 0.4;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Append canvas
      containerEl.innerHTML = '';
      containerEl.appendChild(renderer.domElement);

      // Lighting System
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xa78bfa, 2.5);
      dirLight1.position.set(5, 8, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x2dd4bf, 2.0);
      dirLight2.position.set(-5, -4, 3);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xc084fc, 3.2, 14);
      pointLight.position.set(0, 0, 2);
      scene.add(pointLight);

      // Group hierarchy for mouse tracking & continuous spin
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // Central Deal Flow Core (Translucent faceted crystal)
      const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x312e81,
        specular: 0x93c5fd,
        shininess: 90,
        wireframe: false,
        transparent: true,
        opacity: 0.85,
        flatShading: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);

      // Inner Glowing Jewel
      const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
      const innerMat = new THREE.MeshPhongMaterial({
        color: 0x2dd4bf,
        emissive: 0x0f766e,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.95,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      mainGroup.add(innerMesh);

      // Orbiting pipeline rings representing stages
      const ringData = [
        { radius: 2.5, tube: 0.024, color: 0xa855f7, tiltX: 0.6, tiltY: 0.2 },
        { radius: 3.1, tube: 0.02, color: 0x2dd4bf, tiltX: -0.4, tiltY: 0.8 },
        { radius: 3.7, tube: 0.016, color: 0x818cf8, tiltX: 0.8, tiltY: -0.5 },
      ];

      ringData.forEach((data) => {
        const torusGeo = new THREE.TorusGeometry(data.radius, data.tube, 16, 90);
        const torusMat = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.65,
          transparent: true,
          opacity: 0.75,
        });
        const ring = new THREE.Mesh(torusGeo, torusMat);
        ring.rotation.x = data.tiltX;
        ring.rotation.y = data.tiltY;
        mainGroup.add(ring);
      });

      // 5 Orbiting Milestone Spheres
      const stageNodes: any[] = [];
      const stageColors = [0x2dd4bf, 0xa855f7, 0x60a5fa, 0x34d399, 0xf472b6];

      for (let i = 0; i < 5; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.18, 24, 24);
        const nodeMat = new THREE.MeshPhongMaterial({
          color: stageColors[i],
          emissive: stageColors[i],
          emissiveIntensity: 0.85,
          shininess: 100,
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.userData = {
          angle: (i / 5) * Math.PI * 2,
          radius: 2.75 + (i % 2) * 0.7,
          speed: 0.012 + i * 0.0025,
          orbitY: (i - 2) * 0.38,
        };
        mainGroup.add(node);
        stageNodes.push(node);
      }

      // Background floating particle dust
      const particleCount = 100;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 14;
        particlePos[i + 1] = (Math.random() - 0.5) * 10;
        particlePos[i + 2] = (Math.random() - 0.5) * 8;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xc4b5fd,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Mouse tracking
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      onMouseMove = (e: MouseEvent) => {
        if (!containerEl) return;
        const rect = containerEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        targetX = (x / rect.width - 0.5) * 1.4;
        targetY = (y / rect.height - 0.5) * 1.4;
      };
      window.addEventListener('mousemove', onMouseMove);

      // Responsive resize
      onResize = () => {
        if (!containerEl) return;
        const w = containerEl.clientWidth || 500;
        const h = containerEl.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // Animation Loop
      const clock = new THREE.Clock();
      const tempVec = new THREE.Vector3();

      const animate = () => {
        if (isCancelled) return;
        animId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse tilt interpolation
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        mainGroup.rotation.y = elapsedTime * 0.32 + mouseX * 0.75;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.22) * 0.12 + mouseY * 0.45;

        coreMesh.rotation.y = elapsedTime * 0.4;
        coreMesh.rotation.z = Math.sin(elapsedTime * 0.45) * 0.18;

        innerMesh.rotation.y = -elapsedTime * 0.65;
        innerMesh.rotation.x = elapsedTime * 0.45;

        // Pulsing breathing scale
        const scale = 1 + Math.sin(elapsedTime * 1.6) * 0.045;
        innerMesh.scale.set(scale, scale, scale);

        // Orbiting stage nodes & Projected 3D Billboard Badges
        const currentWidth = containerEl.clientWidth || 500;
        const currentHeight = containerEl.clientHeight || 450;

        stageNodes.forEach((node, idx) => {
          node.userData.angle += node.userData.speed;
          const a = node.userData.angle;
          const r = node.userData.radius;
          node.position.x = Math.cos(a) * r;
          node.position.z = Math.sin(a) * r;
          node.position.y = Math.sin(a * 2 + elapsedTime) * 0.32 + node.userData.orbitY;

          // Track 2D Screen Projection for HTML badge
          const badgeEl = badgeRefs.current[idx];
          if (badgeEl) {
            node.getWorldPosition(tempVec);
            tempVec.project(camera);

            const screenX = (tempVec.x * 0.5 + 0.5) * currentWidth;
            const screenY = (-(tempVec.y * 0.5) + 0.5) * currentHeight;

            // Distance depth fade (front vs back)
            const isFront = node.position.z > -0.3;
            badgeEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`;
            badgeEl.style.opacity = isFront ? '1' : '0.42';
            badgeEl.style.zIndex = isFront ? '20' : '4';
          }
        });

        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.035;

        renderer.render(scene, camera);
      };

      animate();
    };

    // Load Three.js from local vendor bundle ('self' compliant with CSP)
    if ((window as any).THREE) {
      initScene((window as any).THREE);
    } else {
      const script = document.createElement('script');
      script.src = '/vendor/three.min.js';
      script.async = true;
      script.onload = () => {
        if (!isCancelled && (window as any).THREE) {
          initScene((window as any).THREE);
        }
      };
      script.onerror = (e) => {
        console.error('Failed to load /vendor/three.min.js', e);
      };
      document.head.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (animId) cancelAnimationFrame(animId);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onResize) window.removeEventListener('resize', onResize);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="hero-pipeline-container">
      <div className="hero-pipeline-grid">
        {/* Left Column: Headline & Actions (Unchanged) */}
        <div className="hero-pipeline-text">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(208, 188, 255, 0.1)',
              border: '1px solid rgba(208, 188, 255, 0.25)',
              color: '#d0bcff',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={13} />
            Unified Agency Operating System
          </div>

          <h1>Watch a lead become revenue.</h1>

          <p>
            This is the actual path a deal takes through AgencyFlow — no step
            skipped, nothing falling through a gap between tools.
          </p>

          <div className="hero-pipeline-actions">
            <Link
              href={isAuthenticated ? '/dashboard' : '/signup'}
              className="hero-btn-primary"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Start free'}
              <ArrowRight size={16} />
            </Link>
            <a href="#features" className="hero-btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* Right Column: 3D Interactive Pipeline Core with Orbiting Stage Elements */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '470px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          {/* Three.js Canvas Container */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'grab',
              position: 'relative',
              zIndex: 10,
            }}
          />

          {/* 5 3D-Projected Billboard Labels for Orbiting Stages */}
          {steps.map((step, i) => (
            <div
              key={step.label}
              ref={(el) => {
                badgeRefs.current[i] = el;
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0,
                willChange: 'transform, opacity',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 17, 26, 0.88)',
                border: step.active
                  ? '1px solid #a78bfa'
                  : '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                boxShadow: step.active
                  ? '0 0 16px rgba(167, 139, 250, 0.4), 0 4px 14px rgba(0,0,0,0.6)'
                  : '0 4px 14px rgba(0, 0, 0, 0.5)',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.25s ease, border-color 0.25s ease',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: `${step.color}22`,
                  color: step.color,
                  border: `1px solid ${step.color}60`,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    lineHeight: 1,
                    marginTop: '2px',
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  }}
                >
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Readout Metrics Strip (Unchanged) */}
      <div className="hero-pipeline-readout">
        <div>
          <div className="readout-val teal">18 days</div>
          <div className="readout-lbl">LEAD → SIGNED</div>
        </div>
        <div>
          <div className="readout-val">50%</div>
          <div className="readout-lbl">CLOSE RATE</div>
        </div>
        <div>
          <div className="readout-val purple">$173,500</div>
          <div className="readout-lbl">IN PIPELINE NOW</div>
        </div>
        <div>
          <div className="readout-val">0</div>
          <div className="readout-lbl">TOOLS SWITCHED</div>
        </div>
      </div>
    </div>
  );
}
