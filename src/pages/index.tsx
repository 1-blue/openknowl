import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

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
import BoardHeader from '@/components/Board/BoardHeader';
import BoardCreateButton from '@/components/Board/BoardCreateButton';
import CardFilter from '@/components/Card/CardFilter';
import Card from '@/components/Card/Card';

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
      console.log('source, destination, draggableId >> ', source, destination, draggableId);
    }

    // 카드인 경우
    if (type === 'CARD') {
      /** 이동될 카드의 식별자 */
      const targetIdx = +draggableId.slice(-1);
      /** 시작 보드의 식별자 */
      const sourceBoardIdx = +source.droppableId.slice(-1);
      /** 시작 카드의 순서 */
      const sourceOrder = source.index;
      /** 도착 보드의 식별자 */
      const destinationBoardIdx = +destination.droppableId.slice(-1);
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

      boardsMutate(props);
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
                  key={'BOARD' + board.idx}
                  draggableId={'BOARD' + board.idx}
                  index={index}
                >
                  <section className="dnd-board-wrapper">
                    <BoardHeader idx={board.idx} category={board.category!.category} />

                    {/* Card 드랍 영역 지정 */}
                    <DND.Dropzone
                      droppableId={'BOARD' + board.idx}
                      type="CARD"
                      direction="vertical"
                    >
                      {board.cards.map(card => (
                        // Card 드래그 영역 지정
                        <DND.Dragzone
                          key={'CARD' + card.idx}
                          draggableId={'CARD' + card.idx}
                          index={card.order}
                        >
                          <Card {...card} />
                        </DND.Dragzone>
                      ))}
                    </DND.Dropzone>
                  </section>
                </DND.Dragzone>
              ))}
            </DND.Dropzone>
          </DND.Container>
        )}
      </Dropzone>
    </article>
  );
};

export default Home;
