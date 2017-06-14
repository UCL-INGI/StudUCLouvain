# UCLCampus
UCLcampus is an application designed to accompany UCL students in their daily life on campus. Contributions are welcome for any good feature.

## Prerequisites
- Download nodejs from https://nodejs.org/en/download/current/ It will install `node` and `npm`
```bash
node -v
 - should be >= 6.0.0
npm -v
 - should be >= 3.0.0
```
- For iOS, update XCode version to 8.0 or higher

## Getting Started

* Clone this repository

* Install Ionic, cordova and node_modules
    ```bash
    $ npm install -g ionic cordova
    ```
* or update Ionic
    ```bash
    $ npm uninstall -g ionic cordova
    $ npm install -g ionic cordova
    ```

* Google Maps Plugin

   ```bash
   $ ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="YOUR_ANDROID_API_KEY_IS_HERE" -- variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_IS_HERE"
   $ npm install --save @ionic-native/google-maps
   ```
## Run

### Browser
```bash
$ ionic serve
```

### Android

```bash
$ ionic cordova platform add android
$ ionic cordova run android
```

### iOS
```bash
$ ionic cordova platform add ios
$ ionic cordova build ios
```

## Features

### Existing Features

* Display event of CarpeStudentem
* Launch carpooling app https://www.commuty.net
* Launch Resto4u app
* Help Desk, How to connect to the university network
* Maps with point of interest on campus

### Future Features

* Display News of UCL
* Display course schedule (ADE)
* Add course schedule to your calendar
* Display Libraries schedule and more informations
* Authentication with OAuth 2.0
* Studentbook and Staffbook
* Display Sports schedule

## Screenshots

<img src="screenshots/news.png" alt="android-tablet" width="350"/>
<img src="screenshots/menu.png" alt="android-tablet" width="350"/>
<img src="screenshots/carte.png" alt="android-tablet" width="350"/>
<img src="screenshots/etudes_1.png" alt="android-tablet" width="350"/>
<img src="screenshots/etudes_2.png" alt="android-tablet" width="350"/>

## User Guide


## Contribution
Contributions are welcome!

* Report issues
* Open pull request with improvements
* Spread the word

### Developper Guide


## License
UCLCampus is available under the GNU/GPLv3 license. See the LICENSE file for more info.
