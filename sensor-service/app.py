from flask import Flask

import bme280

app = Flask(__name__)


@app.route('/')
def hello_world():
    temperature, pressure, humidity = bme280.readBME280All()
    return f'Temperature: {temperature}; Pressure: {pressure}; Humidity: {humidity}'


if __name__ == '__main__':
    app.run(host='0.0.0.0')
