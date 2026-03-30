'use client'

import { SectionHeading } from '@/components/common/sectionHeading'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft, ChevronRight, Download, Share2, Upload } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false })
import { useAppDispatch, useAppSelector } from '../../../../../../../redux/hook'
import { fetchMyLlps } from '../../../../../../../redux/slices/llp/llpThunk'
import dynamic from 'next/dynamic'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocPage } from '@/components/pages/customer/documents/DocPage'
import { IndexPage } from '@/components/pages/customer/documents/IndexPage'


const PageWrapper = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <div
    ref={ref}
    className="w-full h-full bg-white flex items-center justify-center"
  >
    {children}
  </div>
))

PageWrapper.displayName = 'PageWrapper'

export default function DocumentBookPage() {
  const params = useParams()
  const typeOfdoc = params._service as string
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile();
  const llp = useAppSelector((state) => state.llpReducer)
  console.log(llp, 'llp in llp page');

  const bookRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)


  useEffect(() => {
    dispatch(fetchMyLlps())
  }, [dispatch])





  const pages = useMemo(() => {
    const docs: { title: string; url: string }[] = []

    if (llp.llpInfo?.nocUrl) {
      docs.push({ title: 'LLP – NOC', url: llp.llpInfo.nocUrl })
    }

    if (llp.llpInfo?.residentialProofUrl) {
      docs.push({
        title: 'LLP – Residential Proof',
        url: llp.llpInfo.residentialProofUrl,
      })
    }

    if (llp.llpInfo?.subscriberSheetUrl?.signedUrl) {
      docs.push({
        title: 'LLP – Subscriber Sheet',
        url: llp.llpInfo.subscriberSheetUrl.signedUrl,
      })
    }

    llp.partners.forEach((partner, index) => {
      const p = index + 1

      if (partner.files.picture) {
        docs.push({
          title: `Partner ${p} – Photograph`,
          url: partner.files.picture as string,
        })
      }
      if (partner.files.identityProof) {
        docs.push({
          title: `Partner ${p} – Identity Proof`,
          url: partner.files.identityProof as string,
        })
      }
      if (partner.files.residentialProof) {
        docs.push({
          title: `Partner ${p} – Residential Proof`,
          url: partner.files.residentialProof as string,
        })
      }
      if (partner.files.panCard) {
        docs.push({
          title: `Partner ${p} – PAN Card`,
          url: partner.files.panCard as string,
        })
      }
      if (partner.esignDocuments?.form9?.signedUrl) {
        docs.push({
          title: `Partner ${p} – Form 9 (e-Sign)`,
          url: partner.esignDocuments.form9.signedUrl,
        })
      }
    })

    return docs
  }, [llp])

  const getApi = () => bookRef.current?.pageFlip()

  const animatedGoToPage = useCallback((targetIndex: number) => {
    const api = bookRef.current?.pageFlip();
    if (!api) return

    const current = api.getCurrentPageIndex()
    if (targetIndex === current) return

    const steps = Math.abs(targetIndex - current)
    const direction = targetIndex > current ? 'next' : 'prev'

    let i = 0

    const interval = setInterval(() => {
      if (i >= steps) {
        clearInterval(interval)
        return
      }

      if (direction === 'next') {
        api.flipNext()
      } else {
        api.flipPrev()
      }

      i++
    }, 800)
  }, [])

  const bookPages = useMemo(() => {
    if (!pages.length) return []
    const result: React.ReactNode[] = []

    // Index Page
    result.push(
      <PageWrapper key="index">
        <IndexPage pages={pages} animatedGoToPage={animatedGoToPage} />
      </PageWrapper>
    )

    // Document pages
    pages.forEach((doc, i) => {
      result.push(
        <PageWrapper key={`doc-${doc.url}`}>
          <DocPage title={doc.title} url={doc.url} />
        </PageWrapper>
      )
    })

    return result
  }, [pages])


  const flipNext = () => {
    const api = getApi()
    if (!api) return
    animatedGoToPage(api.getCurrentPageIndex() + 1)
  }

  const flipPrev = () => {
    const api = getApi()
    if (!api) return
    animatedGoToPage(api.getCurrentPageIndex() - 1)
  }



  const containerRef = useRef<HTMLDivElement>(null)

  const flipBookProps = useMemo(() => {
    const bookSize = isMobile ? 303 : 1000
    const bookHeight = isMobile ? 337 : 1000

    return {
      width: bookSize,
      height: bookHeight,
      minWidth: bookSize,
      maxWidth: bookSize,
      minHeight: bookHeight,
      maxHeight: bookHeight,

      /* Layout */
      usePortrait: true,
      startPage: 0,
      size: 'fixed' as const,
      autoSize: false,
      startZIndex: 30,

      /* Animation & UX */
      flippingTime: 1000,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      /* Behavior */
      showCover: false,
      disableFlipByClick: false,   //  only buttons control flip
      clickEventForward: false,   // 
      useMouseEvents: false,      // 
      swipeDistance: 0,           // 
      mobileScrollSupport: true,  //  allow internal scrolling
      showPageCorners: false,
    }
  }, [isMobile])

  const lastPageIndex = bookPages.length - 1

  return (
    <>
      <div className='flex flex-col gap-4 w-full'>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row  md:justify-between md:items-center gap-4 ">
          <SectionHeading title="Documents" className='font-inter text-[24px] md:text-[32px] font-bold text-[#1565C0]' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='bg-[#1565C0] font-inter font-medium !text-[14px] w-fit'>
                <Upload className='size-6' />
                Upload
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => console.log('LLP Registration')}>
                  LLP Registration
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => console.log('Personal')}>
                  Personal
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => console.log('Company')}>
                  Company
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className='flex flex-col border-0 gap-5'>
          <div className="font-inter font-semibold md:font-bold text-[18px] md:text-[24px] text-[#0A2342]">{typeOfdoc}</div>

          <div className='flex items-center items-center justify-center w-full'>
            <div className="
                flex flex-col 
                justify-between items-center 
                pb-6 md:pb-10
                bg-white
                rounded-lg
                shadow-xl
                border-[1px]
                border-[rgb(237,249,254)]
            ">

              {/* === WRAPPER === */}
              <div ref={containerRef}>

                <HTMLFlipBook
                  // onInit={(wrapper) => {
                  //   flipApiRef.current = wrapper.pageFlip()  
                  // }}
                  onFlip={(e) => setCurrentPage(e.data)}
                  ref={bookRef}
                  className=''
                  style={{ margin: '0 auto' }}
                  {...flipBookProps}
                >
                  {bookPages}

                </HTMLFlipBook>


              </div>

              {/* BUTTONS */}
              {currentPage === 0 && (

                <div className="flex justify-center pt-6 md:pt-10">
                  <Button
                    onClick={() => animatedGoToPage(1)}
                    className="bg-[#1565C0] text-white px-6 py-2 text-[14px] font-medium rounded-md"
                  >
                    Next Page
                  </Button>
                </div>
              )}

              {currentPage !== 0 && (
                <div className="
                flex flex-row justify-between w-full 
                px-6 md:px-10 
                pt-6 md:pt-10
              ">
                  <Button onClick={flipPrev} className='bg-[#1565C0]' disabled={currentPage === 0}>
                    <ChevronLeft className='size-6' />
                  </Button>


                  <Button onClick={flipNext} className='bg-[#1565C0]' disabled={currentPage === lastPageIndex}>
                    <ChevronRight className='size-6' />
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
