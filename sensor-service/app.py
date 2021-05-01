from flask import Flask
import air_sensor

app = Flask(__name__)

@app.route('/')
def hello_world():
    print('Hello')
    return air_sensor.read_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
