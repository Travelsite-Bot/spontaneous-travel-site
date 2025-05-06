// /pages/blog/[slug].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import { blogs } from '../../data/blogs';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{blog.title}</h1>
      <Image
        src={blog.image}
        alt={blog.title}
        width={800}
        height={500}
        style={{ borderRadius: '8px' }}
      />
      <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{blog.content}</p>
    </div>
  );
}
