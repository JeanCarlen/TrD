import React, { useState } from 'react';

interface AvatarUploadProps {
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onAvatarChange }: AvatarUploadProps) => {

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onAvatarChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
	<div>
	</div>
  );
};

export default AvatarUpload;

