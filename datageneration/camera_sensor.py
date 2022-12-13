import cv2
import imutils
import numpy as np
import argparse
import datetime
import csv
import socket
import selectors
import logging

HOGCV = cv2.HOGDescriptor()
HOGCV.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

class CameraSensor:
    def __init__(self):
        # Create a socket SIO server
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sel = selectors.DefaultSelector()

        # Bind the socket to a host and port
        try:
            self.server.bind(('localhost', 4000))
            print("Camera sensor server bind on (localhost, 4000)!")
        except Exception as e:
            print(f"Failed to bind server: {e}")
        
        # Listen for incoming connections
        try:
            self.server.listen()
            print("Ready to receive connections!")
        except Exception as e:
            print(f"Failed to start listening: {e}")

        self.sel.register(self.server, selectors.EVENT_READ, self.accept)

    # Define a function to handle connections
    def accept(self, sock):
        # This function will be executed whenever a client connects to the server
        print('A new client has connected to the server')
        # Accept the connection
        client, address = sock.accept()
        #logging.debug(f"ACCEPTED: {conn} , {addr}")
        self.sel.register(client, selectors.EVENT_READ, self.read)

    def read(self, connection): 
        # This function is called whenever there is incoming data on the connection
        try:
            # Receive data from the client
            data = connection.recv(1024)
            # If there is no data, the client has closed the connection
            if data:
                # Do something with the data received
                print(data)
            else:
                # Close the connection
                connection.close()
                self.sel.unregister(connection)
        except Exception as e:
            # Log the error
            print(e)
            # Close the connection
            connection.close()
            self.sel.unregister(connection)

    def send(self, connection, msg): 
        connection.send(msg)


    # Define a function to handle requests 
    def on_request(request_name, data):
        # Check the request name and handle the request as needed
        if request_name == 'connection':
            # Use the data to determine what data to send back to the client
            response_data = {'response': 'my_response'}
            print("Connected")

    def loop(self): 
        try: 
            while True: 
                events = self.sel.select()
                for key, mask in events: 
                    callback = key.data
                    callback(key.fileobj)
        except KeyboardInterrupt:
            self.server.close()

        '''
        base, ext = os.path.splitext(ctx.params['sensor_footage'])
        if camera == 'True':
            print("True")
            detectByCamera(None)
        elif ctx.params['sensor_footage'] is not None and camera == 'False':
            if ext.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
                passengers = detectByPathImage(ctx.params['sensor_footage'])
                return passengers
            elif ext.lower() in ['.mp4', '.avi', '.mov', '.mkv']:
                passengers = detectByPathVideo(ctx.params['sensor_footage'], "videooooo.txt")
                return passengers
            else:
                print("Not valid input file!")
                return random.randint(0, BUS_CAPACITY)
        else:
            return random.randint(0, BUS_CAPACITY)'''


    def detectByCamera(self, writer): 
        # Create a VideoCapture object
        cap = cv2.VideoCapture(2)

        # Set the width and height of the frame
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        while True:
            print("Start")
            # Capture frame-by-frame
            ret, frame = cap.read()

            # Count the number of people
            result_image, person = self.detect(frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # When everything done, release the capture
        cap.release()
        cv2.destroyAllWindows()

    def detectByPathImage(self, path):
        image = cv2.imread(path)

        image = imutils.resize(image, width = min(800, image.shape[1])) 

        result_image, person = self.detect(image)

        # Show image with the people counter 
        #cv2.imshow('Detecting people...', result_image)
        # Press any key to close the image
        #cv2.waitKey(0)
        # Save the image
        #cv2.write('result_image.jpg', result_image)
        #cv2.destroyAllWindows()

        return person


    def detectByPathVideo(self, path, writer):

        video = cv2.VideoCapture(path)
        check, frame = video.read()
        if check == False:
            print('Video Not Found. Please Enter a Valid Path (Full path of Video Should be Provided).')
            return

        print('Detecting people...')
        while video.isOpened():
            #check is True if reading was successful 
            check, frame =  video.read()

            if check:
                frame = imutils.resize(frame , width=min(800,frame.shape[1]))
                frame, people = self.detect(frame)
            
                if writer is not None:
                    writer.write(frame)
                
                key = cv2.waitKey(1)
                if key== ord('q'):
                    break
            else:
                break
        video.release()
        cv2.destroyAllWindows()

        return people

    def detect(self, frame):
        bounding_box_cordinates, weights = HOGCV.detectMultiScale(frame, winStride = (4, 4), padding = (8, 8), scale = 1.03)
        
        person = 1
        for x,y,w,h in bounding_box_cordinates:
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)
            cv2.putText(frame, f'person {person}', (x,y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
            person += 1
        
        cv2.putText(frame, 'Status : Detecting ', (40,40), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255,0,0), 2)
        cv2.putText(frame, f'Total Persons : {person-1}', (40,70), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255,0,0), 2)
        cv2.imshow('output', frame)
        datetimee = datetime.datetime.now().__format__('%Y-%m-%d %H:%M:%S')
        print(f"LOG: {person} people detected at {datetimee}")
        return frame, person


if __name__ == '__main__':
    camera = CameraSensor()
    camera.loop()   



