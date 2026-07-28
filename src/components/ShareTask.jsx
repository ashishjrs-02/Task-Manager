import { useState } from 'react';
import api from '../services/api';

const ShareTask = ({ taskId, sharedWith, isOwner, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShare = async () => {
    if (!email.trim()) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await api.post(`/tasks/${taskId}/share`, { email });
      setSuccess(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share task');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await api.delete(`/tasks/${taskId}/share/${userId}`);
      setSuccess('Collaborator removed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center
      justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Share Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Share input */}
        {isOwner && (
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700">
              Share with (enter email)
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                className="flex-1 border border-gray-300 rounded-lg px-3
                py-2 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
                placeholder="collaborator@example.com"
              />
              <button
                onClick={handleShare}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4
                py-2 rounded-lg text-sm font-medium transition
                disabled:opacity-50"
              >
                {loading ? '...' : 'Share'}
              </button>
            </div>

            {/* Success/Error messages */}
            {success && (
              <p className="text-green-600 text-xs mt-2">{success}</p>
            )}
            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Current collaborators */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Current Collaborators
          </h3>
          {sharedWith?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No collaborators yet
            </p>
          ) : (
            <ul className="space-y-2">
              {sharedWith?.map((user) => (
                <li key={user._id}
                  className="flex items-center justify-between bg-gray-50
                  px-4 py-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="text-xs text-red-500 hover:text-red-700
                      transition"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-100 hover:bg-gray-200 text-gray-700
          py-2 rounded-xl font-medium text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareTask;