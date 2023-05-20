import './globals.css'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Life Helper',
    description: 'Created by rucar12',
    authors: [{name: 'rucar12'}],
    creator: 'rucar12',
    icons: {
        icon: [
            {
                url: '/lifeHelper32x32.png',
                type: 'image/png',
                rel: 'icon',
            }
        ],
        shortcut: ['/lifeHelper32x32.png'],
        apple: [
            {
                url: '/lifeHelper192x192.png',
                sizes: '180x180',
                type: 'image/png',
                rel: 'apple-touch-icon'
            }
        ],
        other: [
            {url: '/lifeHelper192x192.png'}
        ],
    },
}

export default function RootLayout({
   children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    )
}