
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DocX | Tejgaon College Photography Club',
    short_name: 'DocX',
    description: 'তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব ডেটা সিস্টেম',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f5',
    theme_color: '#15803d',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
  }
}
