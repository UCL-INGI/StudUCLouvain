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
    $ npm uninstall -g ionic cordova
    $ npm install -g ionic cordova
    $ npm install
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

## Screenshots

## User Guide

## Existing Features



## Contribution
Contributions are welcome!

* Report issues
* Open pull request with improvements
* Spread the word

### Developper Guide


## License
UCLCampus is available under the GNU/GPLv3 license. See the LICENSE file for more info.
