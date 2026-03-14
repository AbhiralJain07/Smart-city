# SmartCity AI Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm account created
- Vercel CLI installed

## 1. Install Vercel CLI
```bash
npm i -g vercel
```

## 2. Login to Vercel
```bash
vercel login
```

## 3. Build Project
```bash
npm run build
```

## 4. Deploy to Production
```bash
vercel --prod
```

## 5. Environment Variables (Set in Vercel Dashboard)
- `NEXT_PUBLIC_APP_URL`: Your production URL
- `NEXT_PUBLIC_API_URL`: API endpoint if applicable
- `NODE_ENV`: production

## 6. Custom Domain (Optional)
```bash
vercel --prod --domain yourdomain.com
```

## 7. Deploy Preview/Staging
```bash
vercel  # Deploys to preview URL
```

## 8. View Deployment Status
```bash
vercel ls
vercel logs smart-city-app
```

## 9. Rollback (if needed)
```bash
vercel rollback smart-city-app
```

## 10. Remove Deployment (if needed)
```bash
vercel remove smart-city-app
```

## Post-Deployment Checklist
- [ ] Verify all pages load correctly
- [ ] Test contact form functionality
- [ ] Check analytics modal works
- [ ] Test responsive design on mobile
- [ ] Verify stagger testimonials display properly
- [ ] Test navigation menu functionality
- [ ] Confirm all animations work smoothly

## Troubleshooting
If deployment fails:
1. Check `next.config.js` for invalid options
2. Ensure `package.json` has correct build scripts
3. Verify all imports are using correct paths
4. Check for TypeScript compilation errors
5. Clear Next.js cache: `rm -rf .next`

## Production Optimizations
- Enable Next.js Image Optimization
- Configure proper caching headers
- Set up CDN for static assets
- Monitor performance with Vercel Analytics

## Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
