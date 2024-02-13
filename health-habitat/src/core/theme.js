import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#617C60',
        secondary: '#414757',
        blueGradient: ['#133745', '#6CA5BE'],
        darkBlueGradient: ['#14011d', '#2a0a3a', '#182b61'],
        tealGradient: ['#020d15', '#0a1f2e'],
        brownGradient: ['#41210A', '#6F5949'],
        darkGreenGradient: ['#091609', '#455945'],
        blue: '#5d8b9f',
        darkGreen: '#243424',
        darkestGreen: '#091609'
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    smText: {
        fontSize: 13,
        letterSpacing: 1,
        color: 'white'
    },
    lgText: {
        fontSize: 18,
        letterSpacing: 2,
        color: 'white'
    }
}