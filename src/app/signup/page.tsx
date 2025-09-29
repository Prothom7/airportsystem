'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast"
import { useRouter } from "next/navigation";
import styles from './signup.module.css';
import Link from "next/link";

export default function SignupPage(){

    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: ""
    })

    const [buttonDisabled, setButtonDisabled] = useState
    (false)

    const[loading, setLoading] = useState(false)

    const onSignup = async() =>{
        try{
            setLoading(true)
            const response = await axios.post("/api/users/signup", user)
            console.log("Signup success", response.data);
            router.push('/login')
        }
        catch(error : any)
        {
            console.log("Signup failed");
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0)
        {
            setButtonDisabled(false)
        }
        else{
            setButtonDisabled(true)
        }
    }, [user])

    return(
        <div className={styles.fullpage}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    {loading ? "Processing..." : "Sign Up"}
                </h2>
                <form onSubmit={onSignup} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        className={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        className={styles.input}
                        required
                    />
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={buttonDisabled || loading}
                    >
                        {buttonDisabled ? "Fill all fields" : loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <Link href="/login" className={styles.link}>Already have an account?</Link>
                </form>
            </div>
        </div>
    )
}

