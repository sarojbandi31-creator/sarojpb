import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

interface UseBlogFeedState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

// CORS proxy to handle cross-origin RSS feed requests
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY_ALTERNATIVE = 'https://api.allorigins.win/raw?url=';

export function useBlogFeed(feedUrl?: string): UseBlogFeedState {
  const [state, setState] = useState<UseBlogFeedState>({
    posts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!feedUrl) {
      setState({
        posts: [],
        loading: false,
        error: 'No feed URL provided',
      });
      return;
    }

    const fetchBlogPosts = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Try fetching with alternative CORS proxy first
        const url = `${CORS_PROXY_ALTERNATIVE}${encodeURIComponent(feedUrl)}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const text = await response.text();

        // Parse RSS feed
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          throw new Error('Failed to parse RSS feed');
        }

        // Extract feed entries
        const entries = xmlDoc.querySelectorAll('entry, item');
        const posts: BlogPost[] = [];

        entries.forEach((entry) => {
          try {
            const title =
              entry.querySelector('title')?.textContent ||
              entry.querySelector('h3')?.textContent ||
              'Untitled';
            const link = entry.querySelector('link')?.getAttribute('href') || 
                        entry.querySelector('link')?.textContent ||
                        '';
            const published =
              entry.querySelector('published')?.textContent ||
              entry.querySelector('pubDate')?.textContent ||
              new Date().toISOString();
            const content =
              entry.querySelector('content')?.textContent ||
              entry.querySelector('description')?.textContent ||
              entry.querySelector('summary')?.textContent ||
              '';
            
            // Extract author
            const author =
              entry.querySelector('author')?.querySelector('name')?.textContent ||
              entry.querySelector('author')?.textContent ||
              'Unknown Author';

            // Extract image from content or media elements
            let image = '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
              image = imgMatch[1];
            } else {
              const mediaContent = entry.querySelector('media\\:content');
              if (mediaContent) {
                image = mediaContent.getAttribute('url') || '';
              } else {
                const mediaThumb = entry.querySelector('media\\:thumbnail');
                if (mediaThumb) {
                  image = mediaThumb.getAttribute('url') || '';
                }
              }
            }

            // Create excerpt (first 150 chars of content without HTML)
            const cleanContent = content.replace(/<[^>]*>/g, '');
            const excerpt = cleanContent.slice(0, 150).trim() + (cleanContent.length > 150 ? '...' : '');

            if (title && published) {
              posts.push({
                id: link || title,
                title: title.trim(),
                excerpt: excerpt || title,
                content: cleanContent,
                date: new Date(published).toISOString().split('T')[0],
                image: image || '/gallery/abstract-1.jpg', // Default image if not found
                author: author.trim(),
              });
            }
          } catch (error) {
            console.error('Error parsing entry:', error);
          }
        });

        // Limit to 10 most recent posts
        const limitedPosts = posts.slice(0, 10);

        setState({
          posts: limitedPosts,
          loading: false,
          error: limitedPosts.length === 0 ? 'No blog posts found in feed' : null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load blog posts';
        setState({
          posts: [],
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchBlogPosts();
  }, [feedUrl]);

  return state;
}
