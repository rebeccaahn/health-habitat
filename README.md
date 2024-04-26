# Health Habitat
By: Rebecca Ahn, Angeline Hui, Teresa Liang, Nathan Pietrantonio

## Setting up the app
1. Download or Clone the repo

### Setup Backend
2. Navigate into `backend/recommendation`
3. Run: `pip install -r requirements.txt`
    * Optional: create and source Python virtual environment
4. Run: `python recommendation_api.py`
    * Leave this running in the background, this service hosts the backend recommendation API
5. Download the env.json (TODO: FIX)
6. Move the env.json file to the health-habitat/src/api directory

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
   * Terrarium
      * After logging in, users are presented with a "terrarium" which slowly "dies" over time if they do not keep their health score above pre-determined values
   * Health Score
      * The health score is a rounded value reprsented by ((Diet Score + Meditation Score + Exercise Score) / 3)
      * This score represents the user's "overall" scoring and it slowly decreases over time as the scores in each category decrease
      * The user can complete tasks in each category to increase this score, but doing tasks in one category can only get, at most, 1/3 of this overall score
   * Recommendation Categories
      * Each of these categories has a score which decreases with time. This score can be increased throughout the day by completing the recommended tasks in each.
      * Diet Recommendations
         * Diet recommednations use the [Spoonacular](https://spoonacular.com/food-api/console#Dashboard) API to recommend a recipe to make
      * Meditation Recommendations
         * Meditation uses a Random Forest Classifier to recommend a music genre to meditate to. This cateogry then filters down to one song, and recommends a location to meditate at based off of user context
      * Exercise Recommendations
         * Exercise uses a Gradient Boosting Regressor to recommend an intensity level of exercise to complete. A final exercise recommendation is then made based off of user context and a user model. This user model incorporates data about the user's previous exercise behavior, the equipment they have, and their access to a gym
