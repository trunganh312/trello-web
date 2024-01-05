import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import { cloneDeep, isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mapOrder } from '~/utils/sort';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import ListColumns from './ListColumns/ListColumns';
import { genneratePlaceholderCard } from '~/utils/formatters';
import { MouseSensor, TouchSensor } from '~/customLibary/DndKitSensors';
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
};

const BoardContent = ({
  board,
  createNewColumn,
  createNewCard,
  moveColumnOrderIds,
  moveCardInTheSameColumn,
  moveCardDifferentColumn,
  deleteColumn
}) => {
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);
  const [activeDragType, setActiveDragType] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);

  // Điểm va chạm cuối cuùng trước đó
  const lastOverId = useRef(null);
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  };

  const findColumnById = (cardId) => {
    return orderedColumns?.find((column) => column.cards.map((card) => card._id).includes(cardId));
  };

  //https://docs.dndkit.com/api-documentation/sensors
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  });
  const moveBetweenDifferentColumns = (
    active,
    over,
    activeColumn,
    overColumn,
    activeCardId,
    overCardId,
    activeCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColums) => {
      // Tìm vị trí của over card trong column đích (nơi mà active card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);

      let newCardIndex;

      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

      const nextColumn = cloneDeep(prevColums);
      const nextActiveColumn = nextColumn.find((c) => c._id === activeColumn._id);
      const nextOverColumn = nextColumn.find((c) => c._id === overColumn._id);

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter((c) => c._id !== activeCardId);

        if (isEmpty(nextActiveColumn.cards) || !nextActiveColumn.cards) {
          nextActiveColumn.cards = [genneratePlaceholderCard(activeColumn)];
        }

        // Cập nhaậta laij mạng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id);
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter((c) => c._id !== activeCardId);
        // Thêm cardActive vào column đang thả
        // Caách 1
        // nextOverColumn.cards.splice(newCardIndex, 0, {
        //   ...activeCardData,
        //   columnId: overColumn._id
        // });

        nextOverColumn.cards = nextOverColumn.cards.filter((c) => !c.FE_PlaceholderCard);

        // Cách 2
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeCardData);
        // Cập nhaậta laij mạng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);
      }

      // Khi card được kéo thả xong thì t check xem có phải đã kéo xong r hay không, nếu xong rồi thì t gọi hàm moveCardDifferentColumn để thực hiện chức năng kéo thả card giữa các column
      if (triggerFrom === 'handleDragEnd') {
        moveCardDifferentColumn(activeCardId, oldColumnWhenDraggingCard._id, overColumn._id, orderedColumns);
      }

      return nextColumn;
    });
  };

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const orderedColumns = board?.columns;
    setOrderedColumns(orderedColumns);
  }, [board]);
  const handleDragStart = (event) => {
    setActiveDragData(event?.active?.data?.current);
    setActiveDragId(event?.active?.id);
    setActiveDragType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnById(event?.active?.id));
    }
  };

  // Trigger quá trình hành động kéo một phần tử
  const handleDragOver = (event) => {
    // Kiểm tra nếu kéo column thì không làm gì khác đằng sau
    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }
    const { active, over } = event;

    // Kiểm tra nếu không tồn tại over(kéo linh tinh ra ngoài thì return tránh lỗi)
    if (active == null || over == null) {
      return;
    }

    const {
      id: activeCardId,
      data: { current: activeCardData }
    } = active;
    const { id: overCardId } = over;

    // Tìm 2 column mà card kéo từ cái này sang cái kia
    const activeColumn = findColumnById(activeCardId);
    const overColumn = findColumnById(overCardId);

    // Nếu không tồn tại 1 trong 2 thì return tránh crash trang web
    if (!activeColumn || !overColumn) {
      return;
    }

    if (activeColumn?._id !== overColumn?._id) {
      moveBetweenDifferentColumns(
        active,
        over,
        activeColumn,
        overColumn,
        activeCardId,
        overCardId,
        activeCardData,
        'handleDragOver'
      );
    }
  };

  // Trigger kết thúc hành động kéo một phần tử => hành động thả
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // Kiểm tra nếu không tồn tại over(kéo linh tinh ra ngoài thì return tránh lỗi)
    if (active == null || over == null) {
      return;
    }

    // Kiểm tra nếu kéo card thì không làm gì khác đằng sau
    // Xử lý kéo thả cards trong columns
    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeCardId,
        data: { current: activeCardData }
      } = active;
      const { id: overCardId } = over;

      // Tìm 2 column mà card kéo từ cái này sang cái kia
      const activeColumn = findColumnById(activeCardId);
      const overColumn = findColumnById(overCardId);

      // Nếu không tồn tại 1 trong 2 thì return tránh crash trang web
      if (!activeColumn || !overColumn) {
        return;
      }

      // Phải dùng tới activeDragData hoặc oldColumnWhenDraggingCard (set vào state từ bước handleDragStart) chứ không phải activeCardData trong scope handleDragEnd này vì khi đi qua handleDragOver thì state đã được xét lại rồi
      if (oldColumnWhenDraggingCard?._id !== overColumn?._id) {
        // Hành động kéo thả giữa 2 column khác nhau
        moveBetweenDifferentColumns(
          active,
          over,
          activeColumn,
          overColumn,
          activeCardId,
          overCardId,
          activeCardData,
          'handleDragEnd'
        );
      } else {
        // Hành động kéo thả giữa 2 column giống nhau
        // lấy vị trí cũ của card(từ acive)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragId);
        // lấy vị trí mới của card(từ overColumn)
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);

        // Dùng arraymove của thằng dndKit để sắp xếp lại mảng columns ban đầu
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex);

        setOrderedColumns((prevColums) => {
          const nextColumn = cloneDeep(prevColums);

          // Tìm tới column được thả
          const targetColumn = nextColumn.find((c) => c._id === overColumn?._id);

          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = targetColumn.cards.map((c) => c._id);
          return nextColumn;
        });

        moveCardInTheSameColumn(dndOrderedCards, oldColumnWhenDraggingCard._id);
      }
    }

    // Xử lý kéo thả columns trong boardContent
    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lấy vị trí cũ của column(từ acive)
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id);
        // lấy vị trí mới của column(từ over)
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id);

        // Dùng arraymove của thằng dndKit để sắp xếp lại mảng columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);

        setOrderedColumns(dndOrderedColumns);

        // Call api update columnOrderIds
        moveColumnOrderIds(dndOrderedColumns);
      }
    }

    // Sau khi kéo thả phải xét về giá trị null
    setActiveDragData(null);
    setActiveDragId(null);
    setActiveDragType(null);
    setOldColumnWhenDraggingCard(null);
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // Tìm các điểm giao nhau -  va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections.length) return;
      // const intersections =
      //   pointerIntersections.length > 0
      //     ? // If there are droppables intersecting with the pointer, return those
      //       pointerIntersections
      //     : rectIntersection(args);
      let overId = getFirstCollision(pointerIntersections, 'id');

      if (overId !== null) {
        lastOverId.current = overId;
        // Nếu over là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenters hoặc closestCorners đều được. Tuy nhiên duùng closestCorners thì sẽ mượt mà hơn
        const checkColumn = orderedColumns.find((column) => column._id === overId);
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && checkColumn.cardOrderIds.includes(container.id)
            )
          })[0]?.id;
        }
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragType, orderedColumns]
  );

  return (
    <DndContext
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện ra va chạm vì 2 columns không cùng kích thước sẽ bị conflict
      // Nếu chỉ dùng closestCorners thì sẽ bị bug conflict
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <Box
        sx={{
          height: (theme) => `${theme.trello.appBoardBarHight}`,
          backgroundColor: 'primary.dark',
          width: '100%',

          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          padding: '10px 0'
        }}
      >
        <ListColumns
          deleteColumn={deleteColumn}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          columns={orderedColumns}
        ></ListColumns>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragData && activeDragType === ACTIVE_DRAG_ITEM_TYPE.CARD ? (
            <Card card={activeDragData} />
          ) : (
            <Column column={activeDragData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
