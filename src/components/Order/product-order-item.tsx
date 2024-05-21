/* eslint-disable react/hook-use-state */
import React, { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import { ProductsTable, type ProductInterface } from '../dashboard/product/products-table';
import { ModalComponent } from '../Modal/Modal';
import { type ProductOrderType } from './create-order-form';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    width: '50px',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface ProductOrderItemsInterface {
  canModify?: boolean;
  productsDisplay: ProductOrderType[];
  setProductDisplay?: React.Dispatch<React.SetStateAction<ProductOrderType[]>>;
}

interface QuantityInputInterface {
  quantity: number;
  onChange: (value: number) => void;
}

function QuantityInput({ quantity, onChange }: QuantityInputInterface): React.JSX.Element {
  const [quantityState, setQuantityState] = useState(0);

  const disabledMinus = quantityState < 1;

  useEffect(() => {
    setQuantityState(quantity);
  }, [quantity]);

  const onAdd = useCallback(() => {
    setQuantityState((prevQuantity) => {
      onChange(Number(prevQuantity) + 1);
      return Number(prevQuantity) + 1;
    });
  }, [onChange]);

  const onRemove = useCallback(() => {
    setQuantityState((prevQuantity) => {
      onChange(Number(prevQuantity) - 1);
      return Number(prevQuantity) - 1;
    });
  }, [onChange]);

  const onChangeQuantity = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityState(Number(e.target.value));
  }, []);

  // useEffect(() => {
  //   onChange(quantityState);
  // }, [onChange, quantityState]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton onClick={onRemove} disabled={disabledMinus} aria-label="remove" size="small">
        <RemoveIcon fontSize="inherit" />
      </IconButton>
      <FormControl variant="standard">
        <BootstrapInput onChange={onChangeQuantity} value={quantityState} />
      </FormControl>
      <IconButton onClick={onAdd} aria-label="add" size="small">
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
}

export function ProductOrderItems({
  canModify,
  productsDisplay,
  setProductDisplay,
}: ProductOrderItemsInterface): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [products, setProduct] = useState<ProductInterface[]>([]);

  const onOpenModal = useCallback(() => {
    setOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  const addItem = useCallback(() => {
    const transferProductsDisplay: ProductOrderType[] = products.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      discount_price: item.discount_price,
      price: item.price,
      quantity: 1,
    }));
    setProductDisplay?.((prevState) => {
      let newState = [...prevState]; // Create a copy of previous state

      for (const product of transferProductsDisplay) {
        const foundProductIndex = newState.findIndex((prod) => prod.id === product.id);

        if (foundProductIndex !== -1) {
          // Update quantity if product already exists
          newState[foundProductIndex].quantity += 1;
        } else {
          // Add new product if it doesn't exist
          newState = [...newState, product];
        }
      }

      return newState; // Return the new state
    });
  }, [setProductDisplay, products]);

  const handleInputChange = useCallback(
    (index: number, value: number) => {
      setProductDisplay?.((prevData: ProductOrderType[]) => {
        const newData = [...prevData];
        newData[index].quantity = value;
        return newData;
      });
    },
    [setProductDisplay]
  );

  const getTotalPrice = useCallback((item: ProductOrderType) => {
    return Number(item.discount_price ?? item.price) * item.quantity;
  }, []);

  const onRemoveItem = useCallback(
    (id: number) => {
      const arr = [...productsDisplay];
      setProductDisplay?.(arr.filter((item) => item.id !== id));
    },
    [productsDisplay, setProductDisplay]
  );

  return (
    <Stack gap={2}>
      <TableContainer component={Paper}>
        <Table arial-label="product order item">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell>Giá gốc</StyledTableCell>
              <StyledTableCell>Giá hiện tại</StyledTableCell>
              <StyledTableCell>Tổng giá</StyledTableCell>
              {canModify ? <StyledTableCell /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {productsDisplay.map((product, index) => (
              <StyledTableRow key={product.id}>
                <StyledTableCell width="40%">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={product.thumbnail} alt={product.title} />
                    <span>{product.title}</span>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell width="10%">
                  {canModify ? (
                    <QuantityInput
                      quantity={product.quantity}
                      onChange={(value: number) => {
                        handleInputChange(index, value);
                      }}
                    />
                  ) : (
                    product.quantity
                  )}
                </StyledTableCell>
                <StyledTableCell>{product.price}</StyledTableCell>
                <StyledTableCell>{product.discount_price}</StyledTableCell>
                <StyledTableCell>{getTotalPrice(product)}</StyledTableCell>
                {canModify ? (
                  <StyledTableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        onRemoveItem(product.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                ) : null}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {canModify ? (
        <div>
          <Button startIcon={<AddCircleOutlineIcon />} variant="contained" onClick={onOpenModal}>
            Thêm sản phẩm
          </Button>
          <ModalComponent
            open={open}
            handleClose={onCloseModal}
            dialogTitle="Thêm sản phẩm cho đơn mua"
            submitAction={addItem}
            submitActionBtnName="Thêm sản phẩm"
          >
            <ProductsTable setSelectedProductsProps={setProduct} />
          </ModalComponent>
        </div>
      ) : null}
    </Stack>
  );
}
