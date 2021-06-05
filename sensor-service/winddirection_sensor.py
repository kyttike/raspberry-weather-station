import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

voltage_map = {
    4.01: 0,
    2.08: 22.5,
    2.36: 45,
    0.43: 67.5,
    0.48: 90,
    0.34: 112.5,
    0.94: 135,
    0.65: 157.5,
    1.47: 180,
    1.25: 202.5,
    3.22: 225,
    3.06: 247.5,
    4.81: 270,
    4.21: 292.5,
    4.52: 315,
    3.58: 337.5,
}

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
channel = AnalogIn(ads, ADS.P0)
ads.gain = 2 / 3


def get_reading():
    voltage = channel.voltage
    closest_voltage = list(voltage_map.keys())[0]
    for potential_voltage in voltage_map:
        if abs(voltage - closest_voltage) > abs(voltage - potential_voltage):
            closest_voltage = potential_voltage
    return voltage_map[closest_voltage]


get_reading()
