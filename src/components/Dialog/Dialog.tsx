import React from 'react';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '800px'
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export function DialogComponent({
  open = false,
  handleClose,
  headerText,
  children,
}: {
  open?: boolean;
  handleClose: () => void;
  headerText?: string;
  children: React.ReactElement;
}): React.JSX.Element {
  return (
    <BootstrapDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      maxWidth='md'
    >
        {headerText ? (
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {headerText}
          </DialogTitle>
        ) : null}
        <DialogContent dividers>
          {children}
        </DialogContent>
        <Divider />
    </BootstrapDialog>
  );
}
