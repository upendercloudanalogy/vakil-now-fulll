'use client';
import { Card } from '@/components/ui/card';
import React from 'react';
import { SupportItem } from './interfaces/index';

function SupportComplaintsInfo({ icon, name, number }: SupportItem) {
  return (
    <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 justify-between flex-row gap-2'>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 flex-row flex-shrink-0 gap-2'>
        <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 items-center justify-center'>
          {icon}
        </Card>
        <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 text-[rgb(89,89,89)] font-semibold items-center justify-center'>
          {name}
        </Card>
      </Card>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0  text-[rgb(89,89,89)]'>
        {number}
      </Card>
    </Card>
  );
}

export default React.memo(SupportComplaintsInfo);

// "use client";
// import React from "react";
// import { SupportItem } from "./interfaces/index";

// function SupportComplaintsInfo({ icon, name, number }: SupportItem) {
//   return (
//     <button
//       className="w-full flex items-center justify-between gap-2 rounded-md transition cursor-pointer"
//       onClick={() => console.log(name + " clicked")}
//     >
//       <div className="flex items-center gap-2">
//         <div>{icon}</div>
//         <span className="text-[rgb(89,89,89)] font-semibold">{name}</span>
//       </div>

//       <span className="text-[rgb(89,89,89)] font-semibold">{number}</span>
//     </button>
//   );
// }

// export default React.memo(SupportComplaintsInfo);
