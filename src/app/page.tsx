'use client';

import styles from './page.module.css'
import HomePage from "@/components/HomePage";
import {useEffect} from "react";
import {state} from "@/store";

export default function Home() {

    useEffect(() => {
        state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

  return (
    <main className={styles.main}>
      <HomePage/>
    </main>
  )
}
