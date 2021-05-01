from flask import Flask
import bme280_sensor
import rainfall_sensor

app = Flask(__name__)


@app.route('/')
def get_readings():
    bme280_result = bme280_sensor.read_all()
    rainfall_result = rainfall_sensor.get_reading()

    return {
        "bme280": bme280_result,
        "rain": rainfall_result,
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0')
