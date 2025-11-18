import React, { useEffect } from "react";
import Modal from 'react-modal';
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: any;
  modalHeader?: boolean;
  className?: string;
  overlayStyle?: React.CSSProperties;
};

const GlobalModal = ({
  isOpen,
  onClose,
  title,
  children,
  modalHeader = true,
  className,
  overlayStyle
}: Props) => {

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '0px',
      transform: 'translate(-50%, -50%)',
      border: '2px solid #E9E9E9',
      borderRadius: '20px',
      zIndex: 120,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.60)',
      backdropFilter: "blur(2px)",
      zIndex: 1010,
      ...overlayStyle,
    },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      {modalHeader && (
        <div className="p-3 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4 1sm:gap-2">
            <h3 className="text-black text-[20px] 3sm:text-[18px] 2xs:text-[14px] font-[700] tracking-normal">
              {title}
            </h3>
          </div>
          <div onClick={onClose} className="hover:bg-gray-100 border border-black w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer">
            <X size={18} />
          </div>
        </div>
      )}
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    </Modal>
  );
};

export default GlobalModal;