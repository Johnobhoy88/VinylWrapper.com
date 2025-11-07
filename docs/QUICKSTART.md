# Quick Start Guide - GTX 1060 6GB Edition

Get up and running with local LLMs in 5 minutes.

## Prerequisites

- Windows 10 or 11
- NVIDIA GTX 1060 6GB (or compatible GPU)
- 16GB+ RAM (20GB recommended)
- 10GB+ free disk space

## Installation

### Option 1: One-Command Install (Recommended)

```powershell
.\scripts\install.ps1
```

This will:
1. Analyze your hardware
2. Install Ollama
3. Configure GPU acceleration
4. Set up monitoring tools

### Option 2: Manual Step-by-Step

```powershell
# 1. Check hardware compatibility
.\agents\hardware-advisor\advisor.ps1

# 2. Install Ollama
.\skills\ollama-setup\setup.ps1

# 3. Test system monitor
.\mcps\system-monitor\monitor.ps1 -Mode Terminal
```

## First Steps

### 1. Download Your First Model

For GTX 1060 6GB, start with Llama 3.2 7B:

```powershell
ollama pull llama3.2:7b-instruct-q4_K_M
```

**Download time:** ~5-10 minutes (depends on internet speed)
**Model size:** ~4.5GB

### 2. Run the Model

```powershell
ollama run llama3.2:7b-instruct-q4_K_M
```

You'll see a prompt like:
```
>>> Send a message (/? for help)
```

Try asking:
```
>>> Hello! Tell me a joke about programming.
```

**Expected speed:** 15-25 tokens/second on GTX 1060

### 3. Exit the Chat

Type `/bye` or press `Ctrl+D`

## Recommended Models for GTX 1060 6GB

All recommendations use Q4_K_M quantization (optimal for 6GB VRAM):

### General Purpose
```powershell
ollama pull llama3.2:7b-instruct-q4_K_M
```
- **Use for:** Conversations, writing, general questions
- **VRAM:** ~4.5GB
- **Speed:** 15-25 tok/s

### Fast Inference
```powershell
ollama pull mistral:7b-instruct-q4_K_M
```
- **Use for:** Quick responses, prototyping
- **VRAM:** ~4.2GB
- **Speed:** 20-30 tok/s

### Coding Assistant
```powershell
ollama pull phi3:medium-q4_K_M
```
- **Use for:** Code generation, debugging
- **VRAM:** ~4.8GB
- **Speed:** 12-20 tok/s

## Common Commands

### Model Management
```powershell
ollama list                  # List downloaded models
ollama pull <model>          # Download a model
ollama rm <model>            # Delete a model
ollama ps                    # Show running models
```

### Running Models
```powershell
ollama run <model>           # Interactive chat
ollama run <model> "prompt"  # Single prompt
```

### System Tools
```powershell
# Hardware analysis
.\agents\hardware-advisor\advisor.ps1

# Real-time monitoring
.\mcps\system-monitor\monitor.ps1 -Mode Terminal
```

## Usage Tips

### 1. Monitor VRAM Usage

Run the system monitor in a separate terminal:

```powershell
.\mcps\system-monitor\monitor.ps1 -Mode Terminal
```

This shows:
- Current VRAM usage
- GPU temperature
- Inference speed
- Active models

### 2. Run One Model at a Time

Your GTX 1060 6GB can only comfortably run one 7B model at a time.

To stop a running model:
```powershell
ollama ps              # See what's running
# Just exit the chat or run a different model
```

### 3. Close GPU-Intensive Apps

Before running models:
- Close games
- Close video editing software
- Pause video streaming (if it uses GPU decoding)

### 4. Avoid Larger Models

Do NOT try to run:
- 13B models (will be extremely slow)
- Q8 quantization (uses too much VRAM)
- Multiple models simultaneously

## Troubleshooting

### Problem: "CUDA out of memory" error

**Solution:**
1. Close other applications using GPU
2. Use smaller quantization (Q4 instead of Q5/Q8)
3. Restart Ollama: `taskkill /F /IM ollama.exe` then `ollama serve`

### Problem: Slow inference (< 5 tokens/second)

**Possible causes:**
1. Model is too large for VRAM (falling back to CPU)
2. GPU drivers need updating
3. Wrong quantization (using Q8 instead of Q4)

**Solution:**
1. Check VRAM usage with system monitor
2. Update NVIDIA drivers
3. Use Q4_K_M quantization

### Problem: Ollama not found after installation

**Solution:**
1. Close and reopen PowerShell
2. Or run: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")`

### Problem: GPU not detected

**Solution:**
1. Verify GPU is working: `nvidia-smi`
2. Update NVIDIA drivers from nvidia.com
3. Restart computer after driver update

## Advanced Usage

### API Access

Ollama provides a REST API at `http://localhost:11434`

Example with curl:
```powershell
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:7b-instruct-q4_K_M",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

### Custom Model Parameters

Run with custom context window:
```powershell
ollama run llama3.2:7b-instruct-q4_K_M --ctx-size 4096
```

### Integration with Tools

- **VS Code:** Use Continue.dev extension
- **Cursor:** Point to `http://localhost:11434`
- **Raycast:** Use Raycast Ollama extension

## Performance Expectations

### GTX 1060 6GB + i5-4590 + 20GB RAM

| Model | VRAM | Speed | Response Time* |
|-------|------|-------|----------------|
| Llama 3.2 7B (Q4) | 4.5GB | 15-25 tok/s | 2-4s |
| Mistral 7B (Q4) | 4.2GB | 20-30 tok/s | 1-3s |
| Phi-3 Medium (Q4) | 4.8GB | 12-20 tok/s | 3-5s |

*For 50-token responses

### Temperature Impact

Your GPU may throttle if it gets too hot (>83°C). Monitor with:
```powershell
nvidia-smi -l 2
```

Or use the system monitor:
```powershell
.\mcps\system-monitor\monitor.ps1 -Mode Terminal
```

## Next Steps

1. **Try different models:** Experiment with the recommended models
2. **Set up API integration:** Connect your favorite tools
3. **Monitor performance:** Keep an eye on VRAM and temperature
4. **Join the community:** Share your experience and learn from others

## Resources

- **Ollama Documentation:** https://ollama.com/docs
- **Model Library:** https://ollama.com/library
- **This Repo Issues:** Report problems or request features

## Philosophy Reminder

> Start small. Get it working. Expand later.

Don't try to do everything at once. Master one model, then explore more.

---

**Hardware:** Intel i5-4590 | 20GB RAM | GTX 1060 6GB | Windows 10

**Having issues?** Open an issue in this repository with:
- Your exact hardware specs
- Error messages (full text)
- What you were trying to do
- System monitor output (if available)
