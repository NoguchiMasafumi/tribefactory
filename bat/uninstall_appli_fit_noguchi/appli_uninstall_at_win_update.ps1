Write-Host "--- Starting application uninstall process ---"

$AppxApps = @(
    "MSTeams",
    "Microsoft.Copilot",
    "Microsoft.BingSearch",
    "Microsoft.BingNews",
    "Microsoft.OneDrive",
    "Microsoft.PowerAutomateDesktop",
    "Microsoft.Paint",
    "Microsoft.YourPhone",
    "MicrosoftWindows.CrossDevice",
    "Microsoft.Windows.DevHome",
    "Microsoft.GetHelp",
    "Microsoft.WebMediaExtensions",
    "Microsoft.HEIFImageExtension",
    "Microsoft.ScreenSketch",
    "SynapticsIncorporated.SynapticsUtilities",
    "Clipchamp.Clipchamp",
    "Microsoft.Windows.Notepad",
    "Microsoft.549981C3F5F10",
    "Disney.37853FC22B2CE",
    "Microsoft.Todos",
    "Microsoft.MicrosoftOfficeHub",
    "Microsoft.MicrosoftSolitaireCollection",
    "SpotifyAB.SpotifyMusic",
    "Microsoft.GamingApp",
    "Microsoft.XboxGamingOverlay",
    "Microsoft.Xbox.TCUI",
    "Microsoft.XboxGameOverlay",
    "Microsoft.XboxIdentityProvider",
    "Microsoft.XboxSpeechToTextOverlay",
    "Microsoft.ZuneVideo",
    "Microsoft.WindowsCamera",
    "Microsoft.BingWeather",
    "Microsoft.Getstarted",
    "Microsoft.WindowsFeedbackHub",
    "Microsoft.Windows.Photos",
    "Microsoft.MicrosoftStickyNotes",
    "Microsoft.WindowsMaps",
    "Microsoft.ZuneMusic"
)

Write-Host "`n[1/2] Uninstalling Microsoft Store Apps (AppxPackage)..."

foreach ($App in $AppxApps) {
    Write-Host "- Processing $($App)..."
    Get-AppxPackage -AllUsers -Name $App | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
    if ($?) {
        Write-Host "  COMPLETE: $($App)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED: $($App) not found or could not be uninstalled." -ForegroundColor Yellow
    }
}


$WingetApps = @(
    # Microsoft To DoはAppxPackageとしてリストに移動しました
)

Write-Host "`n[2/2] Uninstalling winget apps..."

foreach ($App in $WingetApps) {
    Write-Host "- Processing $($App)..."
    winget uninstall $App -h --accept-source-agreements | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  COMPLETE: $($App)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED: $($App) not found or could not be uninstalled. Exit Code: $($LASTEXITCODE)" -ForegroundColor Yellow
    }
}


# --------------------------------------------------------------------------------------------------
Write-Host "`n[3/3] Applying Registry modifications and restarting Explorer..."

# Set registry keys to disable dynamic search features
REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\SearchSettings" /v IsDynamicSearchBoxEnabled /t REG_DWORD /d 0 /f | Out-Null
REG ADD "HKCU\Software\Policies\Microsoft\Windows\Windows Search" /v EnableDynamicContentInWSB /t REG_DWORD /d 0 /f | Out-Null




Write-Host "`n--- All uninstall processes completed. ---"

Read-Host "Press Enter to exit."
