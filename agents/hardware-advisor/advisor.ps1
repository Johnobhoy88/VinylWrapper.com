# Hardware Advisor Agent
# Analyzes hardware and recommends optimal LLM configurations

Write-Host "=== Hardware Advisor ===" -ForegroundColor Cyan
Write-Host ""

# Detect Hardware
Write-Host "Analyzing your system..." -ForegroundColor Yellow
Write-Host ""

# GPU Detection
$gpu = Get-WmiObject Win32_VideoController | Where-Object { $_.Name -like "*NVIDIA*" }
$gpuName = if ($gpu) { $gpu.Name } else { "No NVIDIA GPU detected" }
$gpuRAM = if ($gpu) { [Math]::Round($gpu.AdapterRAM / 1GB, 1) } else { 0 }

# System RAM
$systemRAM = [Math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)

# CPU
$cpu = Get-WmiObject Win32_Processor
$cpuName = $cpu.Name
$cpuCores = $cpu.NumberOfCores

Write-Host "=== Hardware Analysis ===" -ForegroundColor Cyan
Write-Host "GPU:  $gpuName" -ForegroundColor White
if ($gpuRAM -gt 0) {
    Write-Host "VRAM: $gpuRAM GB" -ForegroundColor White
}
Write-Host "RAM:  $systemRAM GB" -ForegroundColor White
Write-Host "CPU:  $cpuName ($cpuCores cores)" -ForegroundColor White
Write-Host ""

# Analyze capabilities
Write-Host "=== Recommendations ===" -ForegroundColor Cyan
Write-Host ""

# VRAM-based recommendations
if ($gpuRAM -ge 6 -and $gpuRAM -lt 8) {
    Write-Host "Your GPU (6GB VRAM) is perfect for:" -ForegroundColor Green
    Write-Host "  ✓ 7B parameter models (Q4_K_M quantization)" -ForegroundColor Green
    Write-Host "  ✓ 7B parameter models (Q5_K_M quantization, tight fit)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Avoid:" -ForegroundColor Red
    Write-Host "  ✗ 13B+ parameter models (will be very slow or crash)" -ForegroundColor Red
    Write-Host "  ✗ Q8 quantization on 7B models (uses too much VRAM)" -ForegroundColor Red
    Write-Host ""

    Write-Host "Recommended models:" -ForegroundColor Cyan
    Write-Host "  1. llama3.2:7b-instruct-q4_K_M" -ForegroundColor White
    Write-Host "     • Best all-around model" -ForegroundColor DarkGray
    Write-Host "     • ~4.5GB VRAM, 15-25 tokens/sec" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  2. mistral:7b-instruct-q4_K_M" -ForegroundColor White
    Write-Host "     • Fastest inference" -ForegroundColor DarkGray
    Write-Host "     • ~4.2GB VRAM, 20-30 tokens/sec" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  3. phi3:medium-q4_K_M" -ForegroundColor White
    Write-Host "     • Best for coding tasks" -ForegroundColor DarkGray
    Write-Host "     • ~4.8GB VRAM, 12-20 tokens/sec" -ForegroundColor DarkGray
    Write-Host ""

} elseif ($gpuRAM -ge 8 -and $gpuRAM -lt 12) {
    Write-Host "Your GPU ($gpuRAM GB VRAM) can handle:" -ForegroundColor Green
    Write-Host "  ✓ 7B models (any quantization)" -ForegroundColor Green
    Write-Host "  ✓ 13B models (Q4_K_M quantization)" -ForegroundColor Green
    Write-Host ""

} elseif ($gpuRAM -ge 12) {
    Write-Host "Your GPU ($gpuRAM GB VRAM) is excellent!" -ForegroundColor Green
    Write-Host "  ✓ 7B-13B models (any quantization)" -ForegroundColor Green
    Write-Host "  ✓ 30B+ models (Q4 quantization)" -ForegroundColor Green
    Write-Host ""

} else {
    Write-Host "No compatible NVIDIA GPU detected or insufficient VRAM." -ForegroundColor Red
    Write-Host "CPU-only mode will be very slow (1-3 tokens/sec)." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Consider:" -ForegroundColor Cyan
    Write-Host "  • Cloud GPU services (vast.ai, runpod)" -ForegroundColor White
    Write-Host "  • Upgrading to GPU with 6GB+ VRAM" -ForegroundColor White
    Write-Host ""
}

# RAM recommendations
Write-Host "=== Memory Assessment ===" -ForegroundColor Cyan
if ($systemRAM -ge 20) {
    Write-Host "System RAM: Excellent ($systemRAM GB)" -ForegroundColor Green
    Write-Host "  You have plenty of RAM for model operations" -ForegroundColor DarkGray
} elseif ($systemRAM -ge 16) {
    Write-Host "System RAM: Good ($systemRAM GB)" -ForegroundColor Green
    Write-Host "  Sufficient for most operations" -ForegroundColor DarkGray
} else {
    Write-Host "System RAM: Low ($systemRAM GB)" -ForegroundColor Yellow
    Write-Host "  Consider upgrading to 16GB+ for better performance" -ForegroundColor DarkGray
}
Write-Host ""

# Performance expectations
Write-Host "=== Expected Performance ===" -ForegroundColor Cyan
if ($gpuRAM -ge 6 -and $gpuRAM -lt 8) {
    Write-Host "7B Q4_K_M models:" -ForegroundColor White
    Write-Host "  • Inference speed: 15-25 tokens/second" -ForegroundColor DarkGray
    Write-Host "  • Context window: 4096 tokens recommended" -ForegroundColor DarkGray
    Write-Host "  • Concurrent models: 1 at a time" -ForegroundColor DarkGray
    Write-Host "  • Response time: Near-instant for short prompts" -ForegroundColor DarkGray
}
Write-Host ""

# Upgrade path
Write-Host "=== Upgrade Path (if desired) ===" -ForegroundColor Cyan
Write-Host "Best impact:" -ForegroundColor Yellow
Write-Host "  1. GPU with more VRAM (RTX 3060 12GB, RTX 4060 Ti 16GB)" -ForegroundColor White
Write-Host "     → Enables 13B-30B models" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Medium impact:" -ForegroundColor Yellow
Write-Host "  2. More system RAM (32GB)" -ForegroundColor White
Write-Host "     → Larger context windows, better multitasking" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Low impact:" -ForegroundColor Yellow
Write-Host "  3. CPU upgrade" -ForegroundColor White
Write-Host "     → GPU is the bottleneck for LLMs" -ForegroundColor DarkGray
Write-Host ""

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "Run the ollama-setup skill to get started:" -ForegroundColor White
Write-Host "  .\skills\ollama-setup\setup.ps1" -ForegroundColor Yellow
Write-Host ""
