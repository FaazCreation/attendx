
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DocX | Tejgaon College Photography Club',
    short_name: 'DocX',
    description: 'তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেম',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5F5', // Matches the CSS background variable
    theme_color: '#15803d',      // Matches the primary green color
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
