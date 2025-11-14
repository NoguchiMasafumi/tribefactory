$ServiceList = @(
    "AxInstSV"
    "BDESVC"
    "DiagTrack"
    "MapsBroker"
	"lfsvc"
	"vmickvpexchange"
	"vmicguestinterface"
	"vmicshutdown"
	"vmicheartbeat"
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