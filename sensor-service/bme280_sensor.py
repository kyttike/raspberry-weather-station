import bme280
import smbus2

port = 1
address = 0x76
bus = smbus2.SMBus(port)

bme280.load_calibration_params(bus, address)


def read_all():
    result = bme280.sample(bus, address)
    return {
        "temperature": result.temperature,
        "pressure": result.pressure,
        "humidity": result.humidity,
    }
