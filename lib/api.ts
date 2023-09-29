import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

function getDirectory(directory: string) {
  return join(process.cwd(), directory);
}

export function getPostSlugs(directory: string) {
  const postsDirectory = getDirectory(directory);
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(
  slug: string,
  fields: string[] = [],
  directory = "_posts",
) {
  const postsDirectory = getDirectory(directory);
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = [], directory = "_posts") {
  const slugs = getPostSlugs(directory);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields, directory))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
