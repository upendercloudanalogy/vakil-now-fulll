'use client'

import DocumentsImageCard from '@/components/pages/customer/documents/documentImageCard'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook'
import { fetchMyLlps } from '../../../../../redux/slices/llp/llpThunk'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload } from 'lucide-react'
import { SectionHeading } from '@/components/common/sectionHeading'
import { Button } from '@/components/ui/button'

export default function PersonalDocumentsPage () {


  const dispatch = useAppDispatch();
  const state = useAppSelector((state)=>state.llpReducer);
  const router = useRouter()
  const pathname = usePathname()
  
  const documentData = {
    text: `BAIL / 2024 / ${state.fileId ?? '--'}`,
    clientName:
      'Mr. John',
    serviceType:
      'LLP REGISTRATION',
    natureOfMatter:
      'Advisory'
  }

  useEffect(()=>{
   dispatch(fetchMyLlps())
  },[])


  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col md:flex-row  md:justify-between md:items-center gap-4 ">
        <SectionHeading title="Documents" className='font-inter text-[24px] md:text-[32px] font-bold text-[#1565C0]' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='bg-[#1565C0] font-inter font-medium !text-[14px] w-fit hover:bg-[#1565C0]'>
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
      <div>
        <DocumentsImageCard documentData={documentData} onClick={() => router.push(`${pathname}/Llp-Documents/${state.llpId}`)} />
      </div>
    </div>
  )
}
