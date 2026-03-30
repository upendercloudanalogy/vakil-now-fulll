'use client';
import HeaderSearch from '@/components/common/headersSearch';
import MobileProfileHeader from '@/components/pages/customer/dashboard/mobileProfileHeader';
import TicketTable from '@/components/pages/customer/SupportAndComplaints/Table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CirclePlus, Paperclip , X} from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook';
import { refreshOpenTickets } from '../../../../../redux/slices/supportAndComplaints/supportandcomplaintSlice';
import {
  fetchClosedTickets,
  fetchOpenTickets,
  raiseTicket
} from '../../../../../redux/slices/supportAndComplaints/supportandcomplaintThunk';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
const LIMIT = 10;

type RaiseTicketForm = {
  title: string;
  query: string;
};

const SupportComplaintsPage = () => {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RaiseTicketForm>({
    defaultValues: {
      title: '',
      query: ''
    }
  });

  const dispatch = useAppDispatch();
  const {
    openTickets,
    closedTickets,
    openPagination,
    closedPagination,
    loadingOpen,
    loadingClosed,
    raiseLoading,
    openError,
    closedError,
    openInitialLoad,
    closedInitialLoad
  } = useAppSelector((state) => state.supportAndComplaintSlice);

  // Calculate hasMore correctly - FIXED
  const hasMoreOpen = openPagination
    ? openPagination.page < openPagination.totalPages
    : true;

  const hasMoreClosed = closedPagination
    ? closedPagination.page < closedPagination.totalPages
    : true;

  // Load initial data only once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (!openInitialLoad) {
        await dispatch(fetchOpenTickets({ page: 1, limit: LIMIT }));
      }
      if (!closedInitialLoad) {
        await dispatch(fetchClosedTickets({ page: 1, limit: LIMIT }));
      }
    };
    loadInitialData();
  }, []); // Empty dependency array - only run once on mount

  // Memoize loadMore functions
  const loadMoreOpen = useCallback(() => {
    if (!loadingOpen && hasMoreOpen && openPagination) {
      const nextPage = openPagination.page + 1;
      dispatch(fetchOpenTickets({ page: nextPage, limit: LIMIT }));
    }
  }, [dispatch, loadingOpen, hasMoreOpen, openPagination]);

  const loadMoreClosed = useCallback(() => {
    if (!loadingClosed && hasMoreClosed && closedPagination) {
      const nextPage = closedPagination.page + 1;
      dispatch(fetchClosedTickets({ page: nextPage, limit: LIMIT }));
    }
  }, [dispatch, loadingClosed, hasMoreClosed, closedPagination]);

  // Use the infinite scroll hook with throttle
  const openRef = useInfiniteScroll(loadMoreOpen, hasMoreOpen, loadingOpen);
  const closedRef = useInfiniteScroll(
    loadMoreClosed,
    hasMoreClosed,
    loadingClosed
  );

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileRef.current) {
      fileRef.current.value = ''; // reset file input
    }
  };



  const handleRaiseTicket = async (data: RaiseTicketForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('query', data.query);
    if (selectedFile) {
      formData.append('attachment', selectedFile);
    }

    const res = await dispatch(raiseTicket(formData));

    if (raiseTicket.fulfilled.match(res)) {
      setOpen(false);
      reset({
        title: '',
        query: ''
      }); // clear form
      setSelectedFile(null);
      // Refresh open tickets without resetting initial load flag
      dispatch(refreshOpenTickets());
      dispatch(fetchOpenTickets({ page: 1, limit: LIMIT }));
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className='gap-5 flex flex-col'>
      {/* <div className="pt-6 flex justify-center w-full hidden sm:block">
        <HeaderSearch
          placeholder="Search"
          value=""
          className="w-full"
        />
      </div>

      <div className='sm:hidden'>
        <MobileProfileHeader />
      </div> */}

      <div className='flex  flex-col md:flex-row justify-between gap-2'>
        <h1 className='hidden md:block font-inter font-bold text-[32px] text-[#1565C0] justify-center items-center'>
          Support & Complaints
        </h1>
        <h2 className='block md:hidden font-inter font-semibold text-[24px]  text-[#1565C0] justify-center items-center'>
          Support & Complaints
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant='link'
              className='bg-[#1565C0]  !text-white !font-medium w-fit h-auto gap-2 '>
              <CirclePlus className='size-6 shrink-0' />
              <span className='font-medium font-inter text-[14px]'>
                New Ticket
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-[811px]  gap-7 border-[#4FC3F7] [&>button>svg]:!h-6 [&>button>svg]:!w-6'>
            <DialogHeader>
              <DialogTitle className='font-inter font-semibold text-[24px] text-[#0A2342] sm: flex items-start'>
                Raise a ticket
              </DialogTitle>
            </DialogHeader>

            {/* Modal Body */}
            <div className='flex flex-col gap-7'>
              <div className='gap-2'>
                <label className='text-[16px] font-inter font-semibold text-[#737373]'>
                  Title
                </label>
                <input
                  type='text'
                  placeholder='Title'
                  className=' w-full
                   px-4 py-2
                  rounded-[4px]
                  border border-[#4FC3F7]
                  bg-white
                  outline-none
                   focus-visible:outline-none
                   focus-visible:ring-0
                    focus:border-[#4FC3F7]
                     hover:border-[#4FC3F7] '
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Title cannot exceed 100 characters'
                    }
                  })}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )}
              </div>

              <div className='flex flex-col gap-5'>
                <div className='flex flex-row justify-between'>
                  <label className='font-inter font-semibold text-[16px] text-[#737373]'>
                    Query
                  </label>
                  <Input
                    type='file'
                    ref={fileRef}
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Paperclip
                    width={24}
                    height={24}
                    color='#1565C0'
                    className='hover:cursor-pointer'
                    onClick={() => fileRef.current?.click()}
                  />
                </div>
                <textarea
                  placeholder='Please share the assistance required'
                  className='w-full border rounded-[4px] min-h-[194px] border-[#4FC3F7]  px-4 py-2
                   bg-white
                  outline-none
                   focus-visible:outline-none
                   focus-visible:ring-0
                  focus:border-[#4FC3F7]
                   hover:border-[#4FC3F7]'
                  {...register('query', {
                    required: 'Query is required',
                    minLength: {
                      value: 10,
                      message: 'Query must be at least 10 characters'
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Query cannot exceed 1000 characters'
                    }
                  })}
                />
                {selectedFile && (
                  <div className='flex items-center gap-2 text-sm text-[#1565C0] mt-1'>
                    <span className='flex items-center gap-1'>
                      📎 {selectedFile.name}
                    </span>

                    <X
                      size={16}
                      className='cursor-pointer text-red-500 hover:text-red-600'
                      onClick={clearSelectedFile}
                    />
                  </div>
                )}

                {errors.query && (
                  <p className='text-red-500 text-sm'>{errors.query.message}</p>
                )}
              </div>

              <div className='flex justify-end'>
                <Button
                  className='bg-[#1565C0] text-white font-medium text-[14px]'
                  onClick={handleSubmit(handleRaiseTicket)}
                  disabled={raiseLoading}>
                  {raiseLoading ? 'Submitting...' : 'Raise Ticket'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex flex-col gap-3'>
        <h1 className=' text-[#04103B] md:text-[#0A2342] font-semibold text-[18px] md:font-bold md:text-[24px]'>
          Open Tickets
        </h1>
        <TicketTable
          tickets={openTickets.map((t) => ({
            date: t.createdAt ?? '-',
            number: String(t.id),
            title: t.title,
            status: t.status,
            color: t.status === 'PENDING' ? 'bg-[#FF8D28]' : 'bg-[#C9A33F]'
          }))}
          loadMoreRef={openRef}
          isLoading={loadingOpen}
        />
      </div>

      <div className='flex flex-col gap-3'>
        <h1 className=' text-[#04103B] md:text-[#0A2342] font-semibold text-[18px] md:font-bold md:text-[24px]'>
          Close Tickets
        </h1>
        <TicketTable
          tickets={closedTickets.map((t) => ({
            date: t.createdAt ?? '-',
            number: String(t.id),
            title: t.title,
            status: t.status,
            color: 'bg-[#43A047]'
          }))}
          loadMoreRef={closedRef}
          isLoading={loadingClosed}
        />
      </div>
    </div>
  );
};

export default SupportComplaintsPage;
