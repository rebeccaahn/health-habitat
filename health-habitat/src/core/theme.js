import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3b6041',
        secondary: '#414757',
        blueGradient: ['#133745', '#6CA5BE'],
        brownGradient: ['#41210A', '#6F5949'],
        darkGreenGradient: ['#091609', '#243424'],
        blue: '#5d8b9f'
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    }
}