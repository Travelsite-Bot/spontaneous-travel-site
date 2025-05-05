// pages/blog/index.js
import Link from "next/link";
import { blogs } from "../../data/blogs";

export default function BlogList() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inspiration</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block border rounded overflow-hidden hover:shadow-lg transition-shadow">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{post.content.slice(0, 100)}...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
