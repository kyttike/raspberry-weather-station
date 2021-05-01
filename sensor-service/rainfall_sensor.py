from gpiozero import Button

rain_sensor = Button(6)
BUCKET_SIZE = 0.2794
count = 0

def bucket_tipped():
    global count
    count = count + 1

def reset_rainfall():
    global count
    count = 0

def get_reading():
    global count
    result = count + BUCKET_SIZE
    reset_rainfall()

rain_sensor.when_pressed = bucket_tipped