from flask import Flask
import bme680_sensor
import sht20_sensor
import rainfall_sensor
import windspeed_sensor
import winddirection_sensor
import door_sensor
import datetime

app = Flask(__name__)


def get_slow_readings():
    bme680_result = bme680_sensor.get_reading()
    rainfall_result = rainfall_sensor.get_reading()
    sht20_result = sht20_sensor.get_reading()
    door_result = door_sensor.get_reading()

    return {
        "bme680": bme680_result,
        "sht20": sht20_result,
        "door": door_result,
        "stateful": {
            "rain": rainfall_result,
        }
    }


def get_fast_readings():
    windspeed_result = windspeed_sensor.get_reading()
    winddirection_result = winddirection_sensor.get_reading()

    return {
        "windDirection": winddirection_result,
        "stateful": {
            "windSpeed": windspeed_result,
        }
    }


@app.route('/fast')
def get_fast():
    return {
        "timeStamp": datetime.datetime.utcnow().isoformat(),
        "fast": get_fast_readings(),
    }


@app.route('/all')
def get_all(): return {
    "timeStamp": datetime.datetime.utcnow().isoformat(),
    "fast": get_fast_readings(),
    "slow": get_slow_readings(),
}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5221')
