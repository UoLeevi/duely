import { createClassName } from 'utils';

export const status = {
  OK: 'ok',
  PENDING: 'pending',
  ACTION_REQUIRED: 'action required',
  PASSIVE: 'passive',
};

const bg = {
  [status.OK]: 'bg-green-400',
  [status.PENDING]: 'bg-blue-400',
  [status.ACTION_REQUIRED]: 'bg-yellow-400',
  [status.PASSIVE]: 'bg-gray-400'
};

export default function MultiStatusIndicator({ className, statuses }) {
  className = createClassName(className, 'flex');

  return (
    <div className={className}>
      {statuses?.map(({ status, tooltip, key }, index) => {
        const className = createClassName(bg[status], 'w-5 h-2 rounded-sm border border-white relative');

        return (
          <div className={className} key={key ?? index}>
            <span className="absolute text-sm font-medium">{ tooltip }</span>
          </div>
        );
      })}
    </div>
  );
}
