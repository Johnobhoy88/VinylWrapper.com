# Hardware Advisor Agent

## Purpose
Analyzes your hardware specifications and recommends optimal LLM models, quantization levels, and performance settings.

## What This Agent Does

### 1. Hardware Analysis
- Detects GPU model and VRAM
- Checks system RAM
- Identifies CPU capabilities
- Assesses storage speed (SSD vs HDD)

### 2. Model Recommendations
Based on your GTX 1060 6GB:
- **Recommended:** 7B parameter models with Q4_K_M quantization
- **Why:** Fits comfortably in 6GB VRAM with room for context
- **Avoid:** 13B+ models (will use CPU fallback, very slow)

### 3. Performance Optimization
- **Context length:** Recommend 4096 tokens (balance of memory/capability)
- **Batch size:** Suggest optimal values for your GPU
- **Concurrent models:** Advise against running multiple models simultaneously

### 4. Upgrade Path Guidance
If you want better performance:
- **Best upgrade:** More VRAM (RTX 3060 12GB, RTX 4060 Ti 16GB)
- **Medium impact:** More RAM (32GB for larger context)
- **Low impact:** CPU upgrade (GPU is bottleneck for LLMs)

## Usage

```powershell
.\agents\hardware-advisor\advisor.ps1
```

Or invoke via Claude Code task system.

## Example Output

```
=== Hardware Analysis ===
GPU: NVIDIA GeForce GTX 1060 6GB
RAM: 20GB
CPU: Intel i5-4590 (4 cores)

=== Recommendations ===
✓ 7B models (Q4_K_M): Excellent performance
✗ 13B models: Not recommended (too slow)
✗ 70B+ models: Not possible

Suggested models:
1. llama3.2:7b-instruct-q4_K_M (best all-around)
2. mistral:7b-instruct-q4_K_M (fastest)
3. phi3:medium-q4_K_M (best for code)

Expected performance:
- Tokens/second: 15-25 (Q4 models)
- Context window: 4096 tokens recommended
- Concurrent models: 1 at a time
```

## Technical Details

### VRAM Usage Estimates
- **7B Q4_K_M:** ~4.5GB VRAM (✓ fits well)
- **7B Q5_K_M:** ~5.5GB VRAM (✓ tight but works)
- **7B Q8_0:** ~7.5GB VRAM (✗ too large)
- **13B Q4_K_M:** ~8GB VRAM (✗ exceeds VRAM)

### Performance Expectations (GTX 1060 6GB)
| Model Size | Quantization | VRAM | Tokens/sec | Recommended |
|------------|--------------|------|------------|-------------|
| 7B | Q4_K_M | 4.5GB | 15-25 | ✓ Yes |
| 7B | Q5_K_M | 5.5GB | 12-20 | ✓ Yes |
| 7B | Q8_0 | 7.5GB | N/A | ✗ No |
| 13B | Q4_K_M | 8GB | 2-5 | ✗ No |

## Hardware-Specific Advice

**Your Setup: i5-4590 + GTX 1060 6GB + 20GB RAM**

**Strengths:**
- GPU acceleration works well for 7B models
- Sufficient RAM for OS + model operations
- Can run 24/7 without overheating issues

**Limitations:**
- 6GB VRAM limits to 7B models (most common use case)
- PCIe 3.0 bandwidth (not a bottleneck for LLMs)
- CPU fallback very slow (avoid 13B+ models)

**Best Practices:**
1. Stick to Q4_K_M quantization (best speed/quality balance)
2. Close GPU-intensive apps before running models
3. Monitor VRAM usage with system-monitor MCP
4. Use one model at a time

**Not Recommended:**
- Running multiple models simultaneously
- 13B+ models (will thrash or crash)
- Q8 quantization on 7B+ models (too large)
- Streaming videos while running models
