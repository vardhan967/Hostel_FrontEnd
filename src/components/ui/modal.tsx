import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@radix-ui/react-dialog';

export const Modal = ({ open, onOpenChange, children }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />
    <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">{children}</div>
    </DialogContent>
  </Dialog>
);
