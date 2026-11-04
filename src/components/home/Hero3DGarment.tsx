import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Shirt } from 'lucide-react';
import { generateArtworkSvg } from '../../data/artworkGenerator';

interface ArtworkOption {
  id: string;
  name: string;
  brand: string;
  artworkSvg: string;
  backArtworkSvg?: string;
  type: 't-shirt' | 'jacket' | 'jersey';
}

const ARTWORK_OPTIONS: ArtworkOption[] = [
  {
    id: 'rebel-x-makan',
    name: 'Rebel X Outfits — La - Makan Tee',
    brand: 'REBEL X OUTFITS',
    artworkSvg: generateArtworkSvg('cultural-dragon', 'REBEL X MAKAN', 'front'),
    backArtworkSvg: generateArtworkSvg('cultural-dragon', 'REBEL X MAKAN', 'back'),
    type: 't-shirt',
  },
  {
    id: 'bikhta',
    name: 'Bikhta Persian Rug Tee',
    brand: 'NOCTURNE ATELIER',
    artworkSvg: generateArtworkSvg('cultural-dragon', 'BIKHTA PERSIAN', 'front'),
    backArtworkSvg: generateArtworkSvg('cultural-dragon', 'BIKHTA PERSIAN', 'back'),
    type: 't-shirt',
  },
  {
    id: 'truck-art',
    name: 'Truck Art Calligraphy Tee',
    brand: 'VANGUARD LABS',
    artworkSvg: generateArtworkSvg('cultural-dragon', 'TRUCK ART', 'front'),
    backArtworkSvg: generateArtworkSvg('cultural-dragon', 'TRUCK ART', 'back'),
    type: 't-shirt',
  },
  {
    id: 'palestine',
    name: 'Palestine Olive Bomber',
    brand: 'KAIZEN STREETWEAR',
    artworkSvg: generateArtworkSvg('cultural-dragon', 'PALESTINE BOMBER', 'front'),
    backArtworkSvg: generateArtworkSvg('cultural-dragon', 'PALESTINE BOMBER', 'back'),
    type: 'jacket',
  },
  {
    id: 'elzari',
    name: 'ELZARI Cyber Spider Jersey',
    brand: 'AURA CLOTHING CO',
    artworkSvg: generateArtworkSvg('jersey-racing', 'ELZARI SPIDER', 'front'),
    backArtworkSvg: generateArtworkSvg('jersey-racing', 'ELZARI SPIDER', 'back'),
    type: 'jersey',
  },
];

export const Hero3DGarment: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkOption>(ARTWORK_OPTIONS[0]);
  const [showBack, setShowBack] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const garmentMeshRef = useRef<THREE.Mesh | null>(null);
  const textureMapRef = useRef<THREE.CanvasTexture | null>(null);

  // Helper to render SVG string into an Image / Texture Canvas
  const createTextureFromSvg = (svgString: string, callback: (texture: THREE.CanvasTexture) => void) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#090B0E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      URL.revokeObjectURL(url);
      callback(texture);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL Availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 550;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Mobile adaptive distance)
    const isMobile = width < 640;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, isMobile ? 7.0 : 5.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.appendChild(renderer.domElement);

    // 4. Lighting (Studio Rim & Key Specular)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xbfc3c8, 2, 10);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x525866, 0.6);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // 5. Floor Mirror Mesh
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.3,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.8;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 6. Garment Sculptural Geometry (Oversized Fashion T-Shirt / Jacket mesh simulation)
    const garmentGroup = new THREE.Group();

    // Main Torso Body
    const bodyGeo = new THREE.CylinderGeometry(1.05, 1.15, 2.2, 32, 16, true);
    // Deform body to feel like an oversized dropped-shoulder garment
    const posAttr = bodyGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const z = posAttr.getZ(i);
      const y = posAttr.getY(i);
      // Subtle cloth curvature depth
      posAttr.setZ(i, z * 0.45 + Math.sin(y * 2) * 0.04);
    }
    bodyGeo.computeVertexNormals();

    // Default Material
    const garmentMat = new THREE.MeshStandardMaterial({
      color: 0x12151a,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const garmentMesh = new THREE.Mesh(bodyGeo, garmentMat);
    garmentMesh.castShadow = true;
    garmentMesh.receiveShadow = true;
    garmentMeshRef.current = garmentMesh;
    garmentGroup.add(garmentMesh);

    // Sleeve Geometry Left & Right
    const sleeveGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.9, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    leftSleeve.rotation.z = Math.PI / 3.2;
    leftSleeve.position.set(-1.15, 0.7, 0);
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    rightSleeve.rotation.z = -Math.PI / 3.2;
    rightSleeve.position.set(1.15, 0.7, 0);
    garmentGroup.add(rightSleeve);

    // Collar Ribbing Ring
    const collarGeo = new THREE.TorusGeometry(0.55, 0.05, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: 0.8 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 1.1, 0);
    garmentGroup.add(collarMesh);

    scene.add(garmentGroup);

    // 7. Floating Spec Wireframes & Particles
    const specGroup = new THREE.Group();

    // Floating Spec Sheet 1
    const sheetGeo = new THREE.PlaneGeometry(0.8, 1.1);
    const sheetMat = new THREE.MeshBasicMaterial({
      color: 0xbfc3c8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const specSheet1 = new THREE.Mesh(sheetGeo, sheetMat);
    specSheet1.position.set(-2.2, 0.8, -1);
    specSheet1.rotation.y = 0.4;
    specGroup.add(specSheet1);

    // Floating Spec Sheet 2
    const specSheet2 = new THREE.Mesh(sheetGeo, sheetMat);
    specSheet2.position.set(2.3, -0.4, -0.8);
    specSheet2.rotation.y = -0.3;
    specGroup.add(specSheet2);

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xbfc3c8,
      transparent: true,
      opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    scene.add(specGroup);

    // 8. Animation & Interaction Loop
    let targetRotationY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (garmentGroup) {
        // Continuous slow rotation if enabled
        if (isRotating) {
          targetRotationY += 0.006;
        }

        // Target angle based on showBack state
        const targetAngle = showBack ? Math.PI : 0;
        garmentGroup.rotation.y += (targetRotationY + targetAngle - garmentGroup.rotation.y) * 0.05;

        // Subtle floating bob
        garmentGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;

        // Mouse Parallax
        garmentGroup.rotation.x += (targetMouseY - garmentGroup.rotation.x) * 0.05;
        camera.position.x += (targetMouseX * 1.2 - camera.position.x) * 0.04;
      }

      // Parallax spec elements
      specGroup.rotation.y = elapsedTime * 0.1;
      particlesMesh.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Texture when selected Artwork or Front/Back state changes
  useEffect(() => {
    if (!garmentMeshRef.current) return;

    const currentSvg =
      showBack && selectedArtwork.backArtworkSvg
        ? selectedArtwork.backArtworkSvg
        : selectedArtwork.artworkSvg;

    createTextureFromSvg(currentSvg, (texture) => {
      textureMapRef.current = texture;
      if (garmentMeshRef.current) {
        const mat = garmentMeshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = texture;
        mat.needsUpdate = true;
      }
    });
  }, [selectedArtwork, showBack]);

  // Fallback 2D Render if WebGL fails
  if (!webglSupported) {
    const currentFallbackImg =
      showBack && selectedArtwork.backArtworkSvg
        ? selectedArtwork.backArtworkSvg
        : selectedArtwork.artworkSvg;

    return (
      <div className="relative w-full h-[500px] bg-[#0D0F12] border border-[#262626] rounded-xl overflow-hidden flex flex-col justify-between p-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#787F8A]">
          <span>[ 2D SHOWROOM PREVIEW ]</span>
          <span>{selectedArtwork.brand}</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-4">
          <img
            src={currentFallbackImg}
            alt={selectedArtwork.name}
            className="max-h-[360px] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#262626]">
          <div className="flex items-center gap-2">
            {ARTWORK_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedArtwork(opt)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded border ${
                  selectedArtwork.id === opt.id
                    ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                    : 'bg-[#12151A] text-[#787F8A] border-[#262626]'
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBack(!showBack)}
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#000000] border border-[#FFFFFF]/30 text-[#FFFFFF] rounded flex items-center gap-1.5"
          >
            <Shirt className="w-3.5 h-3.5" />
            {showBack ? 'Front' : 'Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] bg-[#08090B] border border-[#262626] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 group" data-cursor="drag">
      {/* Top 3D Spec Overlay HUD */}
      <div className="flex items-center justify-between text-xs font-mono text-[#787F8A] z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
          <span className="text-[#FFFFFF] font-bold">3D SCULPTURAL SHOWROOM</span>
        </div>
        <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[#525866]">
          [ DRAG TO PARALLAX // REALTIME TEXTURE ]
        </span>
      </div>

      {/* Central Three.js Mounting Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Floating Interactive Controls */}
      <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#262626]/80 bg-[#08090B]/60 backdrop-blur-md p-3 rounded-lg">
        {/* Artwork Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {ARTWORK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedArtwork(opt)}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all shrink-0 ${
                selectedArtwork.id === opt.id
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'bg-[#12151A]/90 text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626]'
              }`}
            >
              {opt.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* View Toggle Controls */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded border transition-colors ${
              isRotating
                ? 'bg-[#FFFFFF]/10 border-[#FFFFFF]/40 text-[#FFFFFF]'
                : 'bg-[#12151A] border-[#262626] text-[#787F8A]'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowBack(!showBack)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#000000]/90 border border-[#FFFFFF]/40 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000] transition-all rounded"
          >
            <Shirt className="w-3.5 h-3.5" />
            {showBack ? 'View Front' : 'View Back'}
          </button>
        </div>
      </div>
    </div>
  );
};
