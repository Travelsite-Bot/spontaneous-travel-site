// pages/blog/index.js
import blogs from '../../data/blogs';

export default function BlogPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inspiration</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="border rounded-lg overflow-hidden shadow">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.summary}</p>
              <a href={`/blog/${blog.id}`} className="text-blue-500 hover:underline mt-2 block">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
