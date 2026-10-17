import './globals.css'
import Shell from '../components/shell'

export const metadata = {
    title: 'PipelineCRM',
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-[#EFEBE2] text-[#1A1812] antialiased">
                <Shell>{children}</Shell>
            </body>
        </html>
    )
}