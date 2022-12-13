import click
import os
import pika
import random
from datetime import datetime
from time import sleep

from utils import load_path_mock
from camera_sensor import detectByCamera, detectByPathImage, detectByPathVideo


TRANSMISSION_RATE = 5  # seconds
FUEL_PROB = 0.5
FUEL_MAX = 0.3  # liters per TRANSMISSION_RATE seconds
PASSENGER_PROB = 0.5
PASSENGER_MAX = 5  # passengers per TRANSMISSION_RATE seconds
BUS_CAPACITY = 90  # passengers


class MockMetrics:

    def __init__(self, device_id, route_id, route_shift, init_timestamp, list_positions, list_speeds, init_fuel, init_passengers):
        self.device_id = device_id
        self.route_id = route_id
        self.route_shift = route_shift
        self.timestamp = init_timestamp
        self.positions = list_positions
        self.speeds = list_speeds
        self.fuel = init_fuel
        self.passengers = init_passengers

    def _has_next_metrics(self):
        return self.positions and self.speeds

    def _get_next_metrics(self):
        self.timestamp += TRANSMISSION_RATE

        # Fuel
        decrease_fuel = random.random() < FUEL_PROB
        if decrease_fuel:
            self.fuel = round(self.fuel - random.random() * FUEL_MAX, 3)

        # Passengers - TODO: receive this data from external camera counter
        # The number of passengers can change even if the bus is not at a stop (eg: stopped in traffic)
        change_passengers = self.speeds[0] < 1 and random.random(
        ) < PASSENGER_PROB
        if change_passengers:
            self.passengers += random.randint(
                max(-PASSENGER_MAX, -self.passengers),
                min(PASSENGER_MAX, BUS_CAPACITY - self.passengers)
            )

        return {
            'device_id': self.device_id,
            'route_id': self.route_id,
            'route_shift': self.route_shift,
            'timestamp': self.timestamp,
            'position': self.positions.pop(0),
            'speed': self.speeds.pop(0),
            'fuel': self.fuel,
            'passengers': self.passengers
        }

    def generate_metrics(self):
        while self._has_next_metrics():
            yield self._get_next_metrics()
            sleep(TRANSMISSION_RATE)

def getPassengersCount(ctx):
    base, ext = os.path.splitext(ctx.params['bus_video'])
    if ctx.params['bus_video'] is not None:
        if ext.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
            detectByPathImage(ctx.params['bus_video'])
        elif ext.lower() in ['.mp4', '.avi', '.mov', '.mkv']:
            detectByPathVideo(ctx.params['bus_video'])
        else:
            print("Not valid input file!")
            return 10
    elif ctx.params['camera'] == 'True':
        detectByCamera(None)
    else:
        return 10      

@click.command()
@click.option('--device_id', help='Id of the device on board of the bus.')
@click.option('--route_id', help='Id of the route to be simulated.')#
@click.option('--route_shift', help='Shift of the route to be simulated.')
@click.option('--camera', required=False, default='False', help='Camera to be used to count passengers.')
@click.option('--bus_footage', required=False, default='videos/video1.mp4', help='Bus footage used to count passengers.')
#
# Example: python3 generator.py --device_id AVRBUS-D0000 --route_id AVRBUS-L11 --route_shift 092000
#
def main(device_id, route_id, route_shift, camera, bus_video):

    # Connect to RabbitMQ
    conn = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = conn.channel()
    channel.queue_declare(queue='devices')

    # Choose a random mock from the provided route
    route_mocks = [filename for filename in os.listdir('mock')
                   if filename.startswith(route_id)]
    chosen_mock = route_mocks[random.randint(0, len(route_mocks) - 1)]

    path = load_path_mock(chosen_mock)  # position and speed

    # Get values of click parameters
    ctx = click.get_current_context()
    current_passengers = getPassengersCount(ctx)

    # Initialize the metrics generator
    metrics = MockMetrics(
        device_id=device_id,
        route_id=route_id,
        route_shift=route_shift,
        init_timestamp=int(datetime.now().timestamp()),
        list_positions=[p['position'] for p in path],
        list_speeds=[p['speed'] for p in path],
        init_fuel=100,
        init_passengers=current_passengers)

    # Generate metrics
    for m in metrics.generate_metrics():
        # print('...', flush=True) - To print in Docker Terminal
        channel.basic_publish(exchange='',
                              routing_key='devices',
                              body=str(m))
    conn.close()


if __name__ == '__main__':
    main()
