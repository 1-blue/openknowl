import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

import useFetchBoards from '@/hooks/useFetchBoards';

import { useAppDispatch } from '@/store';
import { openBoardForm, openBoardDetail } from '@/store/slices/board';

import Custom500 from '@/pages/500';
import Board from '@/components/common/Board';
import Skeleton from '@/components/common/Skeleton';
import Dropzone from '@/components/common/Dropzone';
import useFetchCategories from '@/hooks/useFetchCategoriesOfBoard';
import BoardFilter from '@/components/Board/BoardFilter';

/** 2023/09/18 - 메인 페이지 - by 1-blue */
const Home = () => {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const dispatch = useAppDispatch();
  const { boardsGroup, isLoading, error } = useFetchBoards({ platform, tag });
  const { categories } = useFetchCategories();

  const onDropExcute = (file: File) => {
    if (file.type !== 'application/pdf') {
      return toast.error('PDF만 업로드 가능합니다!');
    }

    dispatch(openBoardForm({ file }));
  };

  /** 2023/09/25 - 보드 생성 모달 열기 이벤트 핸들러 ( 버블링 ) - by 1-blue */
  const onOpenModalByBubbling: React.MouseEventHandler<HTMLElement> = e => {
    if (!(e.target instanceof SVGElement)) return;

    const { category, targetIdx } = e.target.dataset;

    if (category) {
      dispatch(openBoardForm({ category }));
    }
    if (targetIdx) {
      dispatch(openBoardDetail({ targetIdx: +targetIdx }));
    }
  };

  if (error) {
    return <Custom500 />;
  }
  if (isLoading || !boardsGroup || !categories) {
    return <Skeleton.BoardGroup />;
  }

  return (
    <article style={{ padding: '2em' }} onClick={onOpenModalByBubbling}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1em' }}>
        Openknowl - 프론트엔드 과제 ( 칸반보드 )
      </h1>

      <Dropzone onDropExcute={onDropExcute}>
        <BoardFilter />

        <Board.Container>
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
      </Dropzone>
    </article>
  );
};

export default Home;
