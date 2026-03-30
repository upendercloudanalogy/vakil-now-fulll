import { ColumnDef, DataTableRow } from '@/components/common/customTable';
import { Icons } from '@/lib/icons';

const supportedIcons = {
  circleIcon: <Icons.PlusCircleIcon2 className='w-[28px] h-[28px]' />,
  plusCircle: <Icons.PlusCircleIcon2 className='w-[28px] h-[28px]' />,
  orangeCheckIcon: (
    <Icons.CheckIconAdmin
      bgColor='rgb(255,141,40)'
      className='w-[28px] h-[28px]'
    />
  ),
  yellowCheckIcon: (
    <Icons.CheckIconAdmin
      bgColor='rgb(201,163,63)'
      className='w-[28px] h-[28px]'
    />
  ),
  greenCheckIcon: (
    <Icons.CheckIconAdmin
      bgColor='rgb(67,160,71)'
      className='w-[28px] h-[28px]'
    />
  ),
  checkIcon: <Icons.CheckIconAdmin className='w-[28px] h-[28px]' />
};

const columns: ColumnDef<DataTableRow>[] = [
  { accessorKey: 'service', header: 'Service/Consultation' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'lawyer', header: 'Lawyer' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'requestedOn', header: 'Requested On' }
];

const quickActions = [
  {
    icon: supportedIcons.circleIcon,
    name: 'Add New Packages'
  },
  {
    icon: supportedIcons.plusCircle,
    name: 'Create Announcement'
  },
  {
    icon: supportedIcons.plusCircle,
    name: 'Generate Report'
  }
];

export { supportedIcons, columns, quickActions };
