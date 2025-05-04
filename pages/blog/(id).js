// pages/blog/[id].js
import { useRouter } from 'next/router';
import blogs from '../../data/blogs';

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const blog = blogs.find((b) => b.id === id);

  if (!blog) return <p className="p-8">Blog post not found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover mb-6" />
      <p>{blog.content}</p>
    </div>
  );
}
