# Ollama Setup Skill - GTX 1060 6GB

## Purpose
Automated installation and configuration of Ollama for GTX 1060 6GB hardware.

## What This Skill Does

1. **Hardware Validation**
   - Verifies GTX 1060 6GB is detected
   - Checks CUDA compatibility
   - Validates minimum 20GB RAM available

2. **Ollama Installation**
   - Downloads latest Ollama for Windows
   - Installs to user-specified location
   - Configures environment variables

3. **GPU Configuration**
   - Sets up CUDA paths for GTX 1060
   - Configures Ollama to use GPU acceleration
   - Tests GPU detection

4. **Model Recommendations**
   - Suggests optimal 7B models for 6GB VRAM
   - Recommends Q4_K_M quantization
   - Provides download commands

## Usage

From Claude Code:
```
/ollama-setup
```

Or run directly:
```powershell
.\skills\ollama-setup\setup.ps1
```

## Supported Models (6GB VRAM)

- **Llama 3.2 7B** (Q4_K_M) - Best general purpose
- **Mistral 7B** (Q4_K_M) - Fast inference
- **Phi-3 Medium** (Q4_K_M) - Coding tasks
- **Gemma 7B** (Q4_K_M) - Instruction following

## Technical Details

- **Target Hardware:** GTX 1060 6GB, Intel i5-4590, 20GB RAM
- **OS:** Windows 10
- **CUDA Version:** 11.8+ recommended
- **Ollama Version:** Latest stable
- **Max Model Size:** 7B parameters (Q4 quantization)
