# Local LLM Setup - GTX 1060 6GB Edition

**Purpose:** Get Ollama running optimally on your GTX 1060 6GB hardware (Intel i5-4590, 20GB RAM, Windows 10).

## What's Included

- **ollama-setup skill** - Automated Ollama installation and configuration for GTX 1060
- **hardware-advisor agent** - Recommends optimal models for your specific hardware
- **system-monitor MCP** - Real-time hardware monitoring during model execution
- **install.ps1** - One-command installation script

## Quick Start

```powershell
.\scripts\install.ps1
```

That's it. The script will:
1. Check your hardware compatibility
2. Install Ollama
3. Configure CUDA for GTX 1060
4. Recommend and download optimal models
5. Verify everything works

## Philosophy

Start small. Get it working. Expand later.

This setup is optimized for:
- **Models:** 7B parameter models (Llama 3.2, Mistral, Phi-3)
- **Quantization:** Q4_K_M (best balance of speed/quality for 6GB VRAM)
- **Use case:** Local development, privacy-focused AI assistance

## Next Steps

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for detailed usage instructions.

---

**Hardware:** Intel i5-4590 | 20GB RAM | GTX 1060 6GB | Windows 10
