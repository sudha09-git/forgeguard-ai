#!/usr/bin/env python3
"""
ForgeGuard AI - Backend Server
Run: python start_backend.py
Or:  uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""
import subprocess
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
