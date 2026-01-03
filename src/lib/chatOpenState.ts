type ChatOpenListener = (isOpen: boolean) => void;

let isChatOpen = false;
let listeners: ChatOpenListener[] = [];

export const chatOpenState = {
  getIsOpen: () => isChatOpen,
  
  setOpen: (open: boolean) => {
    isChatOpen = open;
    listeners.forEach(listener => listener(isChatOpen));
  },
  
  subscribe: (listener: ChatOpenListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

