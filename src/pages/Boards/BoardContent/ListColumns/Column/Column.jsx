import { Cloud, ContentCopy, ContentCut, ContentPaste } from '@mui/icons-material';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Divider, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ListCards from './ListCards/ListCards';
import { useSortable } from '@dnd-kit/sortable';
import { mapOrder } from '~/utils/sort';
import { CSS } from '@dnd-kit/utilities';

const Column = ({ column }) => {
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
    opacity: isDragging ? 0.5 : 1
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const orderedCard = mapOrder(column?.cards, column?.cardOrderIds, '_id');

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
            endIcon={<KeyboardArrowDownIcon />}
            size='small'
          />
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button-workspace'
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCardIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Add column</ListItemText>
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
            <MenuItem>
              <ListItemIcon>
                <DeleteForeverIcon fontSize='small' />
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
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button size='small' startIcon={<AddCardIcon />}>
            Add new card
          </Button>
          <DragHandleIcon size='small' sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>
    </div>
  );
};

export default Column;
