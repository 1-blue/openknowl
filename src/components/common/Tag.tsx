import { toast } from 'react-toastify';
import styled from 'styled-components';

const StyledTag = styled.section`
  display: flex;
  flex-flow: column nowrap;

  & .input-label {
    margin-bottom: 0.2em;

    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray600};

    cursor: pointer;
  }
  & .tag-input {
    padding: 0.4em 0.8em;

    border: 0;
    border: 1.5px solid ${({ theme }) => theme.colors.gray600};
    border-radius: 0.3em;
    font-size: 1rem;

    transition: all 0.4s;

    &:focus {
      outline: none;
      border: 1.5px solid ${({ theme }) => theme.colors.main600};
    }
    &::placeholder {
      font-size: ${({ theme }) => theme.fontSize.sm};
    }
  }
  & .tag-container {
    display: flex;
    flex-flow: row wrap;
    gap: 0.4em;
    margin-top: 0.6em;
  }
  & .tag {
    padding: 0.4em;

    border-radius: 0.3em;
    background-color: ${({ theme }) => theme.colors.main400};
    color: #fff;
    font-size: ${({ theme }) => theme.fontSize.sm};

    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.main500};
    }
    &:active {
      background-color: ${({ theme }) => theme.colors.main600};
    }
  }
`;

interface TagProps {
  id: string;
  tags: string[];
  createTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

/** 2023/09/21 - Tag Component - by 1-blue */
const Tag: React.FC<TagProps> = ({ id, tags, createTag, removeTag }) => {
  const onCreateTag: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (!(e.target instanceof HTMLInputElement)) return;
    if (e.key !== 'Enter') return;

    e.stopPropagation();
    e.preventDefault();

    // 태그 수 제한
    if (tags.length >= 10) {
      toast.warning('태그는 최대 10개까지 등록이 가능합니다.');
      return;
    }

    // 태그 글자 수 제한
    if (e.target.value.length >= 10) {
      toast.warning(
        '글자는 최대 10자까지 입력이 가능합니다.' + `( ${e.target.value.length} / 10 )`,
      );
      e.target.select();
      return;
    }

    // "#" 붙이기
    createTag('#' + e.target.value);

    // FIXME: 한글 두 번 등록되는 문제 해결하기
    // 앞에 # 붙이면 제거하기

    // 초기화
    e.target.value = '';
  };

  const onDeleteTagByBubbling: React.MouseEventHandler<HTMLUListElement> = e => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!e.target.dataset.tag) return;

    const { tag } = e.target.dataset;

    toast.success(`"${tag}"를 제거했습니다.`);
    removeTag(tag);
  };

  return (
    <StyledTag>
      <label htmlFor={id} className="input-label">
        {id}
      </label>
      <input type="text" onKeyDown={onCreateTag} className="tag-input" />
      <ul className="tag-container" onClick={onDeleteTagByBubbling}>
        {tags.map(tag => (
          <li key={tag} className="tag" role="button" data-tag={tag}>
            {tag}
          </li>
        ))}
      </ul>
    </StyledTag>
  );
};

export default Tag;
