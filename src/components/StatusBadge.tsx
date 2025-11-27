interface StatusBadgeProps {
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-[#FF9500]/10 text-[#FF9500]',
    submitted: 'bg-[#6B4BFF]/10 text-[#6B4BFF]',
    approved: 'bg-[#22C55E]/10 text-[#22C55E]',
    rejected: 'bg-[#EF4444]/10 text-[#EF4444]',
  };

  const labels = {
    pending: 'Pending',
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
