// import { EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import type { Customer } from '@/features/customers/api'

// export function CellAction({ data }: { data: Customer }) {
//   return (
//     <div className="text-right">
//       <DropdownMenu>
//         <DropdownMenuTrigger
//           render={
//             <Button variant="ghost" size="icon-sm" aria-label="Open actions">
//               <EllipsisVertical />
//             </Button>
//           }
//         />
//         <DropdownMenuContent align="start">
//           <DropdownMenuItem onClick={() => console.log('view', data.id)}>
//             <Eye />
//             View
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => console.log('edit', data.id)}>
//             <Pencil />
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={() => console.log('delete', data.id)}>
//             <Trash2 />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }
