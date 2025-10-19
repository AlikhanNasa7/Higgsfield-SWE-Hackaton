import { useState } from 'react'
import { getPresignedUrl, uploadToS3, type PresignResponse } from '@/lib/api'

export interface UploadProgress {
  file: File
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  downloadUrl?: string
  error?: string
}

export function useS3Upload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File): Promise<string> => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`

    // Add to uploads list
    setUploads(prev => [
      ...prev,
      {
        file,
        status: 'pending',
        progress: 0,
      },
    ])

    try {
      setIsUploading(true)

      // Get presigned URL
      const presignResponse = await getPresignedUrl({
        file_name: file.name,
        content_type: file.type,
        size: file.size,
      })
      console.log('presignResponse', presignResponse)

      // Update status to uploading
      setUploads(prev =>
        prev.map(upload =>
          upload.file === file ? { ...upload, status: 'uploading', progress: 50 } : upload
        )
      )

      // Upload to S3
      await uploadToS3(file, presignResponse.upload_url)

      // Update status to completed
      setUploads(prev =>
        prev.map(upload =>
          upload.file === file
            ? {
                ...upload,
                status: 'completed',
                progress: 100,
                downloadUrl: presignResponse.download_url,
              }
            : upload
        )
      )

      return presignResponse.download_url
    } catch (error) {
      // Update status to error
      setUploads(prev =>
        prev.map(upload =>
          upload.file === file
            ? {
                ...upload,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : upload
        )
      )
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadFile(file))
    return Promise.all(uploadPromises)
  }

  const clearUploads = () => {
    setUploads([])
  }

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file))
  }

  return {
    uploads,
    isUploading,
    uploadFile,
    uploadFiles,
    clearUploads,
    removeUpload,
  }
}
