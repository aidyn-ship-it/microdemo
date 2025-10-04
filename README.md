# Nx10 Demo — Vercel deploy

## Quick deploy
1. Go to https://vercel.com (log in with GitHub/Google).
2. Click **Add New → Project → Import** and choose **`Import Third-Party or From Template` → `Other`**.
3. Drag-and-drop this folder (or upload the zip).
4. Vercel detects a **Static** site. No build command needed. Output directory is the project root.
5. Click **Deploy**. Done.

## Files
- `index.html` – the full demo (swipe → numbers → feelings → Nx10 tagline).
- `assets/x_flat.jpeg` – flat X logo.
- `assets/x_3d.jpeg` – 3D X.
- `vercel.json` – ensures static hosting + route to index.
