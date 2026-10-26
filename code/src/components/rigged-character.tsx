"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { asset } from "@/lib/asset";

type Props = { stage: number; item: number };

const views = [
  { distance: 3.35, targetY: 1.12, x: 0 },
  { distance: 2.8, targetY: 1.35, x: 0.05 },
  { distance: 2.35, targetY: 1.4, x: -0.08 },
  { distance: 1.55, targetY: 1.61, x: 0.17 },
];

const stageClips = ["Idle", "Wave", "Turn left 45", "Turn right 45"];

export function RiggedCharacter({ stage, item }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const state = useRef({ stage, item });
  state.current = { stage, item };

  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const container = element;
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
    renderer.toneMappingExposure = 1.5;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 30);
    camera.position.set(0, 1.12, views[0].distance);
    const avatar = new THREE.Group();
    scene.add(avatar);
    const disposeFigure = (root: THREE.Object3D) => {
      const textures = new Set<THREE.Texture>();
      root.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) {
            for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
            material.dispose();
          }
        }
      });
      for (const texture of textures) texture.dispose();
    };
    const hemi = new THREE.HemisphereLight(0xf5fffd, 0x5a7e84, 3.2);
    const key = new THREE.DirectionalLight(0xffffff, 3.6);
    key.position.set(-2, 5, 5);
    const rim = new THREE.DirectionalLight(0x70e8df, 2.5);
    rim.position.set(2, 3, -3);
    scene.add(hemi, key, rim);

    let mixer: THREE.AnimationMixer | undefined;
    let actions = new Map<string, THREE.AnimationAction>();
    let active: THREE.AnimationAction | undefined;
    let loaded = false;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load(asset("/models/future-self-free-rig.glb"), (gltf) => {
      if (disposed) {
        disposeFigure(gltf.scene);
        return;
      }
      const figure = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(figure);
      const height = bounds.max.y - bounds.min.y;
      figure.scale.setScalar(1.78 / height);
      figure.position.y = -bounds.min.y * figure.scale.y;
      avatar.add(figure);
      mixer = new THREE.AnimationMixer(figure);
      actions = new Map(gltf.animations.map((clip) => [clip.name, mixer!.clipAction(clip)]));
      loaded = true;
      element.dataset.model = "ready";
      playPose();
    }, undefined, () => {
      element.dataset.model = "error";
    });

    let previous = "";
    function playPose() {
      if (!loaded) return;
      const { stage, item } = state.current;
      const id = `${stage}:${item}`;
      if (id === previous) return;
      previous = id;
      const name = stage === 1 && item > 0
        ? item % 2 ? "Turn right 45" : "Turn left 45"
        : stage === 2 && item > 0
          ? item % 2 ? "Wave" : "Turn right 45"
          : stageClips[stage];
      const next = [...actions].find(([key]) => key.startsWith(name))?.[1];
      if (!next) return;
      active?.fadeOut(reducedMotion.matches ? 0.01 : 0.24);
      next.reset();
      next.enabled = true;
      next.paused = false;
      const idleLoop = stage === 0 && !reducedMotion.matches;
      next.setLoop(idleLoop ? THREE.LoopRepeat : THREE.LoopOnce, idleLoop ? Infinity : 1);
      next.clampWhenFinished = !idleLoop;
      next.fadeIn(reducedMotion.matches ? 0.01 : 0.24).play();
      if (reducedMotion.matches) {
        next.time = stage === 0 ? 0 : next.getClip().duration;
        mixer?.update(0);
        next.paused = true;
      }
      active = next;
      container.dataset.pose = id;
      container.dataset.action = name;
    }

    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.05);
      playPose();
      mixer?.update(delta);
      const { stage, item } = state.current;
      const view = views[stage];
      const easing = reducedMotion.matches ? 1 : 0.07;
      camera.position.z += (view.distance - camera.position.z) * easing;
      camera.position.y += (view.targetY - camera.position.y) * easing;
      camera.position.x += (view.x - camera.position.x) * easing;
      camera.lookAt(view.x, view.targetY, 0);
      avatar.rotation.y += ((stage === 2 ? -0.12 : 0) + (item % 3 - 1) * 0.035 - avatar.rotation.y) * easing;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      mixer?.stopAllAction();
      disposeFigure(avatar);
      renderer.dispose();
      if (renderer.domElement.parentElement === element) element.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={holder} className="character-canvas rigged-character" role="img" aria-label="免费骨骼人物原型，会随板块切换执行关节动作并停在新姿态" />;
}
