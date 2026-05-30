precision highp float;

#define PI 3.14159265358979323846

uniform float uTime;
uniform float uIntensity;
uniform float uAspect;
uniform float uBorderWidth;
uniform float uRadius;
uniform vec2  uCoverAspect;
uniform float uAmount;
uniform float uPulse;
uniform vec2  uPulseCenter; // (1.001, 1-scrollBarCenter) — matches original

varying vec2 vUv;

float linearstep(float e0, float e1, float x) {
  return clamp((x - e0) / (e1 - e0), 0.0, 1.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  // ── Wave pulse (computed first — drives UV distortion) ───────────────────
  vec2 aspect2 = vec2(uAspect, 1.0);
  vec2 wp      = (vUv - uPulseCenter) * aspect2;
  float wl  = length(aspect2);
  float wpl = wl - length(wp);
  float wsl = 0.5 * wl;
  float wel = 0.5 * wl;
  float wtl = wl + wsl + wel;
  float wt  = uPulse * wtl - wl + wpl;
  float wave    = smoothstep(0.0, wsl, wt) * smoothstep(wsl + wel, wsl, wt) * uAmount;
  float wd      = abs(wt - wsl);
  vec2  waveDir = normalize(wp);

  // ── Wave UV distortion — ring border physically ripples ──────────────────
  vec2 distortedUv = vUv + waveDir * wave * vec2(0.01, 0.01 * uAspect);

  // ── SDF at wave-distorted position ───────────────────────────────────────
  vec2 p = distortedUv - 0.5;
  p.x *= uAspect;

  float hW = uAspect * 0.5;
  float hH = 0.5;
  float bw = uBorderWidth;

  float sd = sdRoundedBox(p, vec2(hW, hH), uRadius);

  // ── Outer ring glow layers ────────────────────────────────────────────────
  float d  = sd + bw;
  float d1 = pow(linearstep(0.0, bw * 2.5, d), 2.0);

  float d2  = sd + bw * 1.5;
  float d2f = pow(linearstep(0.0, bw * 5.5, d2), 4.0);

  float glow = (d1 + d2f * 0.6) * 5.0;

  // ── Inner scene lighting ──────────────────────────────────────────────────
  // In the original the ring composites over a lit 3D scene — the interior
  // is already bright from environment/ambient light.  We replicate this by
  // having the ring border emit light inward with an exponential falloff.
  float innerDist   = max(0.0, -sd);              // how far inside the border
  float innerFall   = exp(-innerDist / (bw * 6.0)); // exponential falloff from edge → center

  // Ambient inner fill — always present when ring is visible
  float innerAmbient = innerFall * uAmount * 0.12;

  // Inner pulse — wave sends a soft flash of light sweeping inward
  float innerPulse = innerFall * wave * 0.38;

  float innerLight = innerAmbient + innerPulse;

  // Discard pixels that contribute nothing (outer + inner combined check)
  if (glow < 0.008 && innerLight < 0.003) discard;

  // ── Rotating colour UV ───────────────────────────────────────────────────
  float angle = uTime * -5.0;
  float ca = cos(angle), sa = sin(angle);

  vec2 guv = (vUv - 0.5) * uCoverAspect * 2.0;
  guv = vec2(ca * guv.x - sa * guv.y,
             sa * guv.x + ca * guv.y);
  guv = guv * 0.5 + 0.5;
  guv = clamp(guv, 0.0, 1.0);

  vec3 cPink   = vec3(1.000, 0.334, 1.000);
  vec3 cOrange = vec3(1.000, 0.308, 0.038);
  vec3 cCyan   = vec3(0.094, 1.000, 1.000);
  vec3 cYellow = vec3(1.000, 1.000, 0.014);

  vec3 colorTop    = mix(cPink,  cOrange, guv.x);
  vec3 colorBottom = mix(cCyan,  cYellow, guv.x);
  vec3 glowColor   = mix(colorBottom, colorTop, guv.y);
  glowColor = glowColor * glowColor * glowColor * 2.0;

  // ── Composite ─────────────────────────────────────────────────────────────
  // Outer ring — base intensity
  vec3 color = uAmount * glowColor * glow * uIntensity;

  // Wave brightness boost — original uses additive d*0.25 + d2*0.25 + glowColor*0.05
  // which barely changes the already-clamped ring body.  The real visual is the
  // UV distortion above (border ripple).  We scale the original values by 2×
  // so they read on our dark background, but keep the additive (not multiplicative)
  // form so the ring body doesn't blow out.
  color += wave * (d1 * 0.38 + d2f * 0.38 + glowColor * 0.18);

  // Inner scene light — ring illuminates the space inside it
  vec3 innerColor = mix(glowColor, vec3(0.15, 0.05, 0.02), 0.5);
  color += innerColor * innerLight;

  color = clamp(color, 0.0, 6.0);

  // Alpha
  float glowLuma  = dot(glowColor, vec3(0.2126, 0.7152, 0.0722)) * glow;
  float innerLuma = dot(innerColor, vec3(0.2126, 0.7152, 0.0722)) * innerLight;
  float alpha = min(1.0, glowLuma * uAmount
                        + wave * (d1 + d2f * 0.5 + 0.05)
                        + innerLuma);

  gl_FragColor = vec4(color, alpha);
}
