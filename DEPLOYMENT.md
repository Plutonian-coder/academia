# Deployment Guide (Vercel)

This project is structured as a **Monorepo** containing a Next.js Frontend and a FastAPI Backend. For the best stability and scalability on Vercel, we recommend deploying them as **Two Separate Projects**.

## Prerequisites
1. [Vercel Account](https://vercel.com)
2. GitHub/GitLab/Bitbucket repository with this code pushed.

---

## Part 1: Deploying the Backend (Python)

1. **Self-Check**: Ensure `yabatech_expanded_data.csv` is inside the `backend/` folder (we have handled this for you).
2. Go to your Vercel Dashboard and click **"Add New..." -> "Project"**.
3. Import your repository.
4. **Configure Project**:
   - **Root Directory**: Click "Edit" and select `backend`.
   - **Framework Preset**: Select "Other".
   - **Build Command**: Leave empty (Vercel detects `api` or `vercel.json` automatically).
   - **Output Directory**: Leave empty.
5. Click **Deploy**.
6. Once deployed, copy the **Deployment Domain** (e.g., `https://academia-backend.vercel.app`).
   - *Test it*: Visit `https://academia-backend.vercel.app/docs` to see the FastAPI Swagger UI.

---

## Part 2: Deploying the Frontend (Next.js)

1. Go to Vercel Dashboard and click **"Add New..." -> "Project"**.
2. Import the **same repository** again.
3. **Configure Project**:
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Framework Preset**: Next.js (Should auto-detect).
4. **Environment Variables**:
   - Expand the "Environment Variables" section.
   - Key: `
   
   
   `
   - Value: The Backend URL from Part 1 (e.g., `https://academia-backend.vercel.app`).
     - *Important*: Do not add a trailing slash `/`.
5. Click **Deploy**.

---

## Part 3: Verification

1. Open your new Frontend URL (e.g., `https://academia-frontend.vercel.app`).
2. Verification Steps:
   - Dashboard loads with charts.
   - "Deep Analytics" modules (Gatekeeper, Quadrant) appear.
   - Student Inspector search works.

## Troubleshooting

### "500 Internal Server Error" on Backend
- **Cause**: Missing dependencies or `pandas` memory limit.
- **Fix**: Check Vercel Logs. If `pandas` is too heavy, consider deploying the backend to **Render** (free tier) or **Railway** and updating the Frontend's `NEXT_PUBLIC_API_URL`.

### "CORS Error" on Frontend
- **Cause**: Backend doesn't allow the Frontend domain.
- **Fix**: Update `backend/main.py` in your code (and redeploy backend):
  ```python
  allow_origins=[
      "https://your-frontend-domain.vercel.app", # Add your actual Vercel URL
      "http://localhost:3000"
  ]
  ```
