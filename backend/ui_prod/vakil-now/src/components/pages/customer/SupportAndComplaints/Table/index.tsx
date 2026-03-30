import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Check } from 'lucide-react';

interface TicketTableProps {
  tickets: ticketDataInterface[];
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

export interface ticketDataInterface {
  date: string;
  number: string;
  title: string;
  status: string;
  color: string;
}
export default function TicketTable({
  tickets,
  loadMoreRef,
  isLoading
}: TicketTableProps) {
  return (
    <div
      className='max-h-[420px] overflow-y-auto   pr-[10px]
     [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C8ECFD] [&::-webkit-scrollbar-thumb]:rounded-full'>
      <Table className='!border-collapse w-full'>
        {/* Header */}
        <TableHeader className='!bg-[#edf9fe]'>
          <TableRow>
            <TableHead className='border border-[#4FC3F7] font-inter font-semibold text-[16px] text-[#1A1A1A] min-w-[228px]'>
              Requested On
            </TableHead>
            <TableHead className='border border-[#4FC3F7] font-inter font-semibold text-[16px] text-[#1A1A1A]  min-w-[228px]'>
              Ticket Number
            </TableHead>
            <TableHead className='border border-[#4FC3F7] font-inter font-semibold text-[16px] text-[#1A1A1A]  min-w-[228px]'>
              Title
            </TableHead>
            <TableHead className='border border-[#4FC3F7] font-inter font-semibold text-[16px] text-[#1A1A1A]  min-w-[228px]'>
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {tickets.map((ticket, idx) => (
            <TableRow key={ticket.number}>
              <TableCell className='border border-[#4FC3F7] text-[#535454]  text-[16px] font-inter'>
                {ticket.date}
              </TableCell>
              <TableCell className='border border-[#4FC3F7] text-[#535454] text-[16px] font-inter'>
                {ticket.number}
              </TableCell>
              <TableCell className='border border-[#4FC3F7] text-[#535454]  text-[16px] font-inter'>
                {ticket.title}
              </TableCell>
              <TableCell className='border border-[#4FC3F7]'>
                <div className='flex items-center gap-[10px]'>
                  <span
                    className={`flex h-[24px] w-[24px] items-center justify-center rounded-full ${ticket.color}`}>
                    <Check size={14} className='text-white' />
                  </span>
                  <span className='text-[#535454] text-[16px] font-inter'>
                    {ticket.status}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div ref={loadMoreRef} className='h-6' />
      {isLoading && (
        <p className='text-center text-sm text-gray-400'>Loading...</p>
      )}
    </div>
  );
}
