import { auth } from '../../App'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'

export const logoutUser = () => {
  auth.signOut()
}

export const signUpUser = async ({ name, email, password }) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        auth.currentUser.updateProfile({
            displayName: name,
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