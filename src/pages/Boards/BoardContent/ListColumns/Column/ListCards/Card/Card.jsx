import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CommentIcon from '@mui/icons-material/Comment';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PeopleIcon from '@mui/icons-material/People';
import { Button, CardActions, CardMedia, Card as MuiCard, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
const Card = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: card
  });

  const style = {
    /**
     * Các mục bị kéo giãn vì bạn đang sử dụng CSS.Transform.toString(), hãy sử dụng CSS.Translate.toString() nếu bạn không muốn áp dụng chuyển đổi tỷ lệ.
     */
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px solid #2ecc71' : 'none'
  };
  if (card?.cover == null) {
    return (
      <MuiCard
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          overflow: 'unset',
          boxShadow: '0 1px 1px rgba(0 0 0 0.2)',
          display: card?.FE_PlaceholderCard ? 'none' : 'block'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant='body' component='div'>
            {card?.title}
          </Typography>
        </CardContent>
      </MuiCard>
    );
  }
  return (
    <MuiCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        cursor: 'pointer',
        overflow: 'unset',
        boxShadow: '0 1px 1px rgba(0 0 0 0.2)'
      }}
    >
      <CardMedia sx={{ height: 140, borderTopLeftRadiusRadius: 'inherit' }} image={card?.cover} title='green iguana' />
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant='body' component='div'>
          {card?.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small' startIcon={<PeopleIcon />}>
          {card?.memberIds?.length}
        </Button>
        <Button size='small' startIcon={<CommentIcon />}>
          {card?.comments?.length}
        </Button>
        <Button size='small' startIcon={<InsertLinkIcon />}>
          {card?.attachments?.length}
        </Button>
      </CardActions>
    </MuiCard>
  );
};

export default Card;
