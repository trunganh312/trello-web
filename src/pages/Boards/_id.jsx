import { Box, CircularProgress, Container, Typography } from '@mui/material';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mockData } from '~/apis/mock-data';
import boardApi from '~/apis/boardApi';
import { useEffect, useState } from 'react';
import columnApi from '~/apis/columnApi';
import { toast } from 'react-toastify';
import cardApi from '~/apis/cardApi';
import { genneratePlaceholderCard } from '~/utils/formatters';
import { mapOrder } from '~/utils/sort';
const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const id = '65956c1415a0a2562f6dcd85';
    (async () => {
      const board = await boardApi.get(id);
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        if (column.cards.length <= 0) {
          column.cards = [genneratePlaceholderCard(column)];
          column.cardOrderIds = [genneratePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id');
        }
      });
      setBoard(board);
    })();
  }, []);

  const createNewColumn = async (data) => {
    const columnData = await columnApi
      .add({
        ...data,
        boardId: board._id
      })
      .then((data) => {
        toast.success('Create new column successfully!', {
          position: toast.POSITION.TOP_RIGHT
        });
        return data;
      });

    columnData.cards = [genneratePlaceholderCard(columnData)];
    columnData.cardOrderIds = [genneratePlaceholderCard(columnData)._id];
    const newBoard = {
      ...board
    };
    newBoard.columns.push(columnData);
    newBoard.columnOrderIds.push(columnData._id);
    setBoard(newBoard);
  };

  const createNewCard = async (data) => {
    const cardData = await cardApi
      .add({
        ...data,
        boardId: board._id
      })
      .then((data) => {
        toast.success('Create new card successfully!', {
          position: toast.POSITION.TOP_RIGHT
        });
        return data;
      });
    const newBoard = {
      ...board
    };

    const columnToUpdate = newBoard.columns.find((column) => column._id === cardData.columnId);

    if (columnToUpdate) {
      if (columnToUpdate.cards.some((c) => c.FE_PlaceholderCard)) {
        columnToUpdate.cards = [cardData];
        columnToUpdate.cardOrderIds = cardData._id;
      } else {
        columnToUpdate.cards.push(cardData);
        columnToUpdate.cardOrderIds.push(cardData._id);
      }

      setBoard(newBoard);
    }
  };

  const moveColumnOrderIds = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = {
      ...board
    };
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    newBoard.columns = dndOrderedColumns;
    setBoard(newBoard);
    boardApi.update({ columnOrderIds: newBoard.columnOrderIds, _id: newBoard._id });
  };

  // Kéo thả card trong cùng 1 column
  const moveCardInTheSameColumn = async (dndOrderedCards, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedCardsIds = dndOrderedCards.map((c) => c._id);
    const newBoard = {
      ...board
    };
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cardOrderIds = dndOrderedCardsIds;
      columnToUpdate.cards = dndOrderedCards;
      setBoard(newBoard);
    }

    // Gọi API update column
    columnApi.update({ cardOrderIds: dndOrderedCardsIds }, columnId);
  };
  // Xử lý kéo thả card sang các column khác
  /**
   * B1: Cập nhật mảng cardOrderIds ở bảng column ban đầu chứa nó
   * B2: Cập nhật mảng cardOrderIds ở bảng column tiếp theo chứa nó
   * B3: Cập nhật lại trường columnId ở card đã kéo
   => Viết riếng một API support riêng 
   */
  const moveCardDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board

    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = {
      ...board
    };
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    newBoard.columns = dndOrderedColumns;
    setBoard(newBoard);

    let prevCardOrderIds = newBoard.columns.find((column) => column._id === prevColumnId)?.cardOrderIds;
    // Kiếm tra xem trong mảng prevCardOrderIds có chứa case là columnId-placechoholder-card không, nếu tồn tại thì gán lại prevCardOrderIds bằng mảng rỗng để đấy lên DB
    if (prevCardOrderIds[0].includes('-placeholder-card')) prevCardOrderIds = [];

    // Gọi API thực hiện việc kéo thả card sang column khác
    boardApi.moveCardDifferentColumn({
      currentCardId,
      prevColumnId,
      nextColumnId,
      prevCardOrderIds,
      nextCardOrderIds: newBoard.columns.find((column) => column._id === nextColumnId)?.cardOrderIds
    });
  };

  // Xử lý xóa column
  const deleteColumn = async (column) => {
    // Cập nhật lại board sau khi xóa column
    const newBoard = {
      ...board
    };
    newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((id) => id !== column._id);
    setBoard(newBoard);

    columnApi.remove(column._id).then(() => {
      toast.success('Delete column successfully!', {
        position: toast.POSITION.TOP_RIGHT
      });
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar></AppBar>
      <BoardBar board={board}></BoardBar>
      <BoardContent
        moveColumnOrderIds={moveColumnOrderIds}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        deleteColumn={deleteColumn}
        board={board}
      ></BoardContent>
    </Container>
  );
};

export default Board;
