// /pages/blog/index.js
import Link from 'next/link';
import Image from 'next/image';
import { blogs } from '../../data/blogs';

export default function BlogList() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Travel Blog</h1>
      {blogs.map((blog) => (
        <div key={blog.slug} style={{ marginBottom: '2rem' }}>
          <Link href={`/blog/${blog.slug}`}>
            <h2 style={{ cursor: 'pointer', color: 'blue' }}>{blog.title}</h2>
          </Link>
          <Image
            src={blog.image}
            alt={blog.title}
            width={600}
            height={400}
            style={{ borderRadius: '8px' }}
          />
          <p>{blog.content.substring(0, 150)}...</p>
          <Link href={`/blog/${blog.slug}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
