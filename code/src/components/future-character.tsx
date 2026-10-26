"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { asset } from "@/lib/asset";

type CharacterProps = { stage: number; item: number };

const poses = [
  { yaw: -0.07, lean: -0.018, head: 0, distance: 7.75, targetY: 0.03, targetX: 0 },
  { yaw: -0.31, lean: -0.075, head: -0.13, distance: 7.12, targetY: 0.12, targetX: -0.1 },
  { yaw: 0.22, lean: 0.068, head: 0.15, distance: 6.25, targetY: 0.32, targetX: 0.06 },
  { yaw: -0.13, lean: -0.03, head: -0.045, distance: 4.65, targetY: 0.97, targetX: 0.22 },
];

export function FutureCharacter({ stage, item }: CharacterProps) {
  const holder = useRef<HTMLDivElement>(null);
  const current = useRef({ stage, item });
  current.current = { stage, item };

  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      element.dataset.webgl = "unavailable";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    const group = new THREE.Group();
    scene.add(group);

    // The approved likeness is one continuous texture on a bent 3D surface.
    // This keeps the face and garment seamless while the mesh and camera animate.
    const geometry = new THREE.PlaneGeometry(3.19, 4.78, 32, 48);
    const positions = geometry.attributes.position;
    const original = new Float32Array(positions.array);
    const image = new THREE.TextureLoader().load(asset("/images/future-self-approved.webp"), () => {
      image.colorSpace = THREE.SRGBColorSpace;
      image.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    });
    const material = new THREE.MeshStandardMaterial({
      map: image, transparent: true, alphaTest: 0.01, depthWrite: false,
      side: THREE.DoubleSide, roughness: 0.9, metalness: 0,
    });
    const figure = new THREE.Mesh(geometry, material);
    figure.position.set(0, -0.08, 0.3);
    group.add(figure);

    const ambient = new THREE.HemisphereLight(0xffffff, 0x566b73, 2.6);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(-2, 4, 6);
    const rim = new THREE.DirectionalLight(0x4fcec9, 0.5);
    rim.position.set(3, 2, -2);
    scene.add(ambient, key, rim);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x98e8db, transparent: true, opacity: 0.14 });
    const rings: THREE.Mesh[] = [];
    for (const radius of [1.73, 2.05]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.005, 4, 108), ringMaterial);
      ring.position.set(0, 0.12, -0.45);
      scene.add(ring);
      rings.push(ring);
    }

    const pointer = new THREE.Vector2();
    const handlePointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        pointer.set(0, 0);
        return;
      }
      pointer.set((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("pointermove", handlePointer);
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    camera.position.set(0, 0.6, poses[0].distance);
    const clock = new THREE.Clock();
    let frame = 0;
    let headBend = 0;
    let lastTick = 0;
    let previousPose = `${current.current.stage}:${current.current.item}`;
    let transitionStart = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      const pose = poses[current.current.stage];
      const poseId = `${current.current.stage}:${current.current.item}`;
      if (poseId !== previousPose) {
        previousPose = poseId;
        transitionStart = elapsed;
        element.dataset.pose = poseId;
      }
      const easing = reducedMotion.matches ? 1 : 0.065;
      const itemShift = (current.current.item % 3 - 1) * 0.09;
      const progress = Math.min(1, (elapsed - transitionStart) / 1.15);
      const action = reducedMotion.matches ? 0 : Math.sin(progress * Math.PI) * 0.12;
      group.rotation.y += (pose.yaw + itemShift + pointer.x * 0.095 + action - group.rotation.y) * easing;
      group.rotation.z += (pose.lean - action * 0.36 - group.rotation.z) * easing;
      headBend += (pose.head + pointer.x * 0.09 - headBend) * easing;
      camera.position.z += (pose.distance - camera.position.z) * easing;
      camera.position.y += (pose.targetY + 0.65 - camera.position.y) * easing;
      camera.position.x += (pose.targetX - camera.position.x) * easing;
      camera.lookAt(pose.targetX, pose.targetY, 0);
      rings[0].rotation.z = reducedMotion.matches ? 0 : elapsed * 0.012;
      rings[1].rotation.z = reducedMotion.matches ? 0 : -elapsed * 0.009;

      // Deform the upper vertices on the same mesh: a subtle head turn without a visible seam.
      if (elapsed - lastTick > 1 / 30) {
        for (let i = 0; i < positions.count; i++) {
          const x = original[i * 3];
          const y = original[i * 3 + 1];
          const headWeight = THREE.MathUtils.smoothstep(y, -0.28, 1.24);
          positions.setXYZ(i,
            x + headWeight * (headBend * 0.3 + action * 0.16),
            y + (reducedMotion.matches ? 0 : Math.sin(elapsed * 1.25) * 0.012),
            0.23 - 0.3 * (x / 1.6) ** 2 + headWeight * x * (headBend + action) * 0.18,
          );
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        lastTick = elapsed;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      geometry.dispose();
      image.dispose();
      material.dispose();
      for (const ring of rings) ring.geometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === element) element.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={holder} className="character-canvas" role="img" aria-label="会随板块和项目改变姿态、视角与景别的未来世界交互角色" />;
}
