import toast from 'react-hot-toast';

export function notify(message: string, status: string) {
  return status === 'success' ? toast.success(message) : toast.error(message);
}
