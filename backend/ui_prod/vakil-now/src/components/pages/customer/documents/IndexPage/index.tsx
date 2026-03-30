'use client'
import React from 'react'
import { Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const IndexPage = React.memo(({
  pages,
  animatedGoToPage
}:any) => {
  const handleIndexDownload = async (
    e: React.MouseEvent,
    url: string,
    title: string
  ) => {
    e.stopPropagation() // prevent flip / navigation
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

      window.open(blobUrl, '_blank') 

      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000)
    } catch (error) {
      console.error('Download failed', error)
      window.open(url, '_blank')
    }
  }

  return (
    <div
      className="
        w-full h-full
        bg-white
        flex flex-col 
        rounded-r-md
        pt-5 pb-10 pl-4 pr-4 
        md:pt-10 md:pb-16 md:pl-10 md:pr-10
        border-r border-gray-200
      "
    >
      {/* ===== HEADER BAR (same as DocPage) ===== */}
      <div className="flex justify-between mb-5">
        <div className="flex flex-wrap text-[18px] md:text-[24px] font-semibold md:font-bold font-inter text-[#0A2342] leading-tight">
          Table of Contents
        </div>
      </div>

      {/* ===== BODY (replaces image/pdf viewer) ===== */}
      <div
        className="
          w-full h-full
          bg-white
          flex-1
          overflow-y-auto
          pr-2
        "
      >
        <div className="flex flex-col gap-4">
          {pages.map((doc:any, i:any) => (
            <div
              key={i}

              className="flex items-center justify-between  group"
            >
              {/* Left: Title */}
              <span
                onClick={() => animatedGoToPage(i + 1)}
                className="
                  text-[16px] text-[#1565C0]
                  underline
                  group-hover:text-[#0A2342]
                  transition
                  cursor-pointer
                  truncate
    max-w-[70%]
                "
                title={doc.title}
              >
                {doc.title}
              </span>

              {/* Right: Icons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={(e) => handleIndexDownload(e, doc.url, doc.title)}
                  className="bg-transparent border-0 hover:bg-transparent !p-0 m-0 h-auto"
                >
                  <Download color="#1565C0" className="size-[18px]" />
                </Button>

                <Button
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent border-0 hover:bg-transparent !p-0 m-0 h-auto"
                >
                  <Share2 className="size-[18px]" color="#1565C0" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

IndexPage.displayName = 'IndexPage'
