# System Monitor MCP
# Real-time hardware monitoring for LLM operations
# Target Hardware: GTX 1060 6GB

param(
    [string]$Mode = "MCP",  # MCP or Terminal
    [int]$UpdateInterval = 2  # Seconds between updates
)

function Get-GPUMetrics {
    try {
        # Use nvidia-smi to get GPU metrics
        $nvidiaCmd = "nvidia-smi --query-gpu=name,memory.used,memory.total,utilization.gpu,temperature.gpu,power.draw --format=csv,noheader,nounits"
        $gpuData = Invoke-Expression $nvidiaCmd

        if ($gpuData) {
            $parts = $gpuData -split ','
            return @{
                name = $parts[0].Trim()
                vram_used_mb = [int]$parts[1].Trim()
                vram_total_mb = [int]$parts[2].Trim()
                utilization_percent = [int]$parts[3].Trim()
                temperature_c = [int]$parts[4].Trim()
                power_draw_w = [decimal]$parts[5].Trim()
            }
        }
    } catch {
        return $null
    }
}

function Get-SystemMetrics {
    $mem = Get-CimInstance Win32_OperatingSystem
    $cpu = Get-CimInstance Win32_Processor

    $ramUsedGB = [Math]::Round(($mem.TotalVisibleMemorySize - $mem.FreePhysicalMemory) / 1MB, 1)
    $ramTotalGB = [Math]::Round($mem.TotalVisibleMemorySize / 1MB, 1)

    return @{
        ram_used_gb = $ramUsedGB
        ram_total_gb = $ramTotalGB
        cpu_percent = $cpu.LoadPercentage
    }
}

function Get-OllamaMetrics {
    try {
        # Check if Ollama is running
        $ollamaProcess = Get-Process ollama -ErrorAction SilentlyContinue
        if (-not $ollamaProcess) {
            return @{
                active_models = @()
                tokens_per_second = 0
            }
        }

        # Try to get active models from Ollama API
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/ps" -Method Get -ErrorAction SilentlyContinue

        $activeModels = @()
        if ($response.models) {
            $activeModels = $response.models | ForEach-Object { $_.name }
        }

        return @{
            active_models = $activeModels
            tokens_per_second = 0  # Would need to parse from actual inference
        }
    } catch {
        return @{
            active_models = @()
            tokens_per_second = 0
        }
    }
}

function Format-TerminalOutput {
    param($metrics)

    Clear-Host
    Write-Host "=== System Monitor for GTX 1060 ===" -ForegroundColor Cyan
    Write-Host ""

    if ($metrics.gpu) {
        $gpu = $metrics.gpu
        $vramPercent = [Math]::Round(($gpu.vram_used_mb / $gpu.vram_total_mb) * 100, 1)
        $vramUsedGB = [Math]::Round($gpu.vram_used_mb / 1024, 1)
        $vramTotalGB = [Math]::Round($gpu.vram_total_mb / 1024, 1)

        Write-Host "GPU: $($gpu.name)" -ForegroundColor White

        # VRAM bar
        $barLength = 20
        $filledLength = [Math]::Floor(($vramPercent / 100) * $barLength)
        $bar = "█" * $filledLength + "░" * ($barLength - $filledLength)

        $vramColor = if ($vramPercent -gt 90) { "Red" } elseif ($vramPercent -gt 75) { "Yellow" } else { "Green" }
        Write-Host "VRAM: [" -NoNewline
        Write-Host $bar -NoNewline -ForegroundColor $vramColor
        Write-Host "] $vramUsedGB/$vramTotalGB GB ($vramPercent%)" -ForegroundColor $vramColor

        # GPU utilization
        Write-Host "GPU%: $($gpu.utilization_percent)%" -ForegroundColor $(if ($gpu.utilization_percent -lt 50) { "Yellow" } else { "Green" })

        # Temperature
        $tempColor = if ($gpu.temperature_c -gt 80) { "Red" } elseif ($gpu.temperature_c -gt 70) { "Yellow" } else { "Green" }
        Write-Host "Temp: $($gpu.temperature_c)°C" -ForegroundColor $tempColor

        Write-Host "Power: $($gpu.power_draw_w)W" -ForegroundColor White
        Write-Host ""
    }

    # System metrics
    $sys = $metrics.system
    $ramPercent = [Math]::Round(($sys.ram_used_gb / $sys.ram_total_gb) * 100, 1)
    Write-Host "System RAM: $($sys.ram_used_gb)/$($sys.ram_total_gb) GB ($ramPercent%)" -ForegroundColor White
    Write-Host "CPU: $($sys.cpu_percent)%" -ForegroundColor White
    Write-Host ""

    # Ollama status
    $ollama = $metrics.ollama
    if ($ollama.active_models.Count -gt 0) {
        Write-Host "Active Models:" -ForegroundColor Cyan
        foreach ($model in $ollama.active_models) {
            Write-Host "  • $model" -ForegroundColor Green
        }
    } else {
        Write-Host "No active Ollama models" -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "[Updating every $UpdateInterval seconds, Ctrl+C to stop]" -ForegroundColor DarkGray
}

function Format-JSONOutput {
    param($metrics)

    $output = @{
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        gpu = $metrics.gpu
        system = $metrics.system
        ollama = $metrics.ollama
    }

    return $output | ConvertTo-Json -Depth 3
}

# Main monitoring loop
if ($Mode -eq "Terminal") {
    Write-Host "Starting system monitor..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Start-Sleep -Seconds 2

    while ($true) {
        $metrics = @{
            gpu = Get-GPUMetrics
            system = Get-SystemMetrics
            ollama = Get-OllamaMetrics
        }

        Format-TerminalOutput -metrics $metrics
        Start-Sleep -Seconds $UpdateInterval
    }

} else {
    # MCP mode - output JSON once
    $metrics = @{
        gpu = Get-GPUMetrics
        system = Get-SystemMetrics
        ollama = Get-OllamaMetrics
    }

    Format-JSONOutput -metrics $metrics
}
