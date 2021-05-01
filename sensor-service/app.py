from flask import Flask
import bme280_sensor
import rainfall_sensor
import windspeed_sensor

app = Flask(__name__)


@app.route('/')
def get_readings():
    bme280_result = bme280_sensor.read_all()
    rainfall_result = rainfall_sensor.get_reading()
    windspeed_result = windspeed_sensor.get_reading()

    return {
        "bme280": bme280_result,
        "rain": rainfall_result,
        "wind": windspeed_result,
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0',port='5221')
