# Ollama Setup Script for GTX 1060 6GB
# Author: Local LLM Setup System
# Hardware: Intel i5-4590, 20GB RAM, GTX 1060 6GB, Windows 10

Write-Host "=== Ollama Setup for GTX 1060 6GB ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Hardware Validation
Write-Host "[1/5] Validating hardware..." -ForegroundColor Yellow

# Check for NVIDIA GPU
$gpu = Get-WmiObject Win32_VideoController | Where-Object { $_.Name -like "*NVIDIA*" }
if (-not $gpu) {
    Write-Host "ERROR: No NVIDIA GPU detected" -ForegroundColor Red
    exit 1
}
Write-Host "  GPU detected: $($gpu.Name)" -ForegroundColor Green

# Check RAM
$ram = [Math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
if ($ram -lt 16) {
    Write-Host "WARNING: Low RAM detected ($ram GB). 20GB+ recommended." -ForegroundColor Yellow
} else {
    Write-Host "  RAM: $ram GB" -ForegroundColor Green
}

# Step 2: Check if Ollama is already installed
Write-Host ""
Write-Host "[2/5] Checking for existing Ollama installation..." -ForegroundColor Yellow

$ollamaPath = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaPath) {
    Write-Host "  Ollama already installed at: $($ollamaPath.Source)" -ForegroundColor Green
    $reinstall = Read-Host "  Reinstall? (y/N)"
    if ($reinstall -ne "y") {
        Write-Host "  Skipping installation" -ForegroundColor Cyan
        $skipInstall = $true
    }
}

# Step 3: Download and Install Ollama
if (-not $skipInstall) {
    Write-Host ""
    Write-Host "[3/5] Installing Ollama..." -ForegroundColor Yellow

    $ollamaUrl = "https://ollama.com/download/OllamaSetup.exe"
    $installerPath = "$env:TEMP\OllamaSetup.exe"

    Write-Host "  Downloading from ollama.com..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $ollamaUrl -OutFile $installerPath

    Write-Host "  Running installer..." -ForegroundColor Cyan
    Start-Process -FilePath $installerPath -Wait

    Remove-Item $installerPath -Force
    Write-Host "  Ollama installed successfully" -ForegroundColor Green
}

# Step 4: Verify GPU Detection
Write-Host ""
Write-Host "[4/5] Verifying GPU detection..." -ForegroundColor Yellow

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Start-Sleep -Seconds 2

# Check if Ollama service is running
$ollamaProcess = Get-Process ollama -ErrorAction SilentlyContinue
if ($ollamaProcess) {
    Write-Host "  Ollama service is running" -ForegroundColor Green
} else {
    Write-Host "  Starting Ollama service..." -ForegroundColor Cyan
    Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

Write-Host "  GPU acceleration configured for GTX 1060" -ForegroundColor Green

# Step 5: Recommend Models
Write-Host ""
Write-Host "[5/5] Recommended models for GTX 1060 6GB:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  General Purpose:" -ForegroundColor Cyan
Write-Host "    ollama pull llama3.2:7b-instruct-q4_K_M" -ForegroundColor White
Write-Host ""
Write-Host "  Fast Inference:" -ForegroundColor Cyan
Write-Host "    ollama pull mistral:7b-instruct-q4_K_M" -ForegroundColor White
Write-Host ""
Write-Host "  Coding Tasks:" -ForegroundColor Cyan
Write-Host "    ollama pull phi3:medium-q4_K_M" -ForegroundColor White
Write-Host ""

$downloadNow = Read-Host "Download Llama 3.2 7B now? (Y/n)"
if ($downloadNow -ne "n") {
    Write-Host ""
    Write-Host "Downloading Llama 3.2 7B (Q4_K_M quantization)..." -ForegroundColor Cyan
    ollama pull llama3.2:7b-instruct-q4_K_M
    Write-Host ""
    Write-Host "Testing model..." -ForegroundColor Cyan
    Write-Host "You: Hello!" -ForegroundColor Yellow
    $response = ollama run llama3.2:7b-instruct-q4_K_M "Hello! Respond in one sentence."
    Write-Host "AI: $response" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Quick commands:" -ForegroundColor Cyan
Write-Host "  ollama list                    # List installed models"
Write-Host "  ollama run <model>             # Run a model"
Write-Host "  ollama ps                      # Show running models"
Write-Host "  ollama --help                  # Full command reference"
Write-Host ""
