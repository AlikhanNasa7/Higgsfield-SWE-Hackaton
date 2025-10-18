import { type Message } from '@/types/schemas'

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      role: 'user',
      createdAt: '2024-01-15T10:00:00Z',
      parts: [
        { type: 'text', text: 'Create a futuristic cityscape with flying cars and neon lights' },
      ],
    },
    {
      id: '1-2',
      role: 'assistant',
      createdAt: '2024-01-15T10:01:00Z',
      parts: [
        {
          type: 'text',
          text: "I've generated a stunning futuristic cityscape for you! The image features towering skyscrapers, flying vehicles, and vibrant neon lighting that creates an immersive cyberpunk atmosphere.",
        },
        { type: 'Button', label: 'View Image', targetContentId: 'content-1' },
      ],
      producedContentIds: ['content-1'],
    },
    {
      id: '1-3',
      role: 'user',
      createdAt: '2024-01-15T10:05:00Z',
      parts: [{ type: 'text', text: 'Make it more colorful and add some rain effects' }],
    },
    {
      id: '1-4',
      role: 'assistant',
      createdAt: '2024-01-15T10:06:00Z',
      parts: [
        {
          type: 'text',
          text: "Perfect! I've enhanced the cityscape with vibrant colors and added atmospheric rain effects. The neon lights now reflect beautifully on the wet streets.",
        },
        { type: 'Button', label: 'View Enhanced Image', targetContentId: 'content-2' },
      ],
      producedContentIds: ['content-2'],
    },
  ],
  '2': [
    {
      id: '2-1',
      role: 'user',
      createdAt: '2024-01-14T15:20:00Z',
      parts: [
        {
          type: 'text',
          text: 'Create a promotional video for a tech startup showcasing innovation',
        },
      ],
    },
    {
      id: '2-2',
      role: 'assistant',
      createdAt: '2024-01-14T15:22:00Z',
      parts: [
        {
          type: 'text',
          text: "I've created an engaging promotional video that highlights your startup's innovative approach. The video features dynamic visuals, smooth transitions, and compelling storytelling elements.",
        },
        { type: 'Button', label: 'Watch Video', targetContentId: 'content-3' },
      ],
      producedContentIds: ['content-3'],
    },
  ],
  '3': [
    {
      id: '3-1',
      role: 'user',
      createdAt: '2024-01-13T09:15:00Z',
      parts: [{ type: 'text', text: 'Generate social media graphics for our new product launch' }],
    },
    {
      id: '3-2',
      role: 'assistant',
      createdAt: '2024-01-13T09:17:00Z',
      parts: [
        {
          type: 'text',
          text: "I've created eye-catching social media graphics perfect for your product launch. The designs are optimized for different platforms and include compelling call-to-action elements.",
        },
        { type: 'Button', label: 'View Graphics', targetContentId: 'content-4' },
      ],
      producedContentIds: ['content-4'],
    },
  ],
  '4': [
    {
      id: '4-1',
      role: 'user',
      createdAt: '2024-01-12T14:45:00Z',
      parts: [{ type: 'text', text: 'Create professional product photos with studio lighting' }],
    },
    {
      id: '4-2',
      role: 'assistant',
      createdAt: '2024-01-12T14:47:00Z',
      parts: [
        {
          type: 'text',
          text: "I've generated high-quality product photos with professional studio lighting. The images showcase your product from multiple angles with clean, commercial-grade aesthetics.",
        },
        { type: 'Button', label: 'View Photos', targetContentId: 'content-5' },
      ],
      producedContentIds: ['content-5'],
    },
  ],
  '5': [
    {
      id: '5-1',
      role: 'user',
      createdAt: '2024-01-11T08:30:00Z',
      parts: [{ type: 'text', text: 'Design Instagram stories for our brand awareness campaign' }],
    },
    {
      id: '5-2',
      role: 'assistant',
      createdAt: '2024-01-11T08:32:00Z',
      parts: [
        {
          type: 'text',
          text: "I've created a series of engaging Instagram stories that will boost your brand awareness. Each story is designed to capture attention and drive engagement.",
        },
        { type: 'Button', label: 'View Stories', targetContentId: 'content-6' },
      ],
      producedContentIds: ['content-6'],
    },
  ],
  '6': [
    {
      id: '6-1',
      role: 'user',
      createdAt: '2024-01-10T13:20:00Z',
      parts: [{ type: 'text', text: 'Create hero images for our website homepage' }],
    },
    {
      id: '6-2',
      role: 'assistant',
      createdAt: '2024-01-10T13:22:00Z',
      parts: [
        {
          type: 'text',
          text: "I've designed compelling hero images that will make a strong first impression on your website visitors. The images are optimized for web performance and responsive design.",
        },
        { type: 'Button', label: 'View Hero Images', targetContentId: 'content-7' },
      ],
      producedContentIds: ['content-7'],
    },
  ],
  '7': [
    {
      id: '7-1',
      role: 'user',
      createdAt: '2024-01-09T11:00:00Z',
      parts: [{ type: 'text', text: 'Generate presentation slides for our quarterly review' }],
    },
    {
      id: '7-2',
      role: 'assistant',
      createdAt: '2024-01-09T11:02:00Z',
      parts: [
        {
          type: 'text',
          text: "I've created professional presentation slides for your quarterly review. The slides feature clean layouts, engaging visuals, and clear data presentations.",
        },
        { type: 'Button', label: 'View Slides', targetContentId: 'content-8' },
      ],
      producedContentIds: ['content-8'],
    },
  ],
  '8': [
    {
      id: '8-1',
      role: 'user',
      createdAt: '2024-01-08T16:10:00Z',
      parts: [
        { type: 'text', text: 'Design brand identity materials including logos and color schemes' },
      ],
    },
    {
      id: '8-2',
      role: 'assistant',
      createdAt: '2024-01-08T16:12:00Z',
      parts: [
        {
          type: 'text',
          text: "I've developed a comprehensive brand identity package including logos, color palettes, and style guidelines. The designs reflect your brand's personality and values.",
        },
        { type: 'Button', label: 'View Brand Materials', targetContentId: 'content-9' },
      ],
      producedContentIds: ['content-9'],
    },
  ],
}
