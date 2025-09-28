import os
import sys

if len(sys.argv) != 2:
    print("Usage: python script.py <prefixe>")
    sys.exit(1)

prefix = sys.argv[1]
directory = os.getcwd()  # répertoire courant

for filename in os.listdir(directory):
    old_path = os.path.join(directory, filename)

    if not os.path.isfile(old_path):
        continue

    new_name = f"{prefix}-{filename}"
    new_path = os.path.join(directory, new_name)

    os.rename(old_path, new_path)
    print(f"{filename} → {new_name}")

print("✅ Renommage terminé.")
