export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Finding Inspiration',
    excerpt: 'Exploring the everyday moments that spark creativity and fuel the artistic journey.',
    content: `Finding inspiration is perhaps the most mysterious aspect of being an artist. It comes unexpectedly—in the way morning light filters through a window, in the weathered face of a stranger, or in the chaos of a bustling marketplace.

For me, inspiration often arrives during quiet moments of observation. I've learned to always carry a small sketchbook, ready to capture fleeting impressions before they fade. Sometimes a single color combination observed in nature becomes the foundation for an entire series.

The key is to remain open and present. Art is everywhere, waiting to be discovered by those who take the time to truly see.`,
    date: '2024-01-15',
    image: '/gallery/abstract-1.jpg',
    author: 'Rasayan Studio',
  },
  {
    id: '2',
    title: 'Exploring Color Theory in Abstract Art',
    excerpt: 'How understanding color relationships transforms the emotional impact of paintings.',
    content: `Color is the language of emotion in abstract art. While representational painting relies on recognizable forms, abstract work communicates primarily through color relationships, creating mood and movement without depicting reality.

In my recent abstract series, I've been exploring the tension between warm and cool tones. The interplay between earthy ochres and cool grays creates a visual dialogue that viewers feel before they intellectualize.

Understanding complementary colors, value contrasts, and color temperature has transformed my approach to composition. Each painting begins with a color story—an emotional narrative told through pigment.`,
    date: '2024-02-20',
    image: '/gallery/abstract-2.jpg',
    author: 'Rasayan Studio',
  },
  {
    id: '3',
    title: 'The Importance of Traditional Techniques',
    excerpt: 'Why mastering classical methods remains essential in contemporary art practice.',
    content: `In an age of digital tools and AI-generated imagery, there's something profoundly meaningful about working with traditional materials—the weight of a brush, the smell of linseed oil, the slow building of layers.

Classical techniques taught me patience. Unlike digital work where changes are instant and unlimited, oil painting demands planning and commitment. Each brushstroke is a decision that cannot be easily undone.

This deliberate approach has deepened my connection to the work. The physical act of mixing pigments and applying them to canvas becomes a meditation, a dialogue between artist and material.`,
    date: '2024-03-10',
    image: '/gallery/portrait-1.jpg',
    author: 'Rasayan Studio',
  },
];
