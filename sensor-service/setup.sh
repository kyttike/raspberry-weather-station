#!/bin/bash

echo 'Creating project environment'
python3 -m venv venv

echo 'Activating project environment'
source ./venv/bin/activate

echo 'Installing dependencies'
pip install -r requirements.txt
