SECURITY FIXES EXECUTED
- Added helmet (security headers)
- Added express-rate-limit (100 req / 15 min)
- Locked CORS to ALLOWED_ORIGIN (frontend only)
- Fixed authMiddleware Bearer parsing + clockTolerance
- Rebuilt backend .env (no hardcoded secrets)
- Created frontend/.env with VITE_API_URL
- Replaced all REACT_APP with VITE_API_URL + import.meta.env
- npm audit: 8 vulns (high/moderate) — recommend `npm audit fix` post-deploy
🤖 Generated with [Claude Code](https://claude.com/claude-code)
