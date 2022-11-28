import click
import os
import pika
import random
from datetime import datetime
from time import sleep

from utils import load_path_mock


TRANSMISSION_RATE = 5  # seconds
FUEL_PROB = 0.5
FUEL_MAX = 0.3  # liters per TRANSMISSION_RATE seconds
PASSENGER_PROB = 0.5
PASSENGER_MAX = 5  # passengers per TRANSMISSION_RATE seconds
BUS_CAPACITY = 90  # passengers


class MockMetrics:

    def __init__(self, id_device, init_timestamp, list_positions, list_speeds, init_fuel, init_passengers):
        self.id_device = id_device
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
            'id_device': self.id_device,
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


@click.command()
@click.option('--id_route', help='Id of the route to be simulated.')
@click.option('--id_device', help='Id of the device on board of the bus.')
#
# Example: python3 generator.py --id_route AVRBUS-L11 --id_device AVRBUS-D0000
#
def main(id_route, id_device):

    # Connect to RabbitMQ
    conn = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = conn.channel()
    channel.queue_declare(queue='devices')

    # Choose a random mock from the provided route
    route_mocks = [filename for filename in os.listdir('mock')
                   if filename.startswith(id_route)]
    chosen_mock = route_mocks[random.randint(0, len(route_mocks) - 1)]

    path = load_path_mock(chosen_mock)  # position and speed

    # Initialize the metrics generator
    metrics = MockMetrics(
        id_device=id_device,
        init_timestamp=int(datetime.now().timestamp()),
        list_positions=[p['position'] for p in path],
        list_speeds=[p['speed'] for p in path],
        init_fuel=100,
        init_passengers=10)

    # Generate metrics
    for m in metrics.generate_metrics():
        # print('...', flush=True) - To print in Docker Terminal
        channel.basic_publish(exchange='',
                              routing_key='devices',
                              body=str(m))


if __name__ == '__main__':
    main()
