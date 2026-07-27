import React from 'react';

// Memoized to prevent unnecessary re-renders when parent state updates
const ExpenseCard = React.memo(({ exp, onDelete }) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div className="space-y-1">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          {exp.title}
        </h4>
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          {exp.category}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-base text-slate-900 dark:text-white">
          ₹{Number(exp.amount).toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => onDelete(exp._id)}
          className="!bg-red-50 dark:!bg-red-950/40 !text-red-600 dark:!text-red-400 hover:!bg-red-100 px-2.5 py-1 text-xs font-semibold rounded-lg transition !border-none cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default ExpenseCard;