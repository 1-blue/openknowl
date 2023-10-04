import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

import { apiMoveBoard } from '@/apis';

import useFetchBoards from '@/hooks/useFetchBoards';
import useFetchCategories from '@/hooks/useFetchCategoriesOfBoard';

import { useAppDispatch } from '@/store';
import { openBoardForm, openBoardDetail } from '@/store/slices/board';

import Custom500 from '@/pages/500';
import Board from '@/components/common/Board';
import Skeleton from '@/components/common/Skeleton';
import Dropzone from '@/components/common/Dropzone';
import BoardFilter from '@/components/Board/BoardFilter';

/** 2023/09/18 - 메인 페이지 - by 1-blue */
const Home = () => {
  const { mutate } = useSWRConfig();
  const dispatch = useAppDispatch();
  const { boardsGroup, isLoading, error, boardsMutate } = useFetchBoards();
  const { categories } = useFetchCategories();

  /** 2023/10/04 - 드랍존에 드랍되었을 때 실행할 함수 - by 1-blue */
  const onDropExcute = (file: File) => {
    if (file.type !== 'application/pdf') {
      return toast.error('PDF만 업로드 가능합니다!');
    }

    dispatch(openBoardForm({ file }));
  };

  /** 2023/09/25 - 보드 생성 모달 열기 이벤트 핸들러 ( 버블링 ) - by 1-blue */
  const onOpenModalByBubbling: React.MouseEventHandler<HTMLElement> = e => {
    if (!(e.target instanceof SVGElement || e.target instanceof HTMLElement)) return;

    const { category, targetIdx } = e.target.dataset;

    if (category) {
      dispatch(openBoardForm({ category }));
    }
    if (targetIdx) {
      dispatch(openBoardDetail({ targetIdx: +targetIdx }));
    }
  };

  /** 2023/10/04 - 보드 드래그 완료 후 실행할 함수 - by 1-blue */
  const onDragEndExcute = ({
    targetIdx,
    category,
    order,
  }: {
    targetIdx: number;
    category: string;
    order: number;
  }) => {
    boardsMutate({ idx: targetIdx, category, order });
    apiMoveBoard({ idx: targetIdx, category, order }).then(() => mutate('/board'));
  };

  if (error) {
    return <Custom500 />;
  }

  return (
    <article style={{ padding: '2em' }} onClick={onOpenModalByBubbling}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1em' }}>
        Openknowl - 프론트엔드 과제 ( 칸반보드 )
      </h1>

      <Dropzone onDropExcute={onDropExcute}>
        <BoardFilter />

        {isLoading || !boardsGroup || !categories ? (
          <Skeleton.BoardGroup />
        ) : (
          <Board.Container onDragEndExcute={onDragEndExcute}>
            {boardsGroup.map((boards, index) => (
              <Board.Dropzone
                key={categories[index].category}
                droppableId={categories[index].category}
                category={categories[index].category}
              >
                {boards.map(({ idx, order, ...restProps }) => (
                  <Board.Dragzone
                    key={idx}
                    draggableId={idx + ''}
                    index={order}
                    idx={idx}
                    {...restProps}
                  />
                ))}
              </Board.Dropzone>
            ))}
          </Board.Container>
        )}
      </Dropzone>
    </article>
  );
};

export default Home;
