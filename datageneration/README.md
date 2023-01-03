## How to Run

### Generate Mocks For Route AVRBUS-R0001 And Shift 064700
./generate_mocks.sh AVRBUS-R0001 064700

### Generate Metrics

### Example on how to run the camera sensor (the Run.py file is inside the Camera Sensor/People-Counting-in-Real-Time directory): 
<pre>
python3 metric_generator.py --device_id AVRBUS-D0000 --route_id AVRBUS-R0011 --route_shift 092000 --sensor_camera True

python Run.py --prototxt mobilenet_ssd/MobileNetSSD_deploy.prototxt --model mobilenet_ssd/MobileNetSSD_deploy.caffemodel --input videos/example_01.mp4 --device_id AVRBUS-D0000
</pre>
