import { formatDate } from '../utils/helpers';

const NotificationPanel = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg 
      border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => onMarkAsRead(n._id)}
              className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 
                transition ${!n.read ? 'bg-blue-50' : ''}`}
            >
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(n.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-center">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;