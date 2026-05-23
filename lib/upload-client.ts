export async function uploadToCloudinary(file: File, folder = 'sonke-tools') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed')
  }

  return data as {
    url: string
    publicId: string
    format?: string
    bytes?: number
    width?: number
    height?: number
  }
}
