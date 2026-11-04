import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  RefreshCcw,
} from 'lucide-react';
import type { Project } from '../../types';

interface GarmentViewer3DProps {
  project: Project;
}

export const GarmentViewer3D: React.FC<GarmentViewer3DProps> = ({ project }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeView, setActiveView] = useState<'front' | 'back' | 'closeup'>('front');
  const [isBlueprint, setIsBlueprint] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(5.5);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const garmentMeshRef = useRef<THREE.Mesh | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Load SVG/Image string into Three.js Texture Canvas
  const loadTexture = (imgUrl: string, callback: (texture: THREE.CanvasTexture) => void) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0B0D10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      callback(texture);
    };
    img.src = imgUrl;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const mount = mountRef.current;
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Mobile adaptive distance)
    const isMobile = width < 640;
    const initialZoom = isMobile ? zoomLevel + 1.2 : zoomLevel;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, initialZoom);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile;
    mount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(4, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xbfc3c8, 1.8, 10);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // 5. Floor Reflection
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.8;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 6. 3D Garment Mesh Group
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;

    const bodyGeo = new THREE.CylinderGeometry(1.05, 1.15, 2.3, 32, 16, true);
    const garmentMat = new THREE.MeshStandardMaterial({
      color: 0x12151a,
      roughness: 0.6,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    const garmentMesh = new THREE.Mesh(bodyGeo, garmentMat);
    garmentMesh.castShadow = true;
    garmentMeshRef.current = garmentMesh;
    garmentGroup.add(garmentMesh);

    // Sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.9, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    leftSleeve.rotation.z = Math.PI / 3.2;
    leftSleeve.position.set(-1.15, 0.7, 0);
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    rightSleeve.rotation.z = -Math.PI / 3.2;
    rightSleeve.position.set(1.15, 0.7, 0);
    garmentGroup.add(rightSleeve);

    scene.add(garmentGroup);

    // 7. Interactive Orbit Controls (Mouse Drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !garmentGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      garmentGroup.rotation.y += deltaX * 0.008;
      garmentGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 8. Render Animation Loop
    let animId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Texture & View Angle based on state
  useEffect(() => {
    if (!garmentMeshRef.current || !garmentGroupRef.current) return;

    let targetImg = project.mockups.heroMockup || project.finalDesigns.frontArtwork;
    let targetRotationY = 0;

    if (activeView === 'back') {
      targetImg = project.finalDesigns.backArtwork || project.mockups.backMockup || targetImg;
      targetRotationY = Math.PI;
    } else if (activeView === 'closeup' && project.finalDesigns.closeups.length > 0) {
      targetImg = project.finalDesigns.closeups[0];
    }

    loadTexture(targetImg, (texture) => {
      if (garmentMeshRef.current) {
        const mat = garmentMeshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = texture;
        mat.wireframe = isBlueprint;
        mat.needsUpdate = true;
      }
    });

    // Rotate camera to view front/back smoothly
    if (garmentGroupRef.current) {
      garmentGroupRef.current.rotation.y = targetRotationY;
      garmentGroupRef.current.rotation.x = 0;
    }
  }, [activeView, isBlueprint, project]);

  // Update Camera Zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Fallback 2D Render
  if (!webglSupported) {
    const currentFallbackImg =
      activeView === 'back'
        ? project.finalDesigns.backArtwork || project.mockups.backMockup || project.finalDesigns.frontArtwork
        : project.mockups.heroMockup || project.finalDesigns.frontArtwork;

    return (
      <div className="relative w-full h-[540px] bg-[#0D0F12] border border-[#262626] rounded-xl overflow-hidden flex flex-col justify-between p-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#787F8A]">
          <span>[ 2D CASE STUDY GALLERY ]</span>
          <span>{project.brandName}</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-6">
          <img
            src={currentFallbackImg}
            alt={project.title}
            className="max-h-[380px] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#262626]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border ${
                activeView === 'front' ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#12151A] text-[#787F8A]'
              }`}
            >
              Front Design
            </button>
            {project.finalDesigns.backArtwork && (
              <button
                onClick={() => setActiveView('back')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border ${
                  activeView === 'back' ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#12151A] text-[#787F8A]'
                }`}
              >
                Back Design
              </button>
            )}
          </div>

          <span className="text-xs font-mono text-[#787F8A]">1:1 PRODUCTION SPEC</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-cursor="drag"
      className={`relative w-full ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen bg-[#08090B]' : 'h-[550px] sm:h-[620px] bg-[#08090B] border border-[#262626] rounded-xl'
      } overflow-hidden shadow-2xl flex flex-col justify-between p-6 transition-all duration-300`}
    >
      {/* Top Spec Header HUD */}
      <div className="relative z-20 flex items-center justify-between text-xs font-mono text-[#787F8A] bg-[#08090B]/80 backdrop-blur-md p-3 rounded-lg border border-[#262626]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] animate-pulse" />
          <span className="text-[#FFFFFF] font-bold uppercase tracking-widest">
            3D GARMENT INSPECTION VIEWER
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#525866]">
          <span>GARMENT: {project.projectOverview.garmentType || project.category}</span>
          <span>•</span>
          <span>REF: {project.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Center 3D Mounting Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Floating Inspection Controls */}
      <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#08090B]/80 backdrop-blur-md p-3 rounded-lg border border-[#262626]">
        {/* View Angle Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('front')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
              activeView === 'front'
                ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626]'
            }`}
          >
            Front View
          </button>

          {project.finalDesigns.backArtwork && (
            <button
              type="button"
              onClick={() => setActiveView('back')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                activeView === 'back'
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626]'
              }`}
            >
              Back View (180°)
            </button>
          )}

          {project.finalDesigns.closeups.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveView('closeup')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                activeView === 'closeup'
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626]'
              }`}
            >
              Close-up Spec
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsBlueprint(!isBlueprint)}
            className={`p-2 rounded border transition-all ${
              isBlueprint
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border-[#262626]'
            }`}
            title="Toggle Wireframe Blueprint Spec Mode"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.8, 3))}
            className="p-2 bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626] rounded transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.8, 8))}
            className="p-2 bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626] rounded transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel(5.5)}
            className="p-2 bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626] rounded transition-all"
            title="Reset Camera Zoom"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-[#12151A] text-[#787F8A] hover:text-[#FFFFFF] border border-[#262626] rounded transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
