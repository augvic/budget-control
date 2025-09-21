from PyInstaller.building.build_main import Analysis
from PyInstaller.building.api import EXE, PYZ
import os
import shutil

analysis = Analysis(
    scripts=['manage.py'],
    hiddenimports=['server.db_router', 'openpyxl'],
    optimize=0
)

pyz = PYZ(analysis.pure)

exe = EXE(
    pyz,
    analysis.scripts,
    analysis.binaries,
    analysis.datas,
    name='Controle Verba Server',
    upx=True,
    icon="icon.ico"
)

BASE_ORIGIN = os.getcwd()
BASE_DESTINY = f"{os.getcwd()}\\dist"

FILES = [
    (f"{BASE_ORIGIN}\\admin.sqlite3", f"{BASE_DESTINY}\\admin.sqlite3"),
    (f"{BASE_ORIGIN}\\proposals\\proposals.sqlite3", f"{BASE_DESTINY}\\proposals\\proposals.sqlite3"),
    (f"{BASE_ORIGIN}\\login\\login.sqlite3", f"{BASE_DESTINY}\\login\\login.sqlite3"),
]

FOLDERS = [
    (f"{BASE_ORIGIN}\\admin_config\\static", f"{BASE_DESTINY}\\admin_config\\static"),
    (f"{BASE_ORIGIN}\\admin_config\\templates", f"{BASE_DESTINY}\\admin_config\\templates"),
]

def create_dirs() -> None:
    if not os.path.exists(f"{BASE_ORIGIN}\\dist\\login"):
        os.makedirs(f"{BASE_ORIGIN}\\dist\\login")
    if not os.path.exists(f"{BASE_ORIGIN}\\dist\\proposals"):
        os.makedirs(f"{BASE_ORIGIN}\\dist\\proposals")

def copypaste_files() -> None:
    for origin, destiny in FILES:
        origin_path = os.path.abspath(origin)
        destiny_path = os.path.abspath(destiny)
        shutil.copy2(origin_path, destiny_path)

def copypaste_folders() -> None:
    for origin, destiny in FOLDERS:
        origin_path = os.path.abspath(origin)
        destiny_path = os.path.abspath(destiny)
        if os.path.exists(destiny_path):
            shutil.rmtree(destiny_path)
        shutil.copytree(origin_path, destiny_path)

print("Copiando arquivos extras para dist/.")
create_dirs()
copypaste_files()
copypaste_folders()
print("Finalizado.")