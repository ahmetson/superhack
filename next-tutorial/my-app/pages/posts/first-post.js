import Link from 'next/link';
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Layout from "../../components/layout";

const ImgComp = () => (
    <Image src="/images/profile.jpg" alt="Default profile picture" width={144} height={144}></Image>
)

export default function FirstPost() {
    return (
        <Layout>
            <Head key={"first_post"}>
                <title>First post title</title>
            </Head>
            <Script
                src="https://connect.facebook.network/en_US/sdk.js"
                strategy={"lazyOnload"}
                onLoad={()=>{
                    console.log(`Facebook script was loaded`);
                }}
            />
            <h1>First Post!</h1>
            <h2>
                Go to <Link href="/">Back to home</Link>
            </h2>
            <ImgComp></ImgComp>
        </Layout>
    )
}