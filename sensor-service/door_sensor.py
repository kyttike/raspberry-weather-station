import RPi.GPIO as GPIO
import time
import sys
import signal

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down = GPIO.PUD_UP)


def get_reading():
    return GPIO.input(18)
