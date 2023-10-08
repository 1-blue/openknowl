import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

import { apiMoveBoard } from '@/apis';
import { apiMoveCard } from '@/apis';

import { buildQueryString } from '@/utils/helper';

import useFetchBoards from '@/hooks/useFetchBoards';
import useFetchCategories from '@/hooks/useFetchCategories';

import { useAppDispatch } from '@/store';
import { openCreateCardForm, openCreateCardFormByPDF, openCardDetail } from '@/store/slices/card';

import Custom500 from '@/pages/500';
import DND from '@/components/common/DND';
import Skeleton from '@/components/common/Skeleton';
import Dropzone from '@/components/common/Dropzone';
import BoardCreateForm from '@/components/Board/BoardCreateForm';
import CardFilter from '@/components/Card/CardFilter';
import Board from '@/components/Board/Board';

import type { OnDragEndResponder } from 'react-beautiful-dnd';

/** 2023/09/18 - 메인 페이지 - by 1-blue */
const Home = () => {
  const dispatch = useAppDispatch();
  const { boards, isLoading, error, boardsMutate } = useFetchBoards();
  const { categories } = useFetchCategories();

  const router = useRouter();
  const searchParams = useSearchParams();

  /** 2023/10/04 - 드랍존에 드랍되었을 때 실행할 함수 - by 1-blue */
  const onDropExcute = (file: File) => {
    if (file.type !== 'application/pdf') {
      return toast.error('PDF만 업로드 가능합니다!');
    }

    dispatch(openCreateCardFormByPDF({ pdfFile: file }));
  };

  /** 2023/09/25 - 보드 생성 모달 열기 이벤트 핸들러 ( 버블링 ) - by 1-blue */
  const onOpenModalByBubbling: React.MouseEventHandler<HTMLElement> = e => {
    if (!(e.target instanceof SVGElement || e.target instanceof HTMLElement)) return;

    const { targetIdx, category } = e.target.dataset;

    // 일반 보드 생성
    if (category) {
      dispatch(openCreateCardForm({ defaultCategory: category }));
    }
    if (targetIdx) {
      dispatch(openCardDetail({ targetIdx: +targetIdx }));
    }
  };
  /** 2023/10/05 - 필터링 이벤트 핸들러 ( 버블링 ) - by 1-blue */
  const onFilterByBubbling: React.MouseEventHandler<HTMLElement> = e => {
    if (!(e.target instanceof HTMLElement)) return;

    const { platform, tag } = e.target.dataset;
    const currentTag = searchParams.get('tag');
    const currentPlatform = searchParams.get('platform');

    if (platform) {
      const path = buildQueryString(router.pathname, {
        platform: currentPlatform?.includes(platform) ? null : platform,
        ...(currentTag && { tag: currentTag }),
      });

      router.replace(path);
    }
    if (tag) {
      if (currentTag?.includes(tag)) return;

      const path = buildQueryString(router.pathname, {
        tag: currentTag ? currentTag + ',' + tag : tag,
        ...(currentPlatform && { platform: currentPlatform }),
      });

      router.replace(path);
    }
  };

  /** 2023/10/07 - 보드 드래그 완료 후 실행할 함수 - by 1-blue */
  const onDragEnd: OnDragEndResponder = ({ type, source, destination, draggableId }) => {
    // 정해지지 않은 공간에 드랍한 경우
    if (!destination) return;

    // 보드를 Drag & Drop한 경우
    if (type === 'BOARD') {
      /** 이동될 보드의 식별자 */
      const targetIdx = +draggableId.slice(draggableId.indexOf('-') + 1);
      /** 시작 보드의 순서 */
      const sourceOrder = source.index;
      /** 도착 보드의 순서 */
      const destinationOrder = destination.index;

      boardsMutate(boards => {
        if (!boards) return boards;
        if (!boards.data) return boards;

        let copyBoards = [...boards.data];

        /** 출발 보드 인덱스 */
        const sourceIndex = copyBoards.findIndex(board => board.order === sourceOrder);
        /** 도착 보드 인덱스 */
        const destinationIndex = copyBoards.findIndex(board => board.order === destinationOrder);

        // 원래 위치보다 뒤로 이동하는 경우
        if (sourceOrder < destinationOrder) {
          copyBoards = copyBoards.map(board => {
            if (board.order > sourceOrder && board.order <= destinationOrder) {
              return { ...board, order: board.order - 1 };
            }

            return board;
          });
        }
        // 원래 위치보다 앞으로 이동하는 경우
        else {
          copyBoards = copyBoards.map(board => {
            if (board.order < sourceOrder && board.order >= destinationOrder) {
              return { ...board, order: board.order + 1 };
            }

            return board;
          });
        }

        const [target] = copyBoards.splice(sourceIndex, 1);
        target.order = destinationOrder;

        copyBoards.splice(destinationIndex, 0, target);

        return { ...boards, data: copyBoards };
      });
      apiMoveBoard({ idx: targetIdx, sourceOrder, destinationOrder });
    }

    // 카드인 경우
    if (type === 'CARD') {
      /** 이동될 카드의 식별자 */
      const targetIdx = +draggableId.slice(draggableId.indexOf('-') + 1);
      /** 시작 보드의 식별자 */
      const sourceBoardIdx = +source.droppableId.slice(source.droppableId.indexOf('-') + 1);
      /** 시작 카드의 순서 */
      const sourceOrder = source.index;
      /** 도착 보드의 식별자 */
      const destinationBoardIdx = +destination.droppableId.slice(
        destination.droppableId.indexOf('-') + 1,
      );
      /** 도착 카드의 순서 */
      const destinationOrder = destination.index;

      // 같은 위치에 드랍한 경우
      if (destinationBoardIdx === sourceBoardIdx && destinationOrder === sourceOrder) return;

      const props = {
        idx: targetIdx,
        sourceBoardIdx,
        sourceOrder,
        destinationBoardIdx,
        destinationOrder,
      };

      boardsMutate(boards => {
        if (!boards) return boards!;
        if (!boards?.data) return boards;

        // 얕은 복사본 생성
        const copyBoards = JSON.parse(JSON.stringify(boards.data)) as typeof boards.data;

        /** 출발 보드 인덱스 */
        const sourceBoardIndex = copyBoards.findIndex(board => board.idx === sourceBoardIdx);
        /** 출발 카드 인덱스 */
        const sourceCardIndex = copyBoards[sourceBoardIndex].cards.findIndex(
          card => card.order === sourceOrder,
        );
        /** 도착 보드 인덱스 */
        const destinationBoardIndex = copyBoards.findIndex(
          board => board.idx === destinationBoardIdx,
        );

        // 출발 위치의 카드들 order 수정
        copyBoards[sourceBoardIndex].cards = copyBoards[sourceBoardIndex].cards.map(card => {
          if (card.order < sourceOrder) return card;

          // 출발 카드 위치보다 뒤에 있다면 -1
          return { ...card, order: card.order - 1 };
        });
        // 도착 위치의 카드들 order 수정
        copyBoards[destinationBoardIndex].cards = copyBoards[destinationBoardIndex].cards.map(
          card => {
            if (card.order < destinationOrder) return card;

            // 도착 카드 위치보다 뒤에 있다면 +1
            return { ...card, order: card.order + 1 };
          },
        );

        // 이동할 카드 잘라내기
        const [target] = copyBoards[sourceBoardIndex].cards.splice(sourceCardIndex, 1);

        // 이동할 카드 순서 변경
        target.order = destinationOrder;

        // 이동할 카드 붙여넣기
        copyBoards
          .find(board => board.idx === destinationBoardIdx)
          ?.cards.splice(destinationOrder, 0, target);

        return { ...boards, data: copyBoards };
      });
      apiMoveCard(props);
    }
  };

  if (error) return <Custom500 />;

  return (
    <article
      style={{ padding: '2em' }}
      onClick={e => {
        onOpenModalByBubbling(e);
        onFilterByBubbling(e);
      }}
    >
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1em' }}>
        Openknowl - 프론트엔드 과제 ( 칸반보드 )
      </h1>

      <Dropzone onDropExcute={onDropExcute}>
        <CardFilter />

        {isLoading || !boards || !categories ? (
          <Skeleton.BoardGroup />
        ) : (
          // 전체 Drag & Drop 영역 지정
          <DND.Container onDragEnd={onDragEnd}>
            {/* Board Drop 영역 지정 */}
            <DND.Dropzone droppableId="BOARD" type="BOARD" direction="horizontal">
              {boards.map((board, index) => (
                // Board Drag 영역 지정
                <DND.Dragzone
                  key={'BOARD-' + board.idx}
                  draggableId={'BOARD-' + board.idx}
                  index={index}
                >
                  <Board {...board} />
                </DND.Dragzone>
              ))}
            </DND.Dropzone>

            {/* 보드 생성 폼 */}
            <BoardCreateForm />
          </DND.Container>
        )}
      </Dropzone>
    </article>
  );
};

export default Home;
