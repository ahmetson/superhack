import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const postDirectory = path.join(process.cwd(), 'posts');

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postDirectory, `${id}.md`);
    const contents = fs.readFileSync(fullPath, 'utf8');

    const matterResults = matter(contents);

    const processedData = await remark().use(html).process(matterResults.content)
    const contentHtml = processedData.toString();

    return {
        id,
        contentHtml,
        ...matterResults.data,
    }
}

export function getSortedPosts() {
    const fileNames = fs.readdirSync(postDirectory);

    const allPostData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postDirectory, fileName);
        const contents = fs.readFileSync(fullPath, 'utf8');

        const matterResults = matter(contents);

        return {
            id,
            ...matterResults.data,
        }
    })

    return allPostData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    })
}