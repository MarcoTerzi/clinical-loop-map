# ClinicaOS

Prototype web app for a patient-centered clinical record with:

- Supabase Auth email/password access gate
- detailed 2D body map with anterior/posterior views
- dedicated interactive 3D body map module built with Three.js
- selectable clinical regions with severity and next-step context
- simplified clinical loop: today, body map, assessment, plan, monitoring
- focused assessment, plan and PROM panels

The app is static and uses mock clinical data. It requires a Supabase project
URL and publishable key for browser-side authentication. Do not use a
`service_role` key or any Supabase secret in this app.

Role locking can be handled from Supabase Admin metadata by setting either
`app_metadata.role` or `app_metadata.clinicaos_role` to `practitioner` or
`patient`. Without that metadata, the role switch remains available for the
prototype.

Public sign-up is off by default. Create users in the Supabase dashboard, then
set `NEXT_PUBLIC_SUPABASE_ALLOW_SIGNUP=true` only for a demo where self-service
registration is acceptable.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Create `.env.local` from `.env.example` and fill it with the public Supabase
project URL and publishable key.

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
