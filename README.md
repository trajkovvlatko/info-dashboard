info-dashboard
==============

This is a Phonegap (Cordova) application that can be used as a daily dashboard.
It gets news from several websites, current weather and checks your gmail.

The app uses ruby (sinatra) script to parse the xml for the news, pack the needed info from weather api
and login to imap gmail.
It uses regular imap login for gmail, because oauth2 and phonegap can't access gmail.  

Tested on Android phones, 2.3+.

TODO:
1. Dynamic city name for weather forecast. (Maybe network or gps location to get it automatically)
2. Better mail login.
