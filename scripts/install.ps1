# Local LLM Setup - One-Command Installer
# For GTX 1060 6GB | Intel i5-4590 | 20GB RAM | Windows 10

param(
    [switch]$SkipHardwareCheck,
    [switch]$QuickMode
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Local LLM Setup - GTX 1060 6GB Edition   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get repository root
$repoRoot = Split-Path -Parent $PSScriptRoot

# Step 1: Hardware Analysis
if (-not $SkipHardwareCheck) {
    Write-Host "[1/3] Running hardware analysis..." -ForegroundColor Yellow
    Write-Host ""
    & "$repoRoot\agents\hardware-advisor\advisor.ps1"

    Write-Host ""
    $continue = Read-Host "Continue with installation? (Y/n)"
    if ($continue -eq "n") {
        Write-Host "Installation cancelled." -ForegroundColor Red
        exit 0
    }
} else {
    Write-Host "[1/3] Skipping hardware check (--SkipHardwareCheck)" -ForegroundColor Yellow
}

# Step 2: Ollama Setup
Write-Host ""
Write-Host "[2/3] Setting up Ollama..." -ForegroundColor Yellow
Write-Host ""

if ($QuickMode) {
    # Quick mode: skip interactive prompts
    $env:OLLAMA_QUICK_MODE = "1"
}

& "$repoRoot\skills\ollama-setup\setup.ps1"

if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
    Write-Host ""
    Write-Host "ERROR: Ollama setup failed" -ForegroundColor Red
    exit 1
}

# Step 3: System Monitor Setup
Write-Host ""
Write-Host "[3/3] Configuring system monitor..." -ForegroundColor Yellow
Write-Host ""

Write-Host "System monitor MCP is available at:" -ForegroundColor Cyan
Write-Host "  $repoRoot\mcps\system-monitor\monitor.ps1" -ForegroundColor White
Write-Host ""
Write-Host "To use with Claude Desktop, add to your config:" -ForegroundColor Cyan
Write-Host @"
{
  "mcpServers": {
    "system-monitor": {
      "command": "powershell",
      "args": ["-ExecutionPolicy", "Bypass", "-File", "$repoRoot\mcps\system-monitor\monitor.ps1"]
    }
  }
}
"@ -ForegroundColor DarkGray
Write-Host ""

$testMonitor = Read-Host "Test system monitor now? (Y/n)"
if ($testMonitor -ne "n") {
    Write-Host ""
    Write-Host "Starting system monitor (5 second test)..." -ForegroundColor Cyan
    $job = Start-Job -ScriptBlock {
        param($scriptPath)
        & $scriptPath -Mode Terminal
    } -ArgumentList "$repoRoot\mcps\system-monitor\monitor.ps1"

    Start-Sleep -Seconds 5
    Stop-Job $job
    Remove-Job $job
}

# Complete
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          Installation Complete!            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Quick Reference:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ollama Commands:" -ForegroundColor Yellow
Write-Host "  ollama list                    # List installed models" -ForegroundColor White
Write-Host "  ollama run <model>             # Run a model" -ForegroundColor White
Write-Host "  ollama ps                      # Show running models" -ForegroundColor White
Write-Host "  ollama pull <model>            # Download a model" -ForegroundColor White
Write-Host ""

Write-Host "Recommended first model:" -ForegroundColor Yellow
Write-Host "  ollama pull llama3.2:7b-instruct-q4_K_M" -ForegroundColor White
Write-Host "  ollama run llama3.2:7b-instruct-q4_K_M" -ForegroundColor White
Write-Host ""

Write-Host "System Tools:" -ForegroundColor Yellow
Write-Host "  .\agents\hardware-advisor\advisor.ps1      # Hardware analysis" -ForegroundColor White
Write-Host "  .\mcps\system-monitor\monitor.ps1 -Mode Terminal  # Live monitoring" -ForegroundColor White
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  See docs\QUICKSTART.md for detailed usage" -ForegroundColor White
Write-Host ""

Write-Host "Happy prompting! 🚀" -ForegroundColor Green
Write-Host ""
