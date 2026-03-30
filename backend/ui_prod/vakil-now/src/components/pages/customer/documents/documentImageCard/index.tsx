'use client'

import Image from 'next/image'
import { Icons } from '@/lib/icons'
import { useMemo } from 'react'


interface DocumentData {
    text: string
    clientName: string
    serviceType: string
    natureOfMatter: string
}

interface DocumentsImageCardProps {
    documentData: DocumentData,
    onClick: () => void
}

export default function DocumentsImageCard({
    documentData,
    onClick
}: DocumentsImageCardProps) {
    const deepEngraved = useMemo(
        () =>
    "text-[#B0D7FF] opacity-85 " +
    "[text-shadow:" +
    "0_2px_2px_rgba(0,0,0,0.75)," +   // deep bottom shadow
    "0_-1px_1px_rgba(255,255,255,0.12)]",// soft top highlight
    []
)


  return (
    <div className="relative w-[310px] h-[395px] text-[#B0D7FF] font-inter cursor-pointer" onClick={onClick} >

      {/* ================= Background SVG ================= */}
      <Icons.DocumentBackgroundImage className="absolute inset-0 w-full h-full" />

      {/* ================= File No Box ================= */}
      <div
        className="
          absolute top-[30px] left-[30px]
          flex flex-col gap-[2px]
          ring-[0.5px] ring-[#B0D7FF] ring-inset
          rounded-[4px] px-2 py-1
        "
      >
        <div className={`text-[10px] font-bold  text-[#B0D7FF] ${deepEngraved}`}>File No.</div>
              <div title={documentData.text} className={`text-[8px] font-medium  text-[#B0D7FF] truncate overflow-hidden max-w-[120px] ${deepEngraved}`}>
          VN / {documentData.text}
        </div>
      </div>

      {/* ================= Vakil Logo ================= */}
        <div className="absolute top-[30px] right-[30px] w-[68px] h-[49px]">
          <Image
            src="/logo.svg"
            alt="Vakil Now Image"
            fill
          className={`object-contain ${deepEngraved}`}
          />
        </div>

      {/* ================= Client Details ================= */}
      <div className="absolute left-[30px] top-[227px] flex flex-col gap-2">

        <div className="flex gap-1">
          <span className={`font-bold min-w-[81px] text-[10px]  text-[#B0D7FF] ${deepEngraved}`}>Client Name</span>
          <span className={`font-bold text-[10px] pl-[9px] pr-[4px] text-[#B0D7FF] ${deepEngraved}`}>:</span>
          <span title={documentData.clientName}  className={`font-inter font-medium text-[10px] truncate overflow-hidden max-w-[140px] ${deepEngraved}`}>
            {documentData.clientName}
          </span>
        </div>

        <div className="flex gap-1">
          <span className={`font-inter font-bold min-w-[81px] text-[10px]  text-[#B0D7FF] ${deepEngraved}`}>Service Type</span>
          <span className={`font-bold text-[10px]  pl-[9px]  pr-[4px] text-[#B0D7FF] ${deepEngraved}`}>:</span>
          <span title={documentData.serviceType} className={`font-inter font-medium text-[10px] text-[#B0D7FF] truncate overflow-hidden max-w-[140px] ${deepEngraved}`}>
            {documentData.serviceType}
          </span>
        </div>

        <div className="flex gap-1">
          <span className={`font-bold text-[10px]  min-w-[90px] text-[#B0D7FF] ${deepEngraved}`}>Nature of Matter</span>
          <span className={`font-bold text-[10px]  pr-[4px] text-[#B0D7FF] ${deepEngraved}`}>:</span>
          <span title={documentData.natureOfMatter}  className={`font-inter font-medium text-[10px] text-[#B0D7FF] truncate overflow-hidden max-w-[140px] ${deepEngraved}`}>
            {documentData.natureOfMatter}
          </span>
        </div>

      </div>


      {/* ================= Footer ================= */}
      <div
        className="
          absolute bottom-[30px] left-0 right-0
          text-center  flex flex-col text-[#B0D7FF]
        "
      >
        <span className={`font-['Lobster'] font-regular text-[12px] text-center italic  text-[#B0D7FF] ${deepEngraved}`}> For Client Use Only</span>

        <span className={`font-bold font-inter text-[8px] text-center  text-[#B0D7FF] ${deepEngraved}`}>CONFIDENTIAL</span>
      </div>

    </div>
  )
}
