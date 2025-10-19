import { useMutation } from '@tanstack/react-query'
import { generateContent, type GenerateContentRequest } from '@/lib/api'

/**
 * Hook to generate content using the Higgsfield API
 */
export function useGenerateContent() {
  return useMutation({
    mutationFn: (request: GenerateContentRequest) => generateContent(request),
  })
}
