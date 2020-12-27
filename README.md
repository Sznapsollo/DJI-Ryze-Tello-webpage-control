# DJI-Ryze-Tello-webpage-control

## About

Simple solution based on Node and Javascript that allows to perform actions on DJI Ryze Tello. It provides script that serves user webpage which matches keyboard keys to following Ryze Tello Actions.

 - Space - start/land
 - Arrow up - fly forward
 - Arrow down - fly back
 - Arrow left - fly left
 - Arrow right - fly right
 - W - go up
 - S - go down
 - A - totate left
 - D - rotate right
 - Y - flip forward
 - H - flip back
 - G - flip left
 - J - flip right

## How to run

 - you need to have node installed
 - go to folder where you downloaded repository and install node-static if you dont have (npm install node-static)
 - now run node server (node server.js)
 - got to localhost:8083 - it should display simple page with mapped keys. Try these keys on the keyboard and see that pressed keys are highlighted
 - connect your computer to Tello wifi
 - hit space (it should initiate Ryze Tello to fly) - then try other keys

## Just to add
 - this is very simple and initial solution that shows how to operate Ryze Tello and you can take it from here
 - Port for local webpage is set for 8083 - change it in server.js for your own convenience
 - values that describe how Ryze moves are hardcoded so one click moves it by 20cm or 20degrees of rotation. You can change it or improve to consider different values, values that grow when you hold key, different speeds or maybe take values from some dynamic form controls etc. You can also receive info from Ryze Tello regarding its battery, video streams etc. For more info see DJI Ryze Tello documentation.

Take care! 
Wanna touch base? office@webproject.waw.pl