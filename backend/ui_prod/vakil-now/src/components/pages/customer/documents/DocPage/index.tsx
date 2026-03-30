'use client'
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import React from "react"

type DocPageProps = {
    title: string
    url: string
}

const isPdf = (url: string) => url.toLowerCase().split('?')[0].endsWith('.pdf')
const isImage = (url: string) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(url.split('?')[0])

export const DocPage = React.memo(React.forwardRef<HTMLDivElement, DocPageProps>(
    ({ title, url }, ref) => {
        const pdf = isPdf(url)
        const image = isImage(url)

        const handleDownload = async (e: React.MouseEvent) => {
            e.stopPropagation() // Prevent flip when clicking download
            try {
                const response = await fetch(url)
                const blob = await response.blob()
                const blobUrl = window.URL.createObjectURL(blob)

                let extension = ''
                const urlPath = url.split('?')[0]
                if (urlPath.includes('.')) {
                    extension = urlPath.split('.').pop() || ''
                }

                const fileName = extension ? `${title}.${extension}` : title

                window.open(blobUrl, '_blank')   // ✅ no DOM mutation

                setTimeout(() => URL.revokeObjectURL(blobUrl), 3000)
            } catch (error) {
                console.error('Download failed', error)
                window.open(url, '_blank')
            }
        }

        return (
            <div
                ref={ref}
                className="
          w-full h-full
          bg-white             /* CRITICAL: Must be opaque for 3D flip to work */
          flex flex-col 
          rounded-r-md
          /* RESPONSIVE PADDING: Smaller on mobile, larger on desktop */
          pt-5 pb-10 pl-4 pr-4 
          md:pt-10 md:pb-16 md:pl-10 md:pr-10
          border-r border-gray-200
        "
            >
                {/* ===== HEADER BAR ===== */}
                <div className='flex justify-between mb-5'>
                    <div className=' truncate max-w-full text-[18px] md:text-[24px] font-semibold md: font-bold font-inter text-[#0A2342] leading-tight'>
                        {title}
                    </div>
                    <div className='flex gap-2 md:gap-4 text-center justify-center items-center'>
                        <Button onClick={handleDownload} className='bg-transparent border-0 hover:bg-transparent !p-0 m-0 h-auto'>
                            <Download color='#1565C0' className='size-[18px]' />
                        </Button>
                        <Button className='bg-transparent border-0 hover:bg-transparent !p-0 m-0 h-auto'>
                            <Share2 className='size-[18px]' color='#1565C0' />
                        </Button>
                    </div>
                </div>

                {/* ===== VIEWER BODY ===== */}
                <div
                    className="
              w-full h-full 
              bg-white 
              flex items-center justify-center 
              border-[2px] border-black
              flex-1 flex
            "
                >
                    {/* ===== IMAGE ===== */}
                    {image && (
                        <img
                            src={url}
                            alt={title}
                            className="max-w-full max-h-full object-contain border-0"
                        />
                    )}

                    {/* ===== PDF ===== */}
                    {pdf && (
                        <iframe
                            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                            title={title}
                            className="w-full h-full border-0"
                            style={{
                                border: 'none',
                                touchAction: 'auto',
                            }}
                        />
                    )}

                    {/* ===== FALLBACK ===== */}
                    {!pdf && !image && (
                        <div className="text-gray-400 text-sm flex flex-col items-center">
                            <div>Unsupported file</div>
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 underline mt-2"
                            >
                                Open externally
                            </a>
                        </div>
                    )}
                </div>
            </div>
        )
    }
))

DocPage.displayName = 'DocPage'