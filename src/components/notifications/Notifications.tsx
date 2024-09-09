import * as React from 'react';
import { IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import Menu, { type MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import dayjs from 'dayjs';
import io from 'socket.io-client';
import { BASE_URL } from '@/utils/constants';

import { getNotifications } from '@/lib/store/notifications.slice';
import { type NotificationResponseInterface } from './notificationType';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import useFetchData from '@/hooks/use-fetch';
import { updateNewNotification, type NotificationInterface } from '@/lib/store/notifications.slice';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const relativeTime = require('dayjs/plugin/relativeTime');

// eslint-disable-next-line import/no-named-as-default-member, @typescript-eslint/no-unsafe-argument
dayjs.extend(relativeTime);

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
      display: 'block',
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: 'steelblue',
      },
      '& .time-created': {
        fontSize: '12px'
      }
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
  const { data } = useFetchData<{ data: NotificationResponseInterface['data'] }>('/notifications', 'GET');

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    // Initialize WebSocket connection
    const socket = io(BASE_URL); // Use your server's address

    // Setup event listener for 'notification' events
    socket.on('notificationToClient', (notificationData: NotificationInterface) => {
      dispatch(updateNewNotification(notificationData));
      // Handle notification data (e.g., display a notification)
    });

    // Cleanup on component unmount
    return () => {
      socket.off('notification');
      socket.close();
    };
  }, [dispatch]); // Empty dependency array means this effect runs once on mount

  const getMyNotification = React.useCallback(async () => {
    try {
      if (data?.data) {
        dispatch(getNotifications(data.data));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [dispatch, data]);

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
            <span className='time-created'>
              {dayjs(noti.created_at).fromNow()}
            </span>
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
