// Format date to readable string
export const formatDate = (date) => {
  if (!date) return 'No due date';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Check if task is overdue
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return new Date(dueDate) < new Date();
};

// Check if task is due soon (within 24 hours)
export const isDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
};

// Get priority color for UI
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

// Get status badge color for UI
export const getStatusColor = (status) => {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-700';
    case 'in-progress': return 'bg-blue-100 text-blue-700';
    case 'done': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};