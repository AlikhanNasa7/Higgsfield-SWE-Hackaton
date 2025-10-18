import { type ContentItem } from '@/types/schemas'

export const mockContents: Record<string, ContentItem[]> = {
  '1': [
    {
      id: 'content-1',
      kind: 'image',
      title: 'Futuristic Cityscape',
      url: 'https://picsum.photos/800/600?random=1',
      thumbUrl: 'https://picsum.photos/200/150?random=1',
      createdAt: '2024-01-15T10:01:00Z',
    },
    {
      id: 'content-2',
      kind: 'image',
      title: 'Enhanced Cityscape with Rain',
      url: 'https://picsum.photos/800/600?random=2',
      thumbUrl: 'https://picsum.photos/200/150?random=2',
      createdAt: '2024-01-15T10:06:00Z',
    },
  ],
  '2': [
    {
      id: 'content-3',
      kind: 'video',
      title: 'Tech Startup Promo Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbUrl: 'https://picsum.photos/200/150?random=3',
      createdAt: '2024-01-14T15:22:00Z',
    },
  ],
  '3': [
    {
      id: 'content-4',
      kind: 'image',
      title: 'Product Launch Graphics',
      url: 'https://picsum.photos/800/600?random=4',
      thumbUrl: 'https://picsum.photos/200/150?random=4',
      createdAt: '2024-01-13T09:17:00Z',
    },
  ],
  '4': [
    {
      id: 'content-5',
      kind: 'image',
      title: 'Professional Product Photos',
      url: 'https://picsum.photos/800/600?random=5',
      thumbUrl: 'https://picsum.photos/200/150?random=5',
      createdAt: '2024-01-12T14:47:00Z',
    },
  ],
  '5': [
    {
      id: 'content-6',
      kind: 'image',
      title: 'Instagram Stories Collection',
      url: 'https://picsum.photos/800/600?random=6',
      thumbUrl: 'https://picsum.photos/200/150?random=6',
      createdAt: '2024-01-11T08:32:00Z',
    },
  ],
  '6': [
    {
      id: 'content-7',
      kind: 'image',
      title: 'Website Hero Images',
      url: 'https://picsum.photos/800/600?random=7',
      thumbUrl: 'https://picsum.photos/200/150?random=7',
      createdAt: '2024-01-10T13:22:00Z',
    },
  ],
  '7': [
    {
      id: 'content-8',
      kind: 'image',
      title: 'Quarterly Review Slides',
      url: 'https://picsum.photos/800/600?random=8',
      thumbUrl: 'https://picsum.photos/200/150?random=8',
      createdAt: '2024-01-09T11:02:00Z',
    },
  ],
  '8': [
    {
      id: 'content-9',
      kind: 'image',
      title: 'Brand Identity Package',
      url: 'https://picsum.photos/800/600?random=9',
      thumbUrl: 'https://picsum.photos/200/150?random=9',
      createdAt: '2024-01-08T16:12:00Z',
    },
  ],
}
