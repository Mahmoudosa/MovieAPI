export const mockCategories = [
  { id: 1, name: 'Science Fiction', description: 'Stories about science, space, and imagined futures.' },
  { id: 2, name: 'Drama', description: 'Character-driven stories and human experiences.' },
  { id: 3, name: 'Mystery', description: 'Stories built around puzzles and hidden truths.' },
  { id: 4, name: 'Adventure', description: 'Journeys, discoveries, and daring quests.' },
  { id: 5, name: 'Romance', description: 'Stories centered on relationships and connection.' }
];

export const mockUsers = [
  { id: 1, userName: 'Movie Fan', email: 'fan@example.com', role: 'User', enabled: true, joinedAt: '2025-02-02' },
  { id: 2, userName: 'screenwriter_sam', email: 'sam@example.com', role: 'Author', enabled: true, joinedAt: '2025-02-14' },
  { id: 3, userName: 'cinema.lee', email: 'lee@example.com', role: 'User', enabled: true, joinedAt: '2025-03-01' },
  { id: 4, userName: 'admin.demo', email: 'admin@example.com', role: 'Admin', enabled: false, joinedAt: '2025-01-10' }
];

export const mockReviews = [
  {
    id: 'demo-review-1',
    movieId: 1,
    userId: 3,
    userName: 'cinema.lee',
    rating: 5,
    comment: 'Beautifully paced, with a final act that stayed with me.',
    createdAt: '2025-03-15T12:00:00.000Z'
  },
  {
    id: 'demo-review-2',
    movieId: 2,
    userId: 1,
    userName: 'Movie Fan',
    rating: 4,
    comment: 'A thoughtful story with a wonderful sense of place.',
    createdAt: '2025-03-14T12:00:00.000Z'
  },
  {
    id: 'demo-review-3',
    movieId: 3,
    userId: 2,
    userName: 'screenwriter_sam',
    rating: 5,
    comment: 'An inventive mystery with great atmosphere.',
    createdAt: '2025-03-13T12:00:00.000Z'
  },
  {
    id: 'demo-review-4',
    movieId: 6,
    userId: 3,
    userName: 'cinema.lee',
    rating: 3,
    comment: 'Strong performances, though I wanted a little more from the ending.',
    createdAt: '2025-03-10T12:00:00.000Z'
  }
];

export const mockArticles = [
  {
    id: 'article-1',
    title: 'Why quiet science fiction is having a moment',
    relatedMovieId: 1,
    summary: 'A look at the small, human stories finding a home among the stars.',
    content: 'The biggest ideas in science fiction do not always need the biggest explosions. Some of the most memorable recent stories take time to sit with the people behind the technology...',
    status: 'Published',
    updatedAt: '2025-03-16T10:00:00.000Z'
  },
  {
    id: 'article-2',
    title: 'A map of stories yet to come',
    relatedMovieId: 4,
    summary: 'How maps, memory, and myth come together in modern adventure films.',
    content: 'Every map is an invitation to imagine what lies beyond its edges. Adventure stories understand this instinct and turn it into a journey...',
    status: 'Draft',
    updatedAt: '2025-03-12T10:00:00.000Z'
  },
  {
    id: 'article-3',
    title: 'The mystery of the unreliable archive',
    relatedMovieId: 3,
    summary: 'When a film’s records become clues, the audience becomes an investigator.',
    content: 'Archives promise an orderly past. Mystery films become especially compelling when that promise begins to fall apart...',
    status: 'Published',
    updatedAt: '2025-03-08T10:00:00.000Z'
  }
];

export const defaultAuthorProfile = {
  userName: 'screenwriter_sam',
  email: 'sam@example.com',
  biography: 'Film enthusiast writing about the stories behind the screen.'
};

export const mockRecentActivity = [
  { id: 1, label: 'cinema.lee reviewed The Last Signal', time: '12 minutes ago', icon: '✎' },
  { id: 2, label: 'A new account was created by sam@example.com', time: '1 hour ago', icon: '＋' },
  { id: 3, label: 'Second Orbit was added to the collection', time: 'Yesterday', icon: '▤' },
  { id: 4, label: 'A Quiet Meridian received a 4-star review', time: 'Yesterday', icon: '★' }
];
