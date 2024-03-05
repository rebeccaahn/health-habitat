# Apple HealthKit Integration API Reference
The Apple API has two sets of functions, one in `dummyData.js` and one in `prodData.js`.<br/>
The functions in `prodData.js` make calls to the Apple HealthKit integration on device for the final implementation.<br/>
The functions in `dummyData.js` return predefined dummy data to allow for testing off-device.<br/><br/>

To switch between the "dummy" and "production" data, switch the prop `isProd` in `appleHealthApi.js` between `true` and `false`.<br/>

To use location you must ru `npx expo install expo-location`
