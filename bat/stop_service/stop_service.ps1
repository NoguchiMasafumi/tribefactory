$ServiceList = @(
    "AxInstSV"               = "ActiveX インストーラー"
    "BDESVC"                 = "BitLocker ドライブ暗号化サービス"
    "DiagTrack"              = "接続ユーザー エクスペリエンスとテレメトリ"
    "MapsBroker"             = "ダウンロード マップ マネージャー"
    "lfsvc"                  = "地理位置情報サービス"
    "vmickvpexchange"        = "Hyper-V データ交換サービス"
    "vmicguestinterface"     = "Hyper-V ゲスト サービス インターフェイス"
    "vmicshutdown"           = "Hyper-V ゲスト シャットダウン サービス"
    "vmicheartbeat"          = "Hyper-V ハートビート サービス"
    "vmicvmsession"          = "Hyper-V PowerShell Direct Service"
    "vmictimesync"           = "Hyper-V Time Synchronization Service"
    "vmicvss"                = "Hyper-V ボリューム シャドウ コピー リクエスター"
    "vmicrdv"                = "Hyper-V リモート デスクトップ仮想化サービス"
    "kxescore"               = "Kingsoft Core Service"
    "Netlogon"               = "Netlogon"
    "PhoneSvc"               = "Phone Service"
    "Spooler"                = "Print Spooler"
    "SCardSvr"               = "Smart Card"
    "ScDeviceEnum"           = "Smart Card Device Enumeration Service"
    "SCPolicySvc"            = "Smart Card Removal Policy"
    "WalletService"          = "WalletService"
    "WbioSrvc"               = "Windows Biometric Service"
    "StiSvc"                 = "Windows Image Acquisition (WIA)"
    "wisvc"                  = "Windows Insider サービス"
    "perceptionsimulation"   = "Windows 認識シミュレーション サービス"
    "workfolderssvc"         = "Work Folders"
    "XboxGipSvc"             = "Xbox Accessory Management Service"
    "XblAuthManager"         = "Xbox Live Auth Manager"
    "XblGameSave"            = "Xbox Live セーブ データ"
    "XboxNetApiSvc"          = "Xbox Live ネットワーキング サービス"
    "DusmSvc"                = "データ使用状況"
    "dmwappushsvc"           = "デバイス管理ワイヤレス アプリケーション プロトコル プッシュWAP"
    "autotimesvc"            = "携帯電話の時間"
    "RetailDemo"             = "市販デモ サービス"
    "SEMgr"                  = "支払いおよび NFC/SE マネージャー"
    "NaturalAuthentication"  = "自然認証"
    "WpcMonSvc"              = "保護者による制限"
)

foreach ($Service in $ServiceList) {
    Write-Host "Starting process for service: $Service" -ForegroundColor Cyan
    
    try {
        if (-not (Get-Service -Name $Service -ErrorAction SilentlyContinue)) {
            Write-Host "Service $Service not found on system" -ForegroundColor Yellow
            continue
        }

        $Status = (Get-Service -Name $Service).Status
        if ($Status -ne "Stopped") {
            Stop-Service -Name $Service -Force -ErrorAction Stop
            Write-Host "Successfully stopped $Service" -ForegroundColor Green
        } else {
            Write-Host "$Service is already stopped" -ForegroundColor Yellow
        }
        
        Set-Service -Name $Service -StartupType Disabled -ErrorAction Stop
        Write-Host "Successfully set $Service to Disabled" -ForegroundColor Green

    }
    catch {
        # ここを修正しました: ${Service} を使用して変数名を明確に区切っています
        Write-Host "An error occurred for ${Service}: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "Process complete for service: $Service" -ForegroundColor Cyan
    Write-Host ""

}
