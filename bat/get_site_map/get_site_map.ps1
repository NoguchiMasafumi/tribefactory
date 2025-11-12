$TargetFolderName = "tribefactory-main"
$OutputFileName = "file_structure.json"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

$TargetFolderPath = Join-Path -Path $ScriptDir -ChildPath $TargetFolderName
$OutputSubDir = "js\sitemap"
$OutputDirectoryPath = Join-Path -Path $TargetFolderPath -ChildPath $OutputSubDir
$OutputPath = Join-Path -Path $OutputDirectoryPath -ChildPath $OutputFileName

Write-Host ""
Write-Host "[Starting File Structure Analysis Script Execution]"
Write-Host "Target Folder: ""$TargetFolderName"""
Write-Host "Output Directory: ""$OutputSubDir"""
Write-Host "Output File: ""$OutputFileName"""
Write-Host ""

if (-not (Test-Path -Path $TargetFolderPath -PathType Container)) {
    Write-Error "ERROR: Target folder ""$TargetFolderName"" not found. Aborting."
    exit 1
}

# Create the output directory if it does not exist
if (-not (Test-Path -Path $OutputDirectoryPath -PathType Container)) {
    Write-Host "Creating output directory: ""$OutputDirectoryPath"""
    New-Item -Path $OutputDirectoryPath -ItemType Directory | Out-Null
}

Write-Host "Step 1: Starting file traversal and JSON conversion."

try {
    $FileStructure = Get-ChildItem -Path $TargetFolderPath -Recurse |
        Select-Object FullName, Name, PSIsContainer, Length, LastWriteTime

    $FileStructure | ConvertTo-Json -Depth 10 |
        Out-File -FilePath $OutputPath -Encoding UTF8
    
    $ExitCode = 0
}
catch {
    Write-Error "Step 2: An error occurred during PowerShell execution."
    Write-Error $_.Exception.Message
    $ExitCode = 1
}

Write-Host ""
Write-Host "Step 3: PowerShell execution finished."
Write-Host "Exit Code: $ExitCode"

if ($ExitCode -eq 0) {
    Write-Host "Success: Output written to ""$OutputPath"""
} else {
    Write-Host "Failure: Please check the error messages above."
}

Write-Host ""
if ($Host.Name -eq "ConsoleHost" -and $PSBoundParameters.ContainsKey("NoExit") -eq $false) {
    Write-Host "Press any key to close this window..."
    $null = [System.Console]::ReadKey($true)
}

exit $ExitCode