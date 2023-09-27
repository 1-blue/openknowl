import styled from 'styled-components';

import { useAppSelector } from '@/store';

import Header from '@/layouts/Header';
import Nav from '@/layouts/Nav';
import Main from '@/layouts/Main';
import Footer from '@/layouts/Footer';
import Overlay from '@/components/common/Overlay';
import Spinner from '@/components/common/Spinner';
import Modal from '@/components/common/Modal';
import BoardCreateForm from '@/components/Board/BoardCreateForm';
import BoardUpdateForm from '@/components/Board/BoardUpdateForm';
import BoardDetail from '@/components/Board/BoardDetail';

const StyledGeneralLayout = styled.div``;

/** 2023/09/18 - 일반 레이아웃 component - by 1-blue */
const GeneralLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isStartSpinner } = useAppSelector(state => state.spinner);
  const { isShowBoardForm, targetIdx, isShowBoardDetail } = useAppSelector(state => state.board);

  return (
    <StyledGeneralLayout>
      <Header />
      <Nav />
      <Main>{children}</Main>
      <Footer />

      {/* 보드 상세 모달 */}
      {isShowBoardDetail && (
        <Overlay>
          <Modal width="60vw" minWidth="240px" maxWidth="480px">
            <BoardDetail />
          </Modal>
        </Overlay>
      )}

      {/* 보드 생성 & 수정 모달 */}
      {isShowBoardForm && (
        <Overlay>
          <Modal width="60vw" minWidth="480px" maxWidth="768px">
            {targetIdx !== -1 ? <BoardUpdateForm /> : <BoardCreateForm />}
          </Modal>
        </Overlay>
      )}

      {/* 스피너 */}
      {isStartSpinner && (
        <Overlay>
          <Spinner />
        </Overlay>
      )}
    </StyledGeneralLayout>
  );
};

export default GeneralLayout;
