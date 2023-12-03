// AvatarUpload.tsx
import React, { useState } from 'react';

interface AvatarUploadProps {
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onAvatarChange }: AvatarUploadProps) => {
//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // setAvatar(dataUrl);
		// setShowAvatarUpload(false);
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

