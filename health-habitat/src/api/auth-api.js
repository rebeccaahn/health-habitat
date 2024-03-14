import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth'
import { auth } from '../core/config'

export const logoutUser = () => {
  signOut(auth)
}

export const signUpUser = async ({ name, email, password }) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        auth.currentUser.updateProfile({
            displayName: name,
            email: email
          })
        return { user }
    } catch (error){
        return {
            error: error.message
        }
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        return { user }
    } catch (error){
        return {
            error: error.message
        }
    }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}