# Stud.UCLouvain
Stud.UCLouvain is an application designed to accompany UCLouvain students in their daily life on campus. Contributions are welcome for any good feature.

[WIP] Possible major update (+ migration to Ionic_v4) : https://github.com/BenJneB/StudUCLouvain_ionic-v4

## Feel free to collaborate. 
### Anyone wishing to participate and/or propose new features should not hesitate to contact StudUCLouvain@uclouvain.be or directly make a pull-request on the repo concerned.

[![Join the chat at https://gitter.im/UCLCampus/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/UCLCampus/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Prerequisites
- Download nodejs from https://nodejs.org/en/download/current/ It will install `node` and `npm`
```bash
node -v
 - should be >= 6.0.0
npm -v
 - should be >= 3.0.0
```
- For iOS, update XCode version to 8.0 or higher

- Get Google Maps API keys :
    * Go to Google Console : https://console.developers.google.com/flows/enableapi?apiid=maps\_backend,geocoding\_backend,directions\_backend,distance\_matrix\_backend,elevation\_backend,places\_backend&reusekey=true
    * Select or create a project
    * Click on continue to activate the API
    * Once you are on page Credentials, select the Javascript API. Click on the blue button to create the key.
    * Click on the library button on the left pane
    * Select Google Maps Android and then enable the service, repeat this step for Google Maps iOS
    * Click on credentials on the left pane, create two more api keys (one for Android, one for iOS
    * Click on each new key to restrict it's access (Android restriction, iOS restriction, HTTP referent restriction)

## Getting Started

* Clone this repository

* Install Ionic, cordova
    ```bash
    $ npm install -g ionic cordova
    ```
* or update Ionic
    ```bash
    $ npm uninstall -g ionic cordova
    $ npm install -g ionic cordova
    ```
* Install node_modules
    ```bash
    $ npm install
    ```    
* Replace the values of "myapikeyforandroid" and "myapikeyforios" by the keys you created in the Google Console, in the file UCLCampus/config.xml  
    ```xml
    <plugin name="cordova-plugin-googlemaps" spec="~1.4.0">
      <variable name="API_KEY_FOR_ANDROID" value="myapikeyforandroid" />
      <variable name="API_KEY_FOR_IOS" value="myapikeyforios" />
    </plugin>
    ```
* or install it with
   ```bash
   $ ionic cordova plugin add https://github.com/mapsplugin/cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="YOUR_ANDROID_API_KEY_HERE" --variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_HERE"
    ```
* Replace the value of "myapikey" by your Javascript key in the file StudUCLouvain/src/app/variables-config.ts


    
## Run

### Browser
```bash
$ ionic serve
```

### Android

* Prepare the cordova build (If this does not work, skip this step and try again after the next step. If this does not work again, ignore and test without): 
    ```bash
    $ cordova prepare
    ```
```bash
$ ionic cordova platform add android
$ ionic cordova run android
```

### iOS
* Prepare the cordova build (If this does not work, skip this step and try again after the next step. If this does not work again, ignore and test without): 
    ```bash
    $ cordova prepare
    ```
```bash
$ ionic cordova platform add ios
$ ionic cordova build ios
```

## Tests

### Unit Tests : Karma
To run the unit tests
```bash
$ npm test
```
### E2E Tests : Protractor
To run the E2E tests
```bash
$ ionic serve
$ npm run e2e
```
## Features

### Existing Features

* Display course schedule (ADE) and select your session
* Add course schedule to your calendar
* Display annual course program
* Display Libraries schedule and more informations
* Display News of UCL
* Display Events of CarpeStudentem
* Display Sports schedule
* Launch carpooling app https://www.commuty.net
* Launch train app https://www.belgiantrain.be/fr/travel-info/prepare-for-your-journey/use-the-sncb-app
* Launch bus app https://nextride.be/timetables
* Launch Resto4u app
* Help Desk, How to connect to the university network
* Maps with point of interest on campus
* Staffbook
* Campaign Guindaille2.0

### Future Features

* Display exam score

## User Guide

## Contribution
Contributions are welcome!

* Report issues
* Open pull request with improvements
* Spread the word

### Developper Guide

## Contact
* In case of problems, please contact us : StudUCLouvain@uclouvain.be

## License
Stud.UCLouvain is available under the GNU/GPLv3 license. See the LICENSE file for more info.
