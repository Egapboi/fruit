# Sync Script for Gardening Buddy Hackathon
$branch = git branch --show-current
Write-Host "🌲 Synchronizing branch: $branch" -ForegroundColor Green

# 1. Add and Commit local changes
Write-Host "📦 Committing local changes..." -ForegroundColor Cyan
git add .
git commit -m "wip: auto-sync commit from $branch"

# 2. Pull updates from the current branch's remote to ensure we are up to date
Write-Host "⬇️ Pulling from origin/$branch..." -ForegroundColor Cyan
git pull origin $branch

# 3. If we are NOT on main, merge changes from MAIN into current branch
if ($branch -ne "main") {
    Write-Host "🔄 Merging updates from main into $branch..." -ForegroundColor Yellow
    git fetch origin main
    git merge origin/main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ CONFLICT DETECTED! Please resolve conflicts manually, commit, and then run this script again." -ForegroundColor Red
        exit 1
    }
}

# 4. Push changes
Write-Host "⬆️ Pushing to origin/$branch..." -ForegroundColor Cyan
git push origin $branch

Write-Host "✅ Sync Complete!" -ForegroundColor Green
