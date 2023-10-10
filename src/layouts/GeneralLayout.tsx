import styled from 'styled-components';

import { useAppSelector } from '@/store';

import Header from '@/layouts/Header';
import Nav from '@/layouts/Nav';
import Main from '@/layouts/Main';
import Footer from '@/layouts/Footer';
import Overlay from '@/components/common/Overlay';
import Spinner from '@/components/common/Spinner';
import Modal from '@/components/common/Modal';
import CardCreateForm from '@/components/Card/CardCreateForm';
import CardUpdateForm from '@/components/Card/CardUpdateForm';
import CardDetail from '@/components/Card/CardDetail';

const StyledGeneralLayout = styled.div``;

/** 2023/09/18 - 일반 레이아웃 component - by 1-blue */
const GeneralLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isStartSpinner } = useAppSelector(state => state.spinner);
  const {
    isOpenCardForm: isShowCardForm,
    updateState: { targetIdx },
    isOpenCardDetail: isShowCardDetail,
  } = useAppSelector(state => state.card);

  return (
    <StyledGeneralLayout>
      <Header />
      <Nav />
      <Main>{children}</Main>
      <Footer />

      {/* 보드 상세 모달 */}
      {isShowCardDetail && (
        <Overlay>
          <Modal width="60vw" minWidth="240px" maxWidth="480px">
            <CardDetail />
          </Modal>
        </Overlay>
      )}

      {/* 보드 생성 & 수정 모달 */}
      {isShowCardForm && (
        <Overlay>
          <Modal width="60vw" minWidth="480px" maxWidth="768px">
            {targetIdx !== -1 ? <CardUpdateForm /> : <CardCreateForm />}
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
