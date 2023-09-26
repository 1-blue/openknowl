import { toast } from 'react-toastify';

import useFetchBoards from '@/hooks/useFetchBoards';

import { useAppDispatch } from '@/store';
import { openBoardForm } from '@/store/slices/board';

import Custom500 from '@/pages/500';
import Board from '@/components/common/Board';
import Skeleton from '@/components/common/Skeleton';
import Dropzone from '@/components/common/Dropzone';
import useFetchCategories from '@/hooks/useFetchCategoriesOfBoard';

/** 2023/09/18 - 메인 페이지 - by 1-blue */
const Home = () => {
  const dispatch = useAppDispatch();
  const { boardsGroup, isLoading, error } = useFetchBoards();
  const { categories } = useFetchCategories();

  const onDropExcute = (file: File) => {
    if (file.type !== 'application/pdf') {
      return toast.error('PDF만 업로드 가능합니다!');
    }

    dispatch(openBoardForm({ file }));
  };

  if (error) {
    return <Custom500 />;
  }
  if (isLoading || !boardsGroup || !categories) {
    return <Skeleton.BoardGroup />;
  }

  return (
    <Dropzone onDropExcute={onDropExcute}>
      <article style={{ padding: '2em' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1em' }}>
          Openknowl - 프론트엔드 과제 ( 칸반보드 )
        </h1>

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
      </article>
    </Dropzone>
  );
};

export default Home;
