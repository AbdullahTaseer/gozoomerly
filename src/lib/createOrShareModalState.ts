type ModalStateListener = (isOpen: boolean) => void;

let isOpen = false;
let listeners: ModalStateListener[] = [];

export const createOrShareModalState = {
  getIsOpen: () => isOpen,

  open: () => {
    isOpen = true;
    listeners.forEach(listener => listener(isOpen));
  },

  close: () => {
    isOpen = false;
    listeners.forEach(listener => listener(isOpen));
  },

  subscribe: (listener: ModalStateListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

