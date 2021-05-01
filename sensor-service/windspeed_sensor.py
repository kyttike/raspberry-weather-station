from gpiozero import Button
import math


wind_sensor = Button(5)
count = 0
radius_cm = 9.0


def spin():
    global count
    count = count + 1


def reset_spins():
    global count
    count = 0


def get_reading():
    global count
    circumference_cm = (2 * math.pi) * radius_cm
    rotations = count / 2.0
    dist_cm = circumference_cm * rotations
    result = dist_cm

    reset_spins()
    return result


wind_sensor.when_pressed = spin
