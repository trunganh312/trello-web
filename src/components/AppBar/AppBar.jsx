import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, Button, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Profile from './Menus/Profile';
import Recent from './Menus/Recent';
import Started from './Menus/Started';
import Templates from './Menus/Templates';
import Workspaces from './Menus/Workspaces';
import { useState } from 'react';
const AppBar = () => {
  const [search, setSearch] = useState('');
  return (
    <Box
      px={2}
      sx={{
        height: (theme) => theme.trello.appBarHight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AppsIcon
            sx={{ display: { xs: 'block', md: 'none', sm: 'block' }, color: 'white', cursor: 'pointer' }}
          ></AppsIcon>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SvgIcon sx={{ color: 'white', cursor: 'pointer' }} component={TrelloIcon} inheritViewBox />
          <Typography variant='span' sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
            Trello
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Workspaces></Workspaces>
            <Recent></Recent>
            <Started></Started>
            <Templates></Templates>
          </Box>
          <Button
            sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }}
            variant='outlined'
            endicon={<AddToPhotosIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          id='outlined-search'
          label='Search...'
          type='text'
          size='small'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  sx={{ color: search ? 'white' : 'transparent', cursor: 'pointer' }}
                  fontSize='small'
                  onClick={() => setSearch('')}
                />
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <ModeSelect></ModeSelect>
          <Tooltip title='Notifications'>
            <Badge color='warning' variant='dot'>
              <NotificationsIcon color='action' sx={{ cursor: 'pointer', color: 'white' }} />
            </Badge>
          </Tooltip>
          <Tooltip title='Help'>
            <Badge color='primary'>
              <HelpOutlineIcon color='action' sx={{ cursor: 'pointer', color: 'white' }} />
            </Badge>
          </Tooltip>
        </Box>
        <Profile></Profile>
      </Box>
    </Box>
  );
};

export default AppBar;
