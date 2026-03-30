'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SectionHeading } from '../sectionHeading/index';
import { cn } from '@/lib/utils';

interface UserGrowthDataPoint {
  year: number;
  client: number;
  lawyer: number;
}

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
  title?: string;
  height?: number;
  width?: number | `${number}%` | undefined;
  className?: string;
}

export function UserGrowthChart({
  data,
  title = 'User Growth',
  height = 300,
  width = '100%',
  className = ''
}: UserGrowthChartProps) {
  // Compute max Y for dynamic scaling
  const maxY = Math.max(...data.map((d) => Math.max(d.client, d.lawyer)));
  const niceMaxY = Math.ceil(maxY / 10) * 10; // Round up to nearest 10 for nice ticks

  // Compute card style to apply width to the entire card
  let cardWidthStyle: React.CSSProperties | undefined;
  if (width !== '100%') {
    cardWidthStyle = {
      width: typeof width === 'number' ? `${width}px` : width
    };
  }

  return (
    <Card
      className={cn(
        'flex flex-col w-full border-[rgb(101,202,248)] gap-0',
        className
      )}
      style={cardWidthStyle}>
      <SectionHeading
        title={title}
        className='
    font-inter font-semibold
    text-base   
    text-xl     
    sm:text-lg         
    md:text-xl         
    lg:text-2xl         
    xl:text-3xl 
    pl-6
  '
      />
      <CardContent className='p-0'>
        {' '}
        {/* Remove padding to ensure full width for the chart */}
        <ResponsiveContainer width='100%' height={height}>
          <AreaChart data={data} margin={{ right: 20 }}>
            {' '}
            {/* Add right margin to prevent label clipping */}
            <defs>
              <linearGradient id='clientColor' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#60A5FA' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#60A5FA' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='lawyerColor' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3B82F6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3B82F6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
            <XAxis
              dataKey='year'
              stroke='rgba(21, 101, 192, 1)'
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tick={{ fontSize: 12 }}
              type='number'
              interval={0} // Show tick for every data point (all years)
              domain={['auto', 'auto']} // Auto-scale domain to data min/max
            />
            <YAxis
              stroke='rgba(21, 101, 192, 1)'
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              domain={[0, niceMaxY]}
              ticks={Array.from(
                { length: Math.floor(niceMaxY / 10) + 1 },
                (_, i) => i * 10
              )}
              tick={{ fontSize: 12 }}
            />
            <Tooltip labelFormatter={(label) => `${label}`} />
            <Legend
              verticalAlign='top'
              align='right'
              iconType='circle' // Simple dots (circles) for Client and Lawyer
              wrapperStyle={{
                padding: '10px',
                fontSize: '12px'
              }}
            />
            <Area
              type='monotone'
              dataKey='client'
              stroke='rgba(79, 195, 247, 1)'
              strokeWidth={2}
              fill='url(#clientColor)'
              name='Client'
            />
            <Area
              type='monotone'
              dataKey='lawyer'
              stroke='rgba(21, 101, 192, 1)'
              strokeWidth={2}
              fill='url(#lawyerColor)'
              name='Lawyer'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
