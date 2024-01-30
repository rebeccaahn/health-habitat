import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import TextInput from '../../components/TextInput'
import Toast from '../../components/Toast'
import { theme } from '../../core/theme'
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const onLoginPressed = async () => {
        // if (loading) return

        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            return
        }

        setLoading(true)

    }

    return (
        <Background>
            <BackButton goBack={() => navigation.goBack()} />

            <Header props="Welcome back" />

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

            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>

            <Button
                mode="contained"
                onPress={onLoginPressed}
                style={{ marginTop: 24 }}
            >
                LOGIN
      </Button>

            <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
            <Toast message={error} onDismiss={() => setError('')} />
        </Background>
    )
}

const styles = StyleSheet.create({
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 24,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        marginTop: 4
    },
    forgot: {
        color: theme.colors.secondary,
        fontSize: 13
    },
    link: {
        color: theme.colors.primary,
        fontWeight: 'bold'
    }
})
