import { ColumnDef } from '@tanstack/react-table'
import { Pool } from 'utils/usePools'
import { PoolNameCell } from '../SharedCells/PoolNameCell'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ICON_SIZE } from './columns'
import { PoolMyPositionTVLCell } from '../SharedCells/PoolMyPositionTVLCell'
import { PoolMyPositionReserveCell } from '../SharedCells/PoolMyPositionReserveCell'
import { PoolMyPositionAprCell } from '../SharedCells/PoolMyPositionAPR'

export const MYPOSITION_NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
  size: 280,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <Skeleton.Circle radius={ICON_SIZE} />
          <Skeleton.Circle radius={ICON_SIZE} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}

export const MYPOSITION_RESERVE_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'reserve',
  header: 'Reserve',
  cell: (props) => <PoolMyPositionReserveCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}

export const MYPOSITION_TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'TVL',
  header: 'TVL',
  cell: (props) => <PoolMyPositionTVLCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}

export const MYPOSITION_APR_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'APR',
  header: 'APR',
  cell: (props) => <PoolMyPositionAprCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}
