/**
 * Shared geometry helpers and material constants for SpyroFans 3D components.
 * Imported by HVLSFan3D.jsx and InteractiveFan3D.jsx.
 */

import * as THREE from 'three';

// ─── Blade angles (5-blade HVLS fan) ────────────────────────────────────────

export const BLADE_ANGLES = [0, 72, 144, 216, 288];

// ─── Blade shape ─────────────────────────────────────────────────────────────
// Slender elongated profile — narrow at hub root, widens to modest mid-chord,
// slight taper toward tip. Extends in the –Y direction so that after the
// rotation applied in each component (-PI/2 + small pitch angle) the blade
// reaches outward (+Z in group space).

let _bladeShape = null;
export function getBladeShape() {
  if (_bladeShape) return _bladeShape;

  const rootHW = 0.22; // half-width at root
  const tipHW = 0.17;  // half-width at tip (slight taper)
  const len = 3.8;     // blade length
  const tipR = 0.06;   // tip rounding radius

  const s = new THREE.Shape();
  s.moveTo(-rootHW, 0);
  s.lineTo(-tipHW, len - tipR);
  // Rounded tip
  s.bezierCurveTo(
    -tipHW * 0.5, len + tipR * 0.3,
    tipHW * 0.5, len + tipR * 0.3,
    tipHW, len - tipR,
  );
  s.lineTo(rootHW, 0);
  s.closePath();

  _bladeShape = s;
  return s;
}

// ─── Tip cap shape (small extruded rectangle for InteractiveFan3D) ───────────

let _tipShape = null;
export function getTipShape() {
  if (_tipShape) return _tipShape;

  const hw = 0.195; // matches blade max half-width
  const hh = 0.055;

  const s = new THREE.Shape();
  s.moveTo(-hw, -hh);
  s.lineTo( hw, -hh);
  s.lineTo( hw,  hh);
  s.lineTo(-hw,  hh);
  s.closePath();

  _tipShape = s;
  return s;
}

// ─── Procedural brushed-aluminum roughness map ────────────────────────────────
// Fine horizontal striations baked into a canvas texture.

let _roughnessMap = null;
export function getBrushedAluminumTexture() {
  if (_roughnessMap) return _roughnessMap;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#aaa';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y++) {
    const a = 0.02 + Math.random() * 0.05;
    const v = 120 + Math.random() * 80;
    ctx.fillStyle = `rgba(${v},${v},${v},${a})`;
    ctx.fillRect(0, y, size, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  _roughnessMap = tex;
  return tex;
}

// ─── Extrude settings ─────────────────────────────────────────────────────────

/** Used by HVLSFan3D (flat ceiling fan blade) */
export const BLADE_EXTRUDE = {
  depth: 0.028,
  bevelEnabled: true,
  bevelSegments: 2,
  bevelSize: 0.008,
  bevelThickness: 0.005,
};

/** Used by InteractiveFan3D (blade body) */
export const BLADE_EXTRUDE_SETTINGS = {
  depth: 0.030,
  bevelEnabled: true,
  bevelSegments: 2,
  bevelSize: 0.007,
  bevelThickness: 0.005,
};

/** Used by InteractiveFan3D (blue tip cap) */
export const TIP_EXTRUDE_SETTINGS = {
  depth: 0.032,
  bevelEnabled: false,
};

// ─── Material constants — HVLSFan3D naming ───────────────────────────────────
// Lighter, satin-aluminum palette inspired by prev2 reference for a premium look

export const BLADE_MAT = {
  color: '#D4D8DC',
  metalness: 0.82,
  roughness: 0.28,
  clearcoat: 0.15,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1.5,
};

export const HUB_MAT = {
  color: '#E2E4E6',
  metalness: 0.7,
  roughness: 0.22,
  clearcoat: 0.25,
  clearcoatRoughness: 0.25,
  envMapIntensity: 1.3,
};

export const BRACKET_MAT = {
  color: '#C0C4C8',
  metalness: 0.85,
  roughness: 0.22,
  envMapIntensity: 1.2,
};

export const TIP_CAP_MAT = {
  color: '#007BC9',
  roughness: 0.45,
  metalness: 0.08,
  envMapIntensity: 0.5,
};

export const ROD_MAT = {
  color: '#888890',
  metalness: 0.88,
  roughness: 0.18,
  envMapIntensity: 1.0,
};

export const BOLT_MAT = {
  color: '#999',
  metalness: 0.85,
  roughness: 0.2,
};

export const SCREW_MAT = {
  color: '#777',
  metalness: 0.9,
  roughness: 0.15,
};

// ─── Material constants — InteractiveFan3D naming ────────────────────────────

export const BLADE_MATERIAL_PROPS = {
  color: '#BEC4D2',
  metalness: 0.90,
  roughness: 0.15,
  clearcoat: 0.38,
  clearcoatRoughness: 0.16,
  envMapIntensity: 2.1,
};

export const TIP_MATERIAL_PROPS = {
  color: '#007BC9',
  metalness: 0.06,
  roughness: 0.38,
  envMapIntensity: 0.9,
};

export const HUB_MATERIAL_PROPS = {
  color: '#252B38',
  metalness: 0.95,
  roughness: 0.12,
  clearcoat: 0.48,
  clearcoatRoughness: 0.09,
  envMapIntensity: 2.4,
};

export const HUB_CAP_MATERIAL_PROPS = {
  color: '#2E364A',
  metalness: 0.91,
  roughness: 0.16,
  envMapIntensity: 1.9,
};

export const ROD_MATERIAL_PROPS = {
  color: '#636A7A',
  metalness: 0.93,
  roughness: 0.17,
  envMapIntensity: 1.7,
};

export const BRAND_DISC_PROPS = {
  color: '#C41E1E',
  metalness: 0.05,
  roughness: 0.55,
  envMapIntensity: 0.6,
};
