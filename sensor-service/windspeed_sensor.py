from gpiozero import Button
import time
import math

wind_sensor = Button(5)
count = 0
radius_cm = 9.0
anemometer_factor = 1.18
last_measurement = time.time()


def spin():
    global count
    count = count + 1


def get_reading():
    global count
    global last_measurement

    circumference_cm = (2 * math.pi) * radius_cm
    rotations = count / 2.0
    dist_cm = circumference_cm * rotations * anemometer_factor
    dist_meters = dist_cm * 0.01
    count = 0

    current_time = time.time()
    time_diff = last_measurement - current_time
    last_measurement = current_time

    return dist_meters / time_diff


wind_sensor.when_pressed = spin
