// /pages/inspiration/[slug].js
import { useRouter } from "next/router";
import { blogs } from "../../data/blogs";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const post = blogs.find((b) => b.slug === slug);

  if (!post) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
