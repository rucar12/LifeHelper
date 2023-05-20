import styles from './page.module.scss'
import HomePage from "@/components/HomePage";
import Layout from "@/components/Layout";

export default function Home() {

  return (
    <main className={styles.main}>
        <Layout />
        <HomePage/>
    </main>
  )
}