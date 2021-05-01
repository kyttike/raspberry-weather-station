import RPi.bme280
import smbus2

port = 1
address = 0x76
bus = smbus2.SMBus(port)

bme280.load_calibration_params(bus, address)


def read_all():
    return bme280.sample(bus, address)
