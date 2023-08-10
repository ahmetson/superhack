import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import {getSortedPosts} from "../lib/posts";
import {createSafe, createTx, getSafeInfo} from "../lib/safe";
import {useRef, useState} from "react";

export async function getStaticProps() {
  const allPostsData = getSortedPosts();
  return {
    props: {
      allPostsData,
    }
  }
}

export default function Home({allPostsData}) {
  const [safeAddr, setSafeAddr] = useState('0x9aA406F08c02c33E3377a38d543d9C284E0fa6A6');
  const [to, setTo] = useState('');
  const [value, setValue] = useState(0.0);

  function handleSafeCreate() {
    console.log(`Handling safe create...`);
    createSafe().then((addr) => {
      console.log(`Safe was created: ${addr}`);
      setSafeAddr(addr);
    }).catch(err => {console.error(err)});
  }

  function handleSafeInfo() {
    console.log(`Retrieve the information about safe: ${safeAddr}`);
    getSafeInfo(safeAddr).then(info => {
      console.log(`Safe info retrieved:`);
      console.log(info);
    }).catch(err => {console.error(err)});
  }

  function handleSendTx() {
    console.log(`Sending a transaction by ${safeAddr}...`);
    createTx(to, value, safeAddr).then((hash) => {
      console.log(`Transaction was deployed: ${hash}`);
    }).catch(err => {console.error(err)});
  }

  return (
      <div className={styles.container}>
        <Head>
          <title>Testing Safe</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          {safeAddr.length == 0 ?
              <button onClick={handleSafeCreate} className={styles.card}>
                Create a new Safe
              </button> :
              <p>`Safe Address: ${safeAddr}`</p>
          }

          <section>
            <h2>Retrieving the information about the safe</h2>
            <input type="text" value={safeAddr} onChange={(e) => setSafeAddr(e.target.value)} placeholder="Safe address" />
            <button className={styles.card} onClick={handleSafeInfo}>Print Safe info in the console</button>

            <br />

            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Address to send" />
            <input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} placeholder="Amount" />
            <button className={styles.card} onClick={handleSendTx}>Send SWT</button>
          </section>

          <section>
            <h2>Blog</h2>
            <ul>
              {allPostsData.map(({id, date, title}) => (
                  <li key={id}>
                    <Link href={`/posts/${id}`}>{title}</Link><br />
                    <small>{date}</small>
                  </li>
              ))}
            </ul>
          </section>
        </main>

        <style jsx>{`
        main {
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
