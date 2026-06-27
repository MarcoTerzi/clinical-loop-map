"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const severityColor = {
  low: 0x22c55e,
  mid: 0xf59e0b,
  high: 0xef4444,
};

function severityLevel(value) {
  if (value >= 0.75) return "high";
  if (value >= 0.45) return "mid";
  return "low";
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.68,
    metalness: 0.04,
    transparent: options.transparent ?? true,
    opacity: options.opacity ?? 0.72,
    depthWrite: options.depthWrite ?? false,
  });
}

function addScaledSphere(group, name, color, position, scale, opacity = 0.28) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 36, 22),
    material(color, { opacity })
  );
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  group.add(mesh);
  return mesh;
}

function addTube(group, points, color, radius = 0.025, opacity = 0.38) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 42, radius, 10, false),
    material(color, { opacity })
  );
  group.add(mesh);
  return mesh;
}

function createAtlasBase(group) {
  const bone = 0x94a3b8;
  const faint = 0xcbd5e1;

  addScaledSphere(group, "cranial-reference", faint, [0, 2.55, 0], [0.38, 0.32, 0.3], 0.08);
  addScaledSphere(group, "thoracic-reference", faint, [0, 0.85, 0], [0.88, 1.06, 0.36], 0.06);
  addScaledSphere(group, "pelvic-reference", faint, [0, -1.35, 0], [0.78, 0.44, 0.3], 0.07);

  addTube(
    group,
    [
      [0, 2.1, 0.03],
      [0.03, 1.35, 0.05],
      [0, 0.5, 0.08],
      [-0.02, -0.35, 0.06],
      [0, -1.2, 0.03],
    ],
    bone,
    0.045,
    0.55
  );

  for (let i = 0; i < 18; i += 1) {
    const y = 1.95 - i * 0.17;
    const vertebra = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.055, 24),
      material(0xe2e8f0, { opacity: 0.58 })
    );
    vertebra.rotation.x = Math.PI / 2;
    vertebra.position.set(0, y, 0.07);
    group.add(vertebra);
  }

  for (let i = 0; i < 7; i += 1) {
    const y = 1.22 - i * 0.2;
    const span = 0.42 + i * 0.065;
    addTube(group, [[0, y, 0.04], [-span, y - 0.03, -0.12], [-span - 0.34, y - 0.12, -0.02]], bone, 0.018, 0.36);
    addTube(group, [[0, y, 0.04], [span, y - 0.03, -0.12], [span + 0.34, y - 0.12, -0.02]], bone, 0.018, 0.36);
  }

  addTube(group, [[-0.8, 1.4, 0.02], [-0.25, 1.25, 0.12], [0.25, 1.25, 0.12], [0.8, 1.4, 0.02]], bone, 0.035, 0.46);
  addTube(group, [[-0.82, -1.22, 0], [-0.34, -1.52, 0.08], [0, -1.58, 0.1], [0.34, -1.52, 0.08], [0.82, -1.22, 0]], bone, 0.052, 0.48);

  addTube(group, [[-0.68, -1.65, 0.02], [-0.8, -2.18, 0.02], [-0.9, -2.82, 0.02], [-0.94, -3.38, 0.02]], 0xb6c2d1, 0.05, 0.28);
  addTube(group, [[0.68, -1.65, 0.02], [0.8, -2.18, 0.02], [0.9, -2.82, 0.02], [0.94, -3.38, 0.02]], 0xb6c2d1, 0.05, 0.28);
  addTube(group, [[-1.02, 1.2, 0.02], [-1.35, 0.52, 0], [-1.42, -0.3, 0.02]], 0xb6c2d1, 0.04, 0.22);
  addTube(group, [[1.02, 1.2, 0.02], [1.35, 0.52, 0], [1.42, -0.3, 0.02]], 0xb6c2d1, 0.04, 0.22);
}

function createRegionMesh(region, selected) {
  const level = severityLevel(region.severity);
  const color = severityColor[level];
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 42, 24),
    material(color, { opacity: selected ? 0.96 : 0.72, depthWrite: true })
  );
  mesh.position.set(...region.position);
  mesh.scale.set(...region.scale);
  mesh.userData.regionId = region.id;
  mesh.userData.kind = "region";

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 42, 24),
    material(color, { opacity: selected ? 0.2 : 0.08 })
  );
  halo.position.copy(mesh.position);
  halo.scale.copy(mesh.scale).multiplyScalar(selected ? 1.22 : 1.08);
  halo.userData.regionId = region.id;

  return [mesh, halo];
}

export default function BodyMap3D({ regions, selectedId, onSelect, activeTypes }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const regionMapRef = useRef(new Map());
  const [ready, setReady] = useState(false);
  const filteredRegions = useMemo(
    () => regions.filter((region) => activeTypes.has(region.type)),
    [regions, activeTypes]
  );

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const root = new THREE.Group();
    const base = new THREE.Group();
    const regionsGroup = new THREE.Group();
    const pickables = [];
    const pointerState = { down: false, moved: false, x: 0, y: 0 };

    scene.add(root);
    root.add(base);
    root.add(regionsGroup);
    root.rotation.x = -0.08;
    root.rotation.y = -0.24;

    createAtlasBase(base);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c0cc, 2.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9bb8ff, 1.2);
    fill.position.set(-3, 1, 4);
    scene.add(fill);

    camera.position.set(0, -0.28, 12);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    function resize() {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(420, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function rebuildRegions() {
      regionMapRef.current.clear();
      pickables.splice(0, pickables.length);
      regionsGroup.clear();

      filteredRegions.forEach((region) => {
        const [mesh, halo] = createRegionMesh(region, region.id === selectedId);
        regionMapRef.current.set(region.id, mesh);
        regionsGroup.add(halo);
        regionsGroup.add(mesh);
        pickables.push(mesh);
      });
    }

    function pick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      renderer.domElement.style.cursor = hit ? "pointer" : pointerState.down ? "grabbing" : "grab";
      return hit?.object?.userData?.regionId || null;
    }

    function onPointerDown(event) {
      pointerState.down = true;
      pointerState.moved = false;
      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      renderer.domElement.setPointerCapture?.(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    }

    function onPointerMove(event) {
      if (pointerState.down) {
        const dx = event.clientX - pointerState.x;
        const dy = event.clientY - pointerState.y;
        if (Math.abs(dx) + Math.abs(dy) > 2) pointerState.moved = true;
        root.rotation.y += dx * 0.008;
        root.rotation.x = Math.max(-0.45, Math.min(0.36, root.rotation.x + dy * 0.004));
        pointerState.x = event.clientX;
        pointerState.y = event.clientY;
      } else {
        pick(event);
      }
    }

    function onPointerUp(event) {
      const id = pointerState.moved ? null : pick(event);
      if (id) onSelect(id);
      pointerState.down = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
      renderer.domElement.style.cursor = "grab";
    }

    function onWheel(event) {
      event.preventDefault();
      camera.position.z = Math.max(6.8, Math.min(14, camera.position.z + event.deltaY * 0.004));
    }

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      base.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }

    resize();
    rebuildRegions();
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);
    animate();
    setReady(true);

    mount.__atlas = { root, camera, rebuildRegions };

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((item) => item.dispose?.());
        else object.material?.dispose?.();
      });
      renderer.dispose();
      delete mount.__atlas;
    };
  }, [filteredRegions, onSelect, selectedId]);

  function resetView() {
    const atlas = mountRef.current?.__atlas;
    if (!atlas) return;
    atlas.root.rotation.x = -0.08;
    atlas.root.rotation.y = -0.24;
    atlas.camera.position.z = 12;
  }

  return (
    <div className="atlas3d-shell">
      <div className="atlas3d-canvas" ref={mountRef} aria-label="Modulo body map 3D" />
      {!ready && <div className="atlas3d-loading">Caricamento body map</div>}
      <div className="atlas3d-tools">
        <button type="button" onClick={resetView}>
          reset vista
        </button>
      </div>
    </div>
  );
}
