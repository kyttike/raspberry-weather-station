from sht20 import SHT20
from time import sleep

sht = SHT20(1, resolution=SHT20.TEMP_RES_14bit)

def get_reading():
    data = sht.read_all()
    return {
        "temperature": data[0],
        "humidity": data[1],
    }
