import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Column from './Column/Column';
const ListColumns = ({ columns }) => {
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
          return <Column key={column?._id} column={column} />;
        })}

        {/* Button add column */}
        <Box
          sx={{
            maxWidth: '200px',
            height: 'fit-content',
            minWidth: '200px',
            bgcolor: '#ffffff3d',
            display: 'flex',
            borderRadius: '6px'
          }}
        >
          <Button startIcon={<NoteAddIcon />} variant='outlined' sx={{ color: 'white', width: '100%' }}>
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
