// /pages/inspiration/index.js
import Link from "next/link";
import { blogs } from "../../data/blogs";

export default function Inspiration() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inspiration</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <Link key={post.slug} href={`/inspiration/${post.slug}`}>
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
