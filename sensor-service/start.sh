#!/bin/bash

echo 'Activating project environment'
source ./venv/bin/activate


echo 'Starting sensor service'
python3 app.py
