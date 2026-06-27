# ClinicaOS

Prototype web app for a patient-centered clinical record with:

- detailed 2D body map with anterior/posterior views
- 153 anatomical hotspots grouped by topographic region
- symptoms, dysfunctions, historical events, ROM and strength filters
- clinical loop: reason, assessment, plan, action, monitoring
- assessment, activity plan, PROMs, MyLab, network and assisted review panels

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
