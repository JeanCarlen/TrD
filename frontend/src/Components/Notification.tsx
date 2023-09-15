import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const Notification = ({ error, success, info, achievements }: { error: string | null, success: boolean, info: boolean , achievements: boolean}) => {
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
	else if (achievements) {
		toast.achievements(achievements, { position: toast.POSITION.BOTTOM_CENTER, className: 'toast-achievements' });
	}
  }, [error, success, info, achievements]);

  return null;
};

export default Notification;