import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogs';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-accent font-sans">Thoughts & Stories</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-primary mt-4">
            Blog
          </h1>
          <p className="text-muted-foreground font-sans mt-4 max-w-xl mx-auto">
            Insights into the artistic process, inspirations, and reflections from the studio.
          </p>
          <div className="section-divider mt-8" />
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link
            to={`/blog/${blogPosts[0].id}`}
            className="group block max-w-5xl mx-auto"
          >
            <article className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300">
              <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="text-xs tracking-widest uppercase text-accent font-sans">Featured</span>
                <time className="block text-sm text-muted-foreground mt-2">
                  {new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-primary mt-3 group-hover:text-accent transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="mt-6 flex items-center text-accent group-hover:text-primary transition-colors">
                  <span className="text-sm font-sans">Read Article</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <article className="bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <time className="text-xs text-muted-foreground font-sans">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3 className="font-serif text-xl font-medium text-primary mt-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-accent group-hover:text-primary transition-colors">
                      <span className="text-sm font-sans">Read More</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
