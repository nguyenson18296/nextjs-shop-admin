import React from "react";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface ModalInterface {
  open?: boolean;
  children: React.ReactNode;
  dialogTitle: string;
  handleClose: () => void;
  submitAction?: () => void;
  submitActionBtnName?: string;
}

export function ModalComponent({ children, open = false, dialogTitle, submitAction, submitActionBtnName, handleClose }: ModalInterface): React.JSX.Element {
  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <DialogTitle>
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {submitActionBtnName ? <Button onClick={submitAction} variant="contained">{submitActionBtnName}</Button> : null}
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
