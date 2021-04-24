#!/bin/bash

echo 'Setting up weather station project'

cd sensor-service || exit
sh setup.sh
cd .. || exit
