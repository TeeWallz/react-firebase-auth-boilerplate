import { useRef, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { useAuth } from '../contexts/Auth'
import { Google_Button_SignIn, Github_Button_SignIn, Email_Button_SignIn } from './LoginButtons'

export function SupabaseFeatures() {
    const emailRef = useRef()
    // const passwordRef = useRef()

    // Get signUp function from the auth context
    const { user } = useAuth()

    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        // // Get email and password input values
        // const email = emailRef.current.value
        // const password = passwordRef.current.value

        // // Calls `signIn` function from the context
        // const { error } = await signIn({ email, password })

        // if (error) {
        //     alert('error signing in')
        // } else {
        //     // Redirect user to Dashboard
        //     history.push('/')
        // }
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div style={{display: 'flex'}}>
                    <div>
                        <label htmlFor="input-email">Number 1</label>
                        <input id="input-email" type="number" ref={emailRef} style={{ width: '150px' }} autocomplete="new-password"/>
                    </div>
                    <div style={{marginLeft: '20px'}}>
                        <label htmlFor="input-email" >Number 2</label>
                        <input id="input-email" type="number" ref={emailRef} style={{ width: '150px' }} />
                    </div>
                </div>

                <br />

                <button type="submit">Login</button>
                <br />

            </form>

            <p>

            </p>
        </>
    )

}