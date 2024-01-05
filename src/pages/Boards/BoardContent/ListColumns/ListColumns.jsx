import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Column from './Column/Column';
import { toast } from 'react-toastify';
const ListColumns = ({ columns, createNewColumn, createNewCard, deleteColumn }) => {
  const [showFormAddColumn, setShowFormAddColumn] = useState(false);
  const [columnName, setColumnName] = useState('');

  const handleCreateNewColumn = () => {
    if (!columnName) {
      toast.error('Please your enter column name!', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    const columnData = {
      title: columnName
    };
    createNewColumn(columnData);
    setColumnName('');
    setShowFormAddColumn(false);
  };

  /**
    Thành phần <SortableContext> yêu cầu bạn chuyển cho nó mảng đã sắp xếp của các mã định danh duy nhất được liên kết với từng mục có thể sắp xếp thông qua items prop. Mảng này phải có dạng ["1", "2", "3"] chứ không phải [{id: "1"}, {id: "2}, {id: "3}].
   */
  return (
    <SortableContext items={columns?.map((column) => column?._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          p: 2,
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          bgcolor: 'inherit',
          display: 'flex',
          width: '100%',
          height: '100%',
          '&::-webkit-scrollbar-track': {
            m: 2
          }
        }}
      >
        {columns?.map((column) => {
          return <Column deleteColumn={deleteColumn} createNewCard={createNewCard} key={column?._id} column={column} />;
        })}

        {/* Button add column */}
        {showFormAddColumn ? (
          <Box
            sx={{
              maxWidth: '250px',
              height: 'fit-content',
              minWidth: '250px',
              bgcolor: '#ffffff3d',
              display: 'flex',
              borderRadius: '6px',
              padding: '10px',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            <TextField
              autoFocus
              id='outlined-search'
              label='Enter column title...'
              type='text'
              size='small'
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              sx={{
                minWidth: '120px',
                maxWidth: '250px',
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
                      sx={{ color: columnName ? 'white' : 'transparent', cursor: 'pointer' }}
                      fontSize='small'
                      onClick={() => setColumnName('')}
                    />
                  </InputAdornment>
                )
              }}
            />
            <Box
              sx={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}
            >
              <Button
                onClick={handleCreateNewColumn}
                variant='contained'
                color='success'
                sx={{ color: 'white', width: '50%' }}
              >
                Add column
              </Button>
              <CloseIcon
                onClick={() => setShowFormAddColumn(!showFormAddColumn)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                fontSize='small'
              />
            </Box>
          </Box>
        ) : (
          <Box
            onClick={() => setShowFormAddColumn(!showFormAddColumn)}
            sx={{
              maxWidth: '250px',
              height: 'fit-content',
              minWidth: '250px',
              bgcolor: '#ffffff3d',
              display: 'flex',
              borderRadius: '6px'
            }}
          >
            <Button startIcon={<NoteAddIcon />} variant='outlined' sx={{ color: 'white', width: '100%' }}>
              Add new column
            </Button>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
