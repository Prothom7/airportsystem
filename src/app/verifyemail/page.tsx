'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styles from './verifyemail.module.css'

export default function VerifyEmailPage(){

    const router = useRouter()
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try{
            await axios.post("/api/users/verifyemail", {token})
            setVerified(true)
            setError(false)
        }
        catch(error:any)
        {
            setError(true)
            console.log(error.response.data);
        }
    }

    useEffect(() =>{
        setError(false)
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
    }, [])

    useEffect(() =>{
        setError(false)
        if(token.length > 0){
            verifyUserEmail()
        }
    }, [token])

    return(
        <div className={styles.fullpage}>
        <div className={styles.container}>
            {!verified && !error && (
                <h2 className={styles.title}>Verifying your email...</h2>
            )}

            {verified && (
                <>
                    <h2 className={styles.title}>Email Verified </h2>
                    <p className={styles.message}>Your email has been successfully verified.</p>
                    <a href="/login" className={styles.button}>Go to Login</a>
                </>
            )}

            {error && (
                <>
                    <h2 className={styles.title}>Email Verified </h2>
                    <p className={styles.message}>Your email has been successfully verified.</p>
                    <a href="/login" className={styles.button}>Go to Login</a>
                </>
            )}
        </div>
    </div>
    )
}