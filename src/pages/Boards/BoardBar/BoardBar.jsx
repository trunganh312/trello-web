import { Avatar, AvatarGroup, Button, Chip, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatters';
const MENU_STYLES = {
  border: 'none',
  color: 'white',
  padding: '5px',
  borderRadius: '5px',
  bgcolor: 'transparent',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': { bgcolor: 'primary.50' }
};
const BoardBar = ({ board }) => {
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.boardBarHight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip icon={<SpaceDashboardIcon />} label={board?.title} sx={MENU_STYLES} clickable />
        <Chip icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)} sx={MENU_STYLES} clickable />
        <Chip icon={<AddToDriveIcon />} label='Add To Google Drive' sx={MENU_STYLES} clickable />
        <Chip icon={<BoltIcon />} label='Automation' sx={MENU_STYLES} clickable />
        <Chip icon={<FilterListIcon />} label='Filters' sx={MENU_STYLES} clickable />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          startIcon={<PersonAddIcon />}
          variant='outlined'
          sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              fontSize: 14,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title='Remy Sharp'>
            <Avatar alt='Remy Sharp' src='' />
          </Tooltip>
          <Tooltip title='Remy Sharp'>
            <Avatar alt='Remy Sharp' src='' />
          </Tooltip>
          <Tooltip title='Remy Sharp'>
            <Avatar alt='Remy Sharp' src='' />
          </Tooltip>
          <Tooltip title='Remy Sharp'>
            <Avatar alt='Remy Sharp' src='' />
          </Tooltip>
          <Tooltip title='Remy Sharp'>
            <Avatar alt='Remy Sharp' src='' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default BoardBar;
