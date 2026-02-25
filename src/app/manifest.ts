
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
        src: '/Blue Tech Modern Cloud Technology Logo_20260226_031424_0000.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/Blue Tech Modern Cloud Technology Logo_20260226_031424_0000.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
  }
}
