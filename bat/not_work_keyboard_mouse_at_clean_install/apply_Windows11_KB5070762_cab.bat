@echo off
setlocal enabledelayedexpansion
cls
title Windows 回復環境 (WinRE) 更新ツール

:: =============================================================================
:: 1. 管理者権限で実行されているか確認します。
:: =============================================================================
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 管理者権限が必要です。管理者として再起動します...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit
)

:: =============================================================================
:: 2. 設定値 (ここをあなたの環境に合わせて変更してください)
:: =============================================================================

:: ★ 適用したい更新パッケージの【ファイル名】を指定してください
::    (このバッチファイルと同じフォルダに置いてください)
SET "UPDATE_FILENAME=windows11.0-kb5070762-x64_4b467e35732c13393ba032305d398b615423a8ad.cab"

:: --- (ここは自動設定なので変更不要) ---
SET "UPDATE_PACKAGE_PATH=%~dp0%UPDATE_FILENAME%"

:: ★ WinREをマウントするための一時フォルダを指定してください (通常は変更不要)
SET "MOUNT_DIR=C:\WinREMount"

:: =============================================================================
:: --- 以下は変更不要です ---
:: =============================================================================

echo -----------------------------------------------------------------
echo         Windows 回復環境 (WinRE) 更新ツール
echo -----------------------------------------------------------------
echo.
echo 設定内容:
echo   - 更新パッケージ: "%UPDATE_PACKAGE_PATH%"
echo   - 作業フォルダ:     "%MOUNT_DIR%"
echo.
echo 警告: このスクリプトはシステムの回復環境を変更します。
echo       必ず内容を理解した上で、自己責任で実行してください。
echo.
echo 設定内容を確認し、続ける場合は何かキーを押してください。
pause

:: --- 事前準備 ---
if not exist "%UPDATE_PACKAGE_PATH%" (
    echo [エラー] 指定された更新パッケージファイルが見つかりません。
    echo パス: "%UPDATE_PACKAGE_PATH%"
    goto :end
)

if exist "%MOUNT_DIR%" (
    echo [情報] 既存の作業フォルダをクリーンアップします...
    rmdir /s /q "%MOUNT_DIR%"
)
mkdir "%MOUNT_DIR%"
if %errorlevel% neq 0 (
    echo [エラー] 作業フォルダの作成に失敗しました。
    goto :end
)
echo.

:: --- ステップ1: WinREイメージをマウント ---
echo --- ステップ1: 回復環境イメージをマウントしています... ---
ReAgentC.exe /mountre /path "%MOUNT_DIR%"
if %errorlevel% neq 0 (
    echo [エラー] 回復環境のマウントに失敗しました。
    echo 他のプロセスが使用していないか確認してください。
    goto :cleanup_mountdir
)
echo マウントが完了しました。
echo.

:: --- ステップ2: 更新パッケージを適用 ---
echo --- ステップ2: 更新パッケージを適用しています... (時間がかかる場合があります) ---
Dism /Add-Package /Image:"%MOUNT_DIR%" /PackagePath:"%UPDATE_PACKAGE_PATH%"
if %errorlevel% neq 0 (
    echo [エラー] 更新パッケージの適用に失敗しました。
    goto :unmount_and_exit
)
echo パッケージの適用が完了しました。
echo.


:: --- ステップ3: 回復イメージをアンマウント ---
:unmount_and_exit
echo --- ステップ3: 回復イメージをアンマウントし、変更を保存しています... ---
ReAgentC.exe /unmountre /path "%MOUNT_DIR%" /commit
if %errorlevel% neq 0 (
    echo [エラー] 回復環境のアンマウントに失敗しました。
    echo 手動での確認が必要です: ReAgentC.exe /unmountre /path "%MOUNT_DIR%" /discard
    goto :cleanup_mountdir
)
echo アンマウントが完了しました。
echo.

:cleanup_mountdir
:: --- 後片付け ---
echo.
echo --- 作業フォルダをクリーンアップしています... ---
if exist "%MOUNT_DIR%" (
    rmdir /s /q "%MOUNT_DIR%"
)

:end
echo.
echo -----------------------------------------------------------------
echo 全ての処理が完了しました。
echo -----------------------------------------------------------------
echo.
echo 終了するには何かキーを押してください。
pause > nul
