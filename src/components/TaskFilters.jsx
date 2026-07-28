const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Status Filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Sort Filter */}
      <select
        value={filters.sortBy || ''}
        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sort by Latest</option>
        <option value="dueDate">Sort by Due Date</option>
      </select>

      {/* Clear Filters */}
      {(filters.status || filters.priority || filters.sortBy) && (
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-red-500 hover:text-red-700 
          underline transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;