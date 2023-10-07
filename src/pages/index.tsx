import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';
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

import type { ApiMoveCardRequest } from '@/types/apis';

/** 2023/09/18 - 메인 페이지 - by 1-blue */
const Home = () => {
  const { mutate } = useSWRConfig();
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

  /** 2023/10/04 - 보드 드래그 완료 후 실행할 함수 - by 1-blue */
  const onDragEndExecute = (props: ApiMoveCardRequest) => {
    boardsMutate(props);
    apiMoveCard(props).then(() => mutate('/board'));
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
          <DND.Container onDragEndExecute={onDragEndExecute}>
            {boards.map(board => (
              <section key={board.category!.category} className="dnd-wrapper">
                <BoardHeader category={board.category!.category} />

                <DND.Dropzone droppableId={board.idx + ''}>
                  {board.cards.map(card => (
                    <DND.Dragzone
                      key={card.idx + ''}
                      draggableId={card.idx + ''}
                      index={card.order}
                    >
                      <Card {...card} />
                    </DND.Dragzone>
                  ))}
                </DND.Dropzone>
              </section>
            ))}

            {/* FIXME: */}
            <BoardCreateButton />
          </DND.Container>
        )}
      </Dropzone>
    </article>
  );
};

export default Home;
