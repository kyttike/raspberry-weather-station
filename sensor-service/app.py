from flask import Flask
import bme680_sensor
import rainfall_sensor
import windspeed_sensor
import datetime

app = Flask(__name__)


@app.route('/')
def get_readings():
    bme680_result = bme680_sensor.get_reading()
    rainfall_result = rainfall_sensor.get_reading()
    windspeed_result = windspeed_sensor.get_reading()

    return {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "bme680": bme680_result,
        "stateful": {
            "rain": rainfall_result,
            "wind": windspeed_result,
        }
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5221')
