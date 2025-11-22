Write-Host "--- Starting application uninstall process ---"
$AppxApps = @(
    "MSTeams",                                  # Microsoft Teams (個人用)
    "Microsoft.Copilot",                        # Copilot (AIアシスタント)
    "MicrosoftFamily",                          # ファミリー
    "Microsoft.Whiteboard",                     # ホワイトボード
    "Microsoft.OutlookForWindows",              # Outlook
    "Microsoft.BingFinance",                    # Bing ファイナンス
    "Microsoft.BingSearch",                     # Bing 検索
    "Microsoft.BingNews",                       # ニュース
    "Microsoft.OneDrive",                       # OneDrive
    "Microsoft.PowerAutomateDesktop",           # Power Automate Desktop
    "Microsoft.Paint",                          # ペイント
    "Microsoft.YourPhone",                      # スマホ連携 (Phone Link)
    "MicrosoftWindows.CrossDevice",             # クロスデバイス体験ホスト
    "Microsoft.Windows.DevHome",                # Dev Home (開発ホーム)
    "Microsoft.GetHelp",                        # 問い合わせ (Get Help)
    "Microsoft.WebMediaExtensions",             # Web メディア拡張機能
    "Microsoft.HEIFImageExtension",             # HEIF 画像拡張機能
    "Microsoft.ScreenSketch",                   # Snipping Tool (旧 切り取り & スケッチ)
    "Clipchamp.Clipchamp",                      # Clipchamp (動画編集ソフト)
    "Microsoft.Windows.Notepad",                # メモ帳
    "Microsoft.549981C3F5F10",                  # Cortana (コルタナ)
    "Disney.37853FC22B2CE",                     # Disney+
    "Microsoft.Todos",                          # Microsoft To Do
    #"Microsoft.MicrosoftOfficeHub",             # Microsoft 365 (Office) アプリ
    "Microsoft.MicrosoftSolitaireCollection",   # ソリティア コレクション
    "SpotifyAB.SpotifyMusic",                   # Spotify
    "Microsoft.GamingApp",                      # Xbox アプリ
    "Microsoft.XboxGamingOverlay",              # Xbox Game Bar
    "Microsoft.Xbox.TCUI",                      # Xbox TCUI (UIコンポーネント)
    "Microsoft.XboxGameOverlay",                # Xbox Game Overlay
    "Microsoft.XboxIdentityProvider",           # Xbox Identity Provider (認証用)
    "Microsoft.XboxSpeechToTextOverlay",        # Xbox 音声テキスト変換オーバーレイ
    "Microsoft.ZuneVideo",                      # 映画 & テレビ
    "Microsoft.WindowsCamera",                  # カメラ
    "Microsoft.BingWeather",                    # 天気
    "Microsoft.Getstarted",                     # ヒント (Tips)
    "Microsoft.WindowsFeedbackHub",             # フィードバック Hub
    "Microsoft.Windows.Photos",                 # Microsoft フォト
    "Microsoft.MicrosoftStickyNotes",           # 付箋 (Sticky Notes)
    "Microsoft.WindowsMaps",                    # Windows マップ
    "Microsoft.ZuneMusic"                       # メディア プレーヤー (旧 Groove ミュージック)
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



