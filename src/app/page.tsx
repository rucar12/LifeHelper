'use client';

import styles from './page.module.css'
import HomePage from "@/components/HomePage";
import {useEffect} from "react";

export default function Home() {

    useEffect(() => {
        localStorage.setItem('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }, []);

  return (
    <main className={styles.main}>
      <HomePage/>
    </main>
  )
}
