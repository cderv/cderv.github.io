# Personal site: build, preview and theme commands.

# Use PowerShell on Windows; recipes must stay cross-platform.
set windows-shell := ["pwsh.exe", "-NoLogo", "-Command"]

# List available recipes
default:
    @just --list

# === site ===

# Render the site to _site/
[group('site')]
render:
    q2 render

# Live preview of the site with auto-reload
[group('site')]
preview:
    q2 preview

# === theme ===
# The theme is the Ghostwriter extension, committed in _extensions/cderv/ghostwriter.
# Its source is the repository cderv/quarto-ghostwriter.

# Reinstall the theme from GitHub, replacing the committed copy (q2 update is not implemented yet)
[group('theme')]
theme-update:
    q2 add cderv/quarto-ghostwriter --force

# Install the theme from a local clone at ../quarto-ghostwriter, to test changes before pushing them (lands in _extensions/ghostwriter, see note)
[group('theme')]
theme-dev:
    q2 add ../quarto-ghostwriter --force

# === talks ===

# Screenshot talk thumbnails (talks/<folder>/thumbnail.png); args: [folders...] [--force] [--url URL]
[group('talks')]
thumbnails *args:
    uv run _scripts/talk-thumbnails.py {{args}}
