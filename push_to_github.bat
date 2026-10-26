@echo off
title Lumixora Notes AI - GitHub Push
cd /d "C:\Users\ECS LAB3\Downloads\NOTES"
echo ========================================================
echo  Lumixora Notes AI - Push to GitHub (249XA33106-BIT)
echo ========================================================
echo.
echo Current Remote:
git remote -v
echo.
echo Pushing branch 'main' to GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ----------------------------------------------------
    echo If the repository NOTES does not exist on GitHub yet:
    echo 1. Create it at: https://github.com/new (Name: NOTES)
    echo 2. Or if you want to push to lumixora23, type:
    echo    git remote set-url origin https://github.com/249XA33106-BIT/lumixora23.git
    echo    git push -u origin main --force
    echo ----------------------------------------------------
)
pause
