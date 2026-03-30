'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SectionHeading } from '../sectionHeading';
import { CustomLink } from '../customLink';

export interface ColumnDef<T> {
  accessorKey: keyof T & string;
  header: string;
}

export interface DataTableRow {
  service: string;
  client: string;
  lawyer: string;
  status: string;
  requestedOn: string;
}

interface DataTableProps<T> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  linkHref?: string;
  linkText?: string;
  className?: string;
  borderColor?: string;
}

export function DataTable<T>({
  title,
  columns,
  data,
  linkHref = '#',
  linkText = 'View',
  className,
  borderColor
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        `border ${borderColor} rounded-md py-4 px-0`,
        className || ''
      )}>
      <div className='px-4 flex justify-between items-center mb-4'>
        <SectionHeading
          title={title}
          className=' h-full 
    font-inter font-semibold
    md:font-bold
    text-lg          
    sm:text-lg         
    md:text-xl         
    lg:text-2xl         
    xl:text-3xl 
    md:text-[rgb(89,89,89)] '
        />
        {/* <Link
                    href={linkHref}
                    className="text-blue-600 text-sm md:text-base font-medium hover:underline no-underline focus:outline-none focus:underline"
                >
                    {linkText}
                </Link> */}
        <CustomLink
          text={linkText}
          className='font-inter font-medium p-0 m-0 h-full  w-full text-sm md:text-base  hover:underline md:whitespace-nowrap flex-shrink-0'
          href={linkHref}
        />
      </div>

      <div className={cn('overflow-hidden rounded-sm -mb-4', borderColor)}>
        <Table className='w-full border-collapse'>
          <TableHeader>
            <TableRow className='bg-[rgb(237,249,254)]'>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={cn(
                    'text-sm md:text-base font-semibold text-gray-900 px-4 py-3 text-left border-b last:border-r-0',
                    `border-b ${borderColor}`
                  )}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className='bg-white'>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={column.accessorKey}
                    className={cn(
                      'font-inter font-normal',
                      'text-sm text-gray-600 px-4 py-3 border-b border-r last:border-r-0',
                      `border-b ${borderColor}`,
                      `border-r ${borderColor}`,
                      index === data.length - 1 && 'border-b-0'
                    )}>
                    {String(row[column.accessorKey] ?? '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
