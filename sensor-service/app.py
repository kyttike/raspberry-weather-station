from flask import Flask
import bme280_sensor

app = Flask(__name__)

@app.route('/')
def hello_world():
    result = bme280_sensor.read_all()
    print(result)
    return 'Hello'

if __name__ == '__main__':
    app.run(host='0.0.0.0')
