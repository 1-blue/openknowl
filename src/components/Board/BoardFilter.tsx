import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { buildQueryString } from '@/utils/helper';

import useFetchPlatforms from '@/hooks/useFetchPlatformsOfBoard';
import useFetchTagsOfBoard from '@/hooks/useFetchTagsOfBoard';

import Combobox from '@/components/common/Combobox';
import Skeleton from '@/components/common/Skeleton';

import type { Props as ReactSelectProps } from 'react-select';
import type { SelectOption } from '@/types';

const StyledBoardFilter = styled.div`
  display: flex;
  margin-bottom: 1em;

  & > * + * {
    margin-left: 1em;
  }

  & .board-platform-filter {
    width: 120px;
  }
  & .board-tag-filter {
    width: 320px;
  }
`;

/** 2023/09/27 - Board Filter Component - by 1-blue */
const BoardFilter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const { platforms, isLoading: platformsLoading } = useFetchPlatforms();
  const { tags, isLoading: tagsLoading } = useFetchTagsOfBoard();

  /** 2023/09/27 - 플랫폼 필터링 - by 1-blue */
  const onSelectPlatform: ReactSelectProps<SelectOption>['onChange'] = selected => {
    if (!selected) return;
    if (selected instanceof Array) return;

    const path = buildQueryString(router.pathname, {
      platform: selected.value === '선택안함' ? null : selected.value,
      ...(tag && { tag }),
    });

    router.push(path);
  };
  /** 2023/09/27 - 태그 필터링 - by 1-blue */
  const onSelectTag: ReactSelectProps<SelectOption>['onChange'] = selected => {
    if (!selected) return;
    if (!(selected instanceof Array)) return;

    const path = buildQueryString(router.pathname, {
      tag: selected.map(({ value }) => value).join(','),
      ...(platform && { platform }),
    });

    router.push(path);
  };

  if (platformsLoading || !platforms || tagsLoading || !tags) {
    return <Skeleton.BoardFilter />;
  }

  return (
    <StyledBoardFilter>
      <Combobox
        id="플랫폼 필터링"
        defaultValue={[{ label: platform || '선택안함', value: platform || '선택안함' }]}
        options={[{ idx: -1, platform: '선택안함' }, ...platforms].map(({ platform }) => ({
          label: platform,
          value: platform,
        }))}
        onChange={onSelectPlatform}
        className="board-platform-filter"
      />
      <Combobox
        isMulti
        id="태그 필터링"
        defaultValue={tag?.split(',').map(tag => ({ label: tag, value: tag }))}
        options={tags.map(({ tag }) => ({
          label: tag,
          value: tag,
        }))}
        onChange={onSelectTag}
        className="board-tag-filter"
        placeholder="태그들을 선택해주세요!"
      />
    </StyledBoardFilter>
  );
};

export default BoardFilter;
