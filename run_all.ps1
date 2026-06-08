Write-Host "Starting ApexStore Platform..."

Start-Process powershell -WorkingDirectory "backend" -ArgumentList "-NoExit -Command npm run start:dev" -WindowStyle Normal
Start-Process powershell -WorkingDirectory "customer" -ArgumentList "-NoExit -Command npm run dev" -WindowStyle Normal
Start-Process powershell -WorkingDirectory "admin" -ArgumentList "-NoExit -Command npm run dev" -WindowStyle Normal
Start-Process powershell -WorkingDirectory "seller" -ArgumentList "-NoExit -Command npm run dev" -WindowStyle Normal
Start-Process powershell -WorkingDirectory "vendor" -ArgumentList "-NoExit -Command npm run dev" -WindowStyle Normal

Write-Host "All services started in separate windows."
