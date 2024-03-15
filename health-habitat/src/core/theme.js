import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#617C60',
        secondary: '#414757',
        blueGradient: ['#133745', '#6CA5BE'],
        darkBlueGradient: ['#14011d', '#2a0a3a', '#182b61'],
        tealGradient: ['#010c14', '#274154'],
        brownGradient: ['#41210A', '#6F5949'],
        darkGreenGradient: ['#091609', '#455945'],
        orangeGradient: ['#4c2900', '#b56507'],
        darkBlue: '#133745',
        darkTeal: '#020d15',
        darkBrown: '#41210A',
        darkestBlue: '#14011d',
        blue: '#5d8b9f',
        lightBlue: '#6CA5BE',
        darkGreen: '#243424',
        darkestGreen: '#091609',
        fadedGrey: '#c7b6a3'
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