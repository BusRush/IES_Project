import cv2

# Capture video from the camera
cap = cv2.VideoCapture(0)

# Create a HOG descriptor
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

while True:
    # Read a frame from the camera
    _, frame = cap.read()

    # Detect human movement in the frame
    humans, _ = hog.detectMultiScale(frame)

    # Draw a rectangle around each detected human
    for (x, y, w, h) in humans:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Show the frame
    cv2.imshow('Camera', frame)

    # Check if the user pressed the 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all windows
cap.release()
cv2.destroyAllWindows()

