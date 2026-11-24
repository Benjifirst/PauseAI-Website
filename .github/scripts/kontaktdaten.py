"""Setzt den Namen (Impressum, Datenschutz) aus einem GitHub-Secret in die Seiten ein.

Der Name steht nicht im Repository, sondern nur als Secrets in den
Repo-Einstellungen (Settings > Secrets and variables > Actions).
Fehlt ein Secret, bricht das Skript ab, damit keine Platzhalter online gehen.
"""
import html
import os
import sys

KEYS = ["IMPRESSUM_NAME"]

values = {}
for key in KEYS:
    value = os.environ.get(key, "").strip()
    if not value:
        sys.exit(f"Secret {key} fehlt (Settings > Secrets and variables > Actions).")
    values[key] = html.escape(value)

for path in sys.argv[1:]:
    with open(path, encoding="utf-8") as f:
        text = f.read()
    for key, value in values.items():
        text = text.replace(f"%%{key}%%", value)
    if "%%IMPRESSUM_" in text:
        sys.exit(f"Unbekannter Platzhalter in {path}.")
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"{path}: Name eingesetzt")
