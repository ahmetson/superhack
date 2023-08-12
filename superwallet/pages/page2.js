import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import {getSortedPosts} from "../lib/posts";
import {createSafe, createTx, getSafeInfo} from "../lib/safe";
import {useState} from "react";

export default function Page2() {
  return (
      <div className={styles.container}>
        <Head>
          <title>Page 2</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h2>Page 2</h2>
        </main>
      </div>
  )
}
