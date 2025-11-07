# System Monitor MCP

## Purpose
Model Context Protocol (MCP) server for real-time hardware monitoring during LLM operations.

## What This Monitors

### GPU Metrics
- VRAM usage (current/total)
- GPU utilization %
- GPU temperature
- Power consumption

### System Metrics
- RAM usage
- CPU utilization
- Disk I/O (if model loading)

### LLM-Specific Metrics
- Active Ollama models
- Inference speed (tokens/second)
- Context window usage

## Installation

This MCP can be added to Claude Desktop or other MCP-compatible clients.

### Configuration for Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "system-monitor": {
      "command": "powershell",
      "args": ["-ExecutionPolicy", "Bypass", "-File", "C:\\path\\to\\Codex_App\\mcps\\system-monitor\\monitor.ps1"]
    }
  }
}
```

## Usage

Once configured, the MCP provides real-time metrics accessible via Claude Code:

```
Current GPU Usage: 4.2/6GB VRAM (70%)
Active Model: llama3.2:7b-instruct-q4_K_M
Inference Speed: 18.3 tokens/second
System RAM: 12.1/20GB (60%)
```

## Alerts

Automatic warnings when:
- VRAM usage exceeds 90% (risk of OOM)
- GPU temperature exceeds 80°C
- System RAM usage exceeds 85%
- Inference speed drops below 5 tokens/sec

## Why This Matters

For GTX 1060 6GB users:
- **Prevents OOM crashes:** Warns before VRAM is exhausted
- **Optimizes performance:** Identifies when GPU is underutilized
- **Guides upgrades:** Shows actual bottlenecks in your setup

## Technical Details

- **Update Frequency:** 2 seconds (configurable)
- **Overhead:** <1% CPU, <50MB RAM
- **Compatibility:** Windows 10/11 with NVIDIA GPU
- **Dependencies:** `nvidia-smi` (installed with GPU drivers)

## Output Format

JSON structure for programmatic access:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "gpu": {
    "name": "NVIDIA GeForce GTX 1060 6GB",
    "vram_used_mb": 4300,
    "vram_total_mb": 6144,
    "utilization_percent": 95,
    "temperature_c": 72,
    "power_draw_w": 115
  },
  "system": {
    "ram_used_gb": 12.1,
    "ram_total_gb": 20.0,
    "cpu_percent": 15
  },
  "ollama": {
    "active_models": ["llama3.2:7b-instruct-q4_K_M"],
    "tokens_per_second": 18.3
  }
}
```

## Standalone Usage

Run directly for terminal monitoring:

```powershell
.\mcps\system-monitor\monitor.ps1 -Mode Terminal
```

Output:
```
=== System Monitor ===
GPU: NVIDIA GeForce GTX 1060 6GB
VRAM: [████████████░░░░] 4.2/6GB (70%)
Temp: 72°C
Model: llama3.2:7b-instruct-q4_K_M
Speed: 18.3 tok/s

[Updating every 2s, Ctrl+C to stop]
```
