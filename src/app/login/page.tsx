'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import styles from './login.module.css';
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onlogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("login success", response.data);
            router.push('/home');
        } catch (error: any) {
            console.log("Login failed");
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password));
    }, [user]);

    return (
        <div className={styles.fullpage}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    {loading ? "Processing..." : "Login"}
                </h2>
                <form onSubmit={onlogin} className={styles.form}>
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
                        {buttonDisabled ? "Fill all fields" : loading ? "Logging in..." : "Log In"}
                    </button>
                    <Link href="/signup" className={styles.link}>
                        Don't have an account?
                    </Link>
                </form>
            </div>
        </div>
    );
}