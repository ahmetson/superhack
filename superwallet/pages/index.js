import Head from 'next/head';
import styles from '../styles/Home.module.css';
import AppBar from '../components/appbar';
import Balances from "../components/balances";
import {Container} from "@mui/material";

export default function Home() {
  return (
      <Container className={styles.container}>
        <Head>
          <title>SuperWallet</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <AppBar />
          <Balances></Balances>
      </Container>
  )
}
