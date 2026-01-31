# Deployment Guide

## Deploy to Render + Vercel (Free Tier)

### Prerequisites
- GitHub account
- Render account (render.com)
- Vercel account (vercel.com)
- API keys for Serper and Gemini

---

## Step 1: Deploy Backend to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configs"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Render Service**
   - **Name**: `mcp-web-search-api` (or your preferred name)
   - **Runtime**: Docker
   - **Plan**: Free
   - **Branch**: main
   - **Root Directory**: (leave blank for root)
   - **Dockerfile Path**: `./Dockerfile`
   - **Health Check Path**: `/`

4. **Add Environment Variables**
   In Render Dashboard → Environment:
   ```
   SERPER_API_KEY=your_serper_key
   GEMINI_API_KEY=your_gemini_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (takes 2-3 minutes)
   - Copy the deployed URL (e.g., `https://mcp-web-search-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `next build` (default)
   - **Output Directory**: (leave default)

3. **Add Environment Variables**
   Add this variable in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://mcp-web-search-api.onrender.com
   ```
   (Replace with your actual Render URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build (takes 1-2 minutes)
   - Your frontend is live!

---

## Step 3: Verify Deployment

1. **Test Backend Health**
   Visit: `https://your-render-url.onrender.com/`
   Should return: `{"status": "ok", "message": "Web Search Agent API is running"}`

2. **Test Frontend**
   Visit your Vercel URL
   Try searching - it should connect to your Render backend

---

## Troubleshooting

### Backend Issues
- Check Render logs in Dashboard → Logs
- Verify environment variables are set correctly
- Ensure SERPER_API_KEY and GEMINI_API_KEY are valid

### Frontend Issues
- Check Vercel deployment logs
- Verify NEXT_PUBLIC_API_URL points to your Render backend
- Check browser console for CORS errors

### CORS Errors
If you see CORS errors:
1. Update `api.py` line 26 to include your Vercel domain:
   ```python
   allow_origins=["https://your-vercel-app.vercel.app"]
   ```

---

## Free Tier Limits

**Render (Free)**
- 750 hours/month (sleeps after 15 min inactivity)
- Spins down when idle (cold start ~30 seconds)
- 512 MB RAM

**Vercel (Free)**
- 100 GB bandwidth/month
- 6000 build minutes/month
- 1000 function invocations/day (for serverless functions)

---

## Updating After Deployment

Both platforms auto-deploy on git push:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Local Development

Still works as before:
```bash
# Terminal 1 - Backend
python api.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Your local frontend will use `http://localhost:8000` automatically.
