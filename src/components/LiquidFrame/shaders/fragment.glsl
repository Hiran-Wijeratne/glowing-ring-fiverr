precision highp float;

#define PI 3.14159265358979323846

uniform float uTime;
uniform float uIntensity;
uniform float uAspect;
uniform float uBorderWidth;  // padding in normalised-height units (~50/height)
uniform float uRadius;       // corner radius
uniform vec2  uCoverAspect;  // Lusion's exact cover-scale for the colour UV

varying vec2 vUv;

// ── Same linearstep Lusion uses ───────────────────────────────────────────────
float linearstep(float e0, float e1, float x) {
  return clamp((x - e0) / (e1 - e0), 0.0, 1.0);
}

// ── Rounded-rectangle SDF ────────────────────────────────────────────────────
float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = vUv - 0.5;
  p.x   *= uAspect;

  float hW = uAspect * 0.5;
  float hH = 0.5;
  float bw = uBorderWidth; // ~50 / screenHeight

  // ── SDF of the viewport boundary ─────────────────────────────────────────
  // sd < 0  inside,  sd = 0  on boundary,  sd > 0  in cut corners
  float sd = sdRoundedBox(p, vec2(hW, hH), uRadius);

  // ── Two-layer glow (direct port from Lusion's AppleEfx) ──────────────────
  // Layer 1: softer quadratic falloff → visually thicker ring body
  float d  = sd + bw;
  float d1 = pow(linearstep(0.0, bw * 2.5, d), 2.0);

  // Layer 2: wide soft halo
  float d2  = sd + bw * 1.5;
  float d2f = pow(linearstep(0.0, bw * 5.5, d2), 4.0);

  float glow = (d1 + d2f * 0.6) * 5.0;

  if (glow < 0.008) discard;

  // ── Rotating colour UV (this IS the "water" motion) ──────────────────────
  float angle = uTime * -7.0;
  float ca = cos(angle), sa = sin(angle);

  // Lusion's exact: glowUv = (v_uv - 0.5) * u_coverAspect * 2.0
  vec2 guv = (vUv - 0.5) * uCoverAspect * 2.0;
  guv      = vec2(ca * guv.x - sa * guv.y,
                  sa * guv.x + ca * guv.y);
  guv      = guv * 0.5 + 0.5;
  guv      = clamp(guv, 0.0, 1.0);

  // ── 4-colour palette (Lusion's exact colours, linearised) ─────────────────
  // #ff9cff → linear (1.000, 0.334, 1.000)   pink / magenta
  // #ff9638 → linear (1.000, 0.308, 0.038)   orange
  // #ffff22 → linear (1.000, 1.000, 0.014)   yellow
  // #54ffff → linear (0.094, 1.000, 1.000)   cyan
  //
  // Grid layout (same as Lusion's lmsTexture bilinear blend):
  //   top-left : pink    top-right : orange
  //   bot-left : cyan    bot-right : yellow
  vec3 cPink   = vec3(1.000, 0.334, 1.000);
  vec3 cOrange = vec3(1.000, 0.308, 0.038);
  vec3 cCyan   = vec3(0.094, 1.000, 1.000);
  vec3 cYellow = vec3(1.000, 1.000, 0.014);

  vec3 colorTop    = mix(cPink,  cOrange, guv.x);
  vec3 colorBottom = mix(cCyan,  cYellow, guv.x);
  vec3 glowColor   = mix(colorBottom, colorTop, guv.y);

  // Cube + amplify — Lusion's exact line: glowColor *= glowColor*glowColor*2.
  glowColor = glowColor * glowColor * glowColor * 2.0;

  // ── Composite ────────────────────────────────────────────────────────────
  vec3 color = glowColor * glow * uIntensity;
  color      = clamp(color, 0.0, 6.0);

  float alpha = clamp(glow * 0.85, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
