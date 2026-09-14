---
app: tne-case
label: Desktop
tagline: Streamlit + Gurobi optimization suite, packaged as a desktop app
status: preparation # binaries are not on GitHub Releases yet — flip to live once they are
order: 2
repo: https://github.com/TNE-CASE/TGE_CASE-web-page
---

The **Desktop** edition (TGECase) is the original single-user Streamlit application with a Gurobi
optimization engine, packaged with PyInstaller for macOS and Windows.

### Scenarios
- **SC1 / SC2** demand-level simulations
- Optimization module (`optimize/`)
- Single-page run mode

### Download & install
Builds are distributed as `.zip` files for macOS (Apple Silicon) and Windows. After unzipping, run
`TNECase.app` on macOS or the `TNECase` executable on Windows.

> Large binaries are not kept in the repo; every release is distributed via **GitHub Releases**.
