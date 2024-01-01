import Box from '@mui/material/Box';
import Card from './Card/Card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
const ListCards = ({ cards }) => {
  return (
    <SortableContext items={cards?.map((card) => card?._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 3.5px',
          m: '0 3.5px',
          flex: 1,
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          maxHeight: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf'
          }
        }}
      >
        {cards?.map((card) => (
          <Card key={card?._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
};

export default ListCards;
