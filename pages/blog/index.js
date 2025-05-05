// /pages/inspiration/index.js
import Link from "next/link";
import { blogs } from "../../data/blogs";

export default function InspirationPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Inspiration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div key={blog.slug} className="border rounded shadow hover:shadow-lg transition">
            <Link href={`/inspiration/${blog.slug}`}>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-sm mt-2">{blog.content.substring(0, 80)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
