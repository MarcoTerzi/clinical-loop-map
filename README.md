# ClinicaOS

Prototype web app for a patient-centered clinical record with:

- detailed 2D body map with anterior/posterior views
- dedicated interactive 3D body map module built with Three.js
- selectable clinical regions with severity and next-step context
- simplified clinical loop: today, body map, assessment, plan, monitoring
- focused assessment, plan and PROM panels

The app is static and uses mock clinical data. It does not require a database,
server secrets or runtime environment variables.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Static build

```bash
npm run build
```

The exported site is generated in `out/`.

## GitHub Pages build

```bash
npm run build:pages
```

This sets the base path to `/clinical-loop-map/` for project Pages hosting.
