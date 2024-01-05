import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Cloud, ContentCopy, ContentCut, ContentPaste } from '@mui/icons-material';
import AddCardIcon from '@mui/icons-material/AddCard';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Divider, InputAdornment, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ListCards from './ListCards/ListCards';
import Swal from 'sweetalert2';
const Column = ({ column, createNewCard, deleteColumn }) => {
  const [showFormAddCard, setShowFormAddCard] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleCreateNewCard = () => {
    if (!cardName) {
      toast.error('Please your enter card name!', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    const cardData = {
      title: cardName,
      columnId: column?._id
    };
    createNewCard(cardData);
    setCardName('');
    setShowFormAddCard(false);
  };
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: column
  });

  const style = {
    /**
     * Các mục bị kéo giãn vì bạn đang sử dụng CSS.Transform.toString(), hãy sử dụng CSS.Translate.toString() nếu bạn không muốn áp dụng chuyển đổi tỷ lệ.
     */
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: '100%'
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const orderedCard = column.cards;

  const handleDeleteColumn = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        });
        deleteColumn(column);
      }
    });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box
        {...listeners}
        sx={{
          border: isDragging ? '3px solid #f1c40f' : 'none',
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          backgroundColor: '#ccc',
          minWidth: '300px',
          maxWidth: '300px',
          borderRadius: '10px',
          p: 1,
          height: 'fit-content',
          maxHeight: '100%',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0')
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
          <Typography variant='h6' sx={{ fontSize: '1rem' }}>
            {column?.title}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{ color: 'text.primary', cursor: 'pointer' }}
            id='basic-button-workspace'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endicon={<KeyboardArrowDownIcon />}
            size='small'
          />
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button-workspace'
            }}
          >
            <MenuItem
              sx={{
                '&:hover': {
                  color: 'success.light',
                  '& .add-forever-icon': {
                    color: 'success.light'
                  }
                }
              }}
              onClick={() => setShowFormAddCard(true)}
            >
              <ListItemIcon>
                <AddCardIcon className='add-forever-icon' fontSize='small' />
              </ListItemIcon>
              <ListItemText>Add card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize='small' />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize='small' />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize='small' />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleDeleteColumn}
              sx={{
                '&:hover': {
                  color: 'warning.dark',
                  '& .delete-forever-icon': {
                    color: 'warning.dark'
                  }
                }
              }}
            >
              <ListItemIcon>
                <DeleteForeverIcon className='delete-forever-icon' fontSize='small' />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize='small' />
              </ListItemIcon>
              <ListItemText>Web Clipboard</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        {/* List card */}
        <ListCards cards={orderedCard} />
        {showFormAddCard ? (
          <Box
            sx={{
              maxWidth: '200px',
              height: 'fit-content',
              minWidth: '200px',
              display: 'flex',
              borderRadius: '6px',
              padding: '10px',
              gap: '5px',
              alignItems: 'center'
            }}
          >
            <TextField
              autoFocus
              id='outlined-search'
              label='Enter card title...'
              data-no-dnd='true'
              type='text'
              size='small'
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              sx={{
                minWidth: '100%',
                maxWidth: '250px',
                '& label': { color: `${(theme) => theme.palette.primary.main}` },
                '& input': { color: `${(theme) => theme.palette.primary.main}` },
                '& label.Mui-focused': { color: `${(theme) => theme.palette.primary.main}` },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: `${(theme) => theme.palette.primary.main}`
                  },
                  '&:hover fieldset': {
                    borderColor: `${(theme) => theme.palette.primary.main}`
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: `${(theme) => theme.palette.primary.main}`
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <CloseIcon
                      sx={{
                        color: cardName ? `${(theme) => theme.palette.primary.main}` : 'transparent',
                        cursor: 'pointer'
                      }}
                      fontSize='small'
                      onClick={() => setCardName('')}
                    />
                  </InputAdornment>
                )
              }}
            />
            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px'
              }}
            >
              <Button
                onClick={handleCreateNewCard}
                variant='contained'
                color='success'
                size='small'
                sx={{ color: 'white', padding: '4px' }}
              >
                Add card
              </Button>
              <CloseIcon
                onClick={() => setShowFormAddCard(!showFormAddCard)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                fontSize='small'
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button onClick={() => setShowFormAddCard(!showFormAddCard)} size='small' startIcon={<AddCardIcon />}>
              Add new card
            </Button>
            <DragHandleIcon size='small' sx={{ cursor: 'pointer' }} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Column;
