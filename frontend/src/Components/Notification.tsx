import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const Notification = ({ error, success, info }: { error: string | null, success: boolean, info: boolean }) => {
  useEffect(() => {
    if (error)
	{
      toast.error(error, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-error' });
    }
	else if (success) {
      toast.success('Success Notification!', { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-success' });
    }
	else if (info) {
      toast.info('The info toast', { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-info' });
    }
  }, [error, success, info]);

  return null;
};

export default Notification;
