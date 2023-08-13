import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {getSortedPosts} from "../lib/posts";
import {useState} from "react";
import AppBar from '../components/appbar';
import Balances from "../components/balances";
export async function getStaticProps() {
  const allPostsData = getSortedPosts();
  return {
    props: {
      allPostsData,
    }
  }
}

export default function Home({allPostsData}) {
  return (
      <div className={styles.container}>
        <Head>
          <title>SuperWallet Safe</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <AppBar />
          <Balances></Balances>
        </main>

        <style jsx>{`
        main {
          margin: 0;
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

        <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      </div>
  )
}
