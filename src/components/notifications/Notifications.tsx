import * as React from 'react';
import { IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import Menu, { type MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';

import { BASE_URL } from '@/utils/constants';
import { getNotifications } from '@/lib/store/notifications.slice';
import { type NotificationResponseInterface } from './notificationType';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: 'steelblue',
      },
    },
    '& .MuiMenuItem-root.active': {
      backgroundColor: alpha(theme.palette.primary.dark, theme.palette.action.selectedOpacity),
      '&:hover': {
        backgroundColor: '#7fc2f9',
        color: '#fff'
      },
    }
  },
}));

export default function NotificationsComponent(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notification.notifications);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const getMyNotification = React.useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/2`, {
        method: "GET"
      })
      const data = await response.json() as NotificationResponseInterface;
      if (data.success) {
        const notification = data.data;
        dispatch(getNotifications(notification));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [dispatch]);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getMyNotification();
  }, [getMyNotification]);

  const badge = React.useMemo(() => notifications.filter(item => !item.is_read).length, [notifications]);

  return (
    <div>
      <Tooltip title="Notifications">
        <Badge badgeContent={badge} color="success" variant='standard'>
          <IconButton onClick={handleClick}>
            <BellIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {notifications.map(noti => (
           <MenuItem key={noti.id} divider onClick={handleClose} className={noti.is_read ? '' : 'active'} disableRipple>
            <p>
              {noti.message}
            </p>
            <hr />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
