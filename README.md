# Health Habitat
### CS 125 Group 33 "Wild Kratz"
By: Rebecca Ahn, Angeline Hui, Teresa Liang, Nathan Pietrantonio

## Setting up the app
1. Download or Clone the repo

### Setup Backend
2. Navigate into `backend/recommendation`
4. Run: `pip install -r requirements.txt`
    * Optional: create and source Python virtual environment
6. Run: `python recommendation_api.py`
    * Leave this running in the background, this service hosts the backend recommendation API

### Setup Frontend
**NOTE:** A Mac with Xcode and Xcode CLI tools is required to compile and run the app

7. Change into the health-habitat directory: `cd health-habitat`
8. Install dependencies
    * `npm install`
    * `npx expo install`
    * `npx expo install react-native-health` (sometimes must be installed individually)
    * `npx expo install expo-location` (sometimes must be installed individually)
9. Compile the app
    * `npx expo run:ios`
10. Quit the expo UI in terminal
11. Install Xcode "pods"
    * `cd ios`
    * `pod install` (may need to run twice)
12. Double-click healthhabitat.xcworkspace to open in Xcode
    * On the left, select "healthhabitat"
    * Click on "Signing and Capabilities" in the center pane
    * Select a team (personal user)
    * Click the "trash bin" icon next to "Push Notifications" (not allowed for non-paying Apple Developers)
    * Click "+" icon in top right of window
    * Add HealthKit permissions
    * Under "healthhabitat" on the left, navigate to `healthhabitat/healthhabitat/info.plist`
    * Add the following rows to `info.plist` (right click -> add row), and add a string (length > 12) for the value of each
         * `Privacy - Health Share Usage Description`
         * `Privacy - Health Update Usage Description`
         * `Privacy - Location Always and When In Use Usage Description`
         * `Privacy - Location When In Use Usage Description`
         * `Privacy - Location Always In Use Usage Description`
     * Save Xcode (cmd + s)
13. Recompile the app: (from `/health-habitat`) `npx expo run:ios`
14. Start development server: `npx expo start`
15. Press `i` to open IOS simulator, allow Health Habitat to install
16. Enjoy!

## Project Functionality
...
