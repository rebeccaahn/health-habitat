import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AuthLoadingScreen,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  QuestionnaireScreen
} from './src/screens/login'
import { TerarriumScreen } from './src/screens/dashboard'
import DietPage from "./src/screens/category/DietPage";
import ExercisePage from "./src/screens/category/ExercisePage";
import MeditationPage from "./src/screens/category/MeditationPage";
import CategoriesPage from "./src/screens/category/CategoriesPage";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['ViewPropTypes']); // ignore errors from react-native-simple-survey
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen
            name="AuthLoadingScreen"
            component={AuthLoadingScreen}
          />
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="QuestionnaireScreen" component={QuestionnaireScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="TerrariumScreen" component={TerarriumScreen} />

        <Stack.Screen name="CategoriesPage" component={CategoriesPage} />
        <Stack.Screen name="DietPage" component={DietPage} />
        <Stack.Screen name="ExercisePage" component={ExercisePage} />
        <Stack.Screen name="MeditationPage" component={MeditationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
