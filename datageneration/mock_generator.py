import random
from math import dist, sin
import geopy.distance
import numpy as np

# to be called before writing on result on file

def format_result(result):
    result_string = "[\n"
    for i, item in enumerate(result):
        if i == len(result) - 1:
            result_string += str(item) + "\n]"
            return result_string
        result_string += str(item) + ",\n"


def generate_deviated_time(expected_time, max_deviation=0.2):
    deviation_sign_prob = random.random()
    if deviation_sign_prob > 0.8:
        deviation_sign = -1
    else:
        deviation_sign = 1
    time_deviation =  random.random() * max_deviation * expected_time * deviation_sign
    return time_deviation + expected_time


def generate_linear_but_not_evenly_spaced_coords(p1, p2, points):
    lat1, lon1 = p1
    lat2, lon2 = p2

    lats = np.random.uniform(0, 1, points)
    lons = np.random.uniform(0, 1, points)

    lats = lats * (lat2 - lat1)
    lons = lons * (lon2 - lon1)

    lats = lats + lat1
    lons = lons + lon1

    return [(round(lat, 5), round(lon, 5)) for lat, lon in zip(lats, lons)]


def route_geopy_distance(p1, p2):
    return geopy.distance.geodesic(p1, p2).m


def generate_result_struct(points, speeds):
    result = []
    for i in range(len(points)):
        result.append({"position": [points[i][0], points[i][1]], "speed": speeds[i]})
    return result


def generate_result_given_stops(stop1, stop2, expected_time_between_stops, step=5):
    # calc real-time
    real_time = generate_deviated_time(expected_time_between_stops)

    # compute linear route distance using geopy
    route_distance = route_geopy_distance(stop1, stop2)

    # compute array of time spaced evenly by step (rate from which the RabbitMQ will read the data)
    times = [i for i in range(5, int(real_time), step)]

    # theoretical constant speed value that takes the imaginary bus to travel route_distance in real-time
    constant_speed = ((route_distance/real_time) * 3600) / 1000

    # generation of speeds that follow a sine wave pattern with amplitude constant_speed ranged from [0, 2*constant_speed] for time in times
    speeds = [round(sin(t) * constant_speed + constant_speed, 3) for t in times if t != 0]

    # generation of linear but not evenly spaced coordinate ranging from ]stop1, stop2[ len(speed) coordinates
    points = generate_linear_but_not_evenly_spaced_coords(stop1, stop2, len(speeds))

    # stop1
    speeds.insert(0, 0)
    points.insert(0, stop1)

    # stop2
    speeds.append(0)
    points.append(stop2)

    return generate_result_struct(points, speeds)



stop1 = (40.64404, -8.63906)
stop2 = (40.6434, -8.64491)
expected_time_between_stops = 120

result = generate_result_given_stops(stop1, stop2, expected_time_between_stops)

formated_result = format_result(result)
fhandle = open("test.json", "w")
fhandle.write(formated_result)
fhandle.close()
