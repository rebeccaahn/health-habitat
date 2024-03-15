import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
// import Logo from '../../components/Logo'
import TextInput from '../../components/TextInput'
import Toast from '../../components/Toast'
import PlainText from '../../components/PlainText'
import { theme } from '../../core/theme'
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'
import { nameValidator } from '../../utils/nameValidator'
import { signUpUser } from '../../api/auth-api'

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const onSignUpPressed = async () => {
        // if (loading) return
        const nameError = nameValidator(name.value)
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError || nameError) {
            setName({ ...name, error: nameError })
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            return
        }

        setLoading(true)
        const response = await signUpUser({
            name: name.value,
            email: email.value,
            password: password.value
        })
        if (response.error){
            setError(response.error)
        }
        setLoading(false)
    }

    return (
        <Background color={theme.colors.darkGreenGradient}>
            <BackButton goBack={() => navigation.goBack()} />

            <Header style={{ marginBottom: 65 }} props="Create Account" />

            <TextInput
                label="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={text => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
            />

            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            <Button
                mode="contained"
                onPress={() => {onSignUpPressed()}}
                style={{ marginTop: 24 }}
                loading={loading}
            >
                SIGN UP
            </Button>
            <View style={styles.row}>
                <PlainText style={styles.label} props="Already have an account? " />
                <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
                    <Text style={[theme.smText, styles.link]}>Login</Text>
                </TouchableOpacity>
            </View>
            <Toast message={error} onDismiss={() => setError('')} />
        </Background>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 4
    },
    label: {
        color: theme.colors.secondary
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary
    }
})