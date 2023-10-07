import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { buildQueryString } from '@/utils/helper';

import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchTagsOfCard from '@/hooks/useFetchTagsOfCard';

import Form from '@/components/common/Form';
import Skeleton from '@/components/common/Skeleton';

import type { Props as ReactSelectProps } from 'react-select';
import type { SelectOption } from '@/types';

const StyledCardFilter = styled.div`
  display: flex;
  margin-bottom: 1em;

  & > * + * {
    margin-left: 1em;
  }

  & .card-platform-filter {
    width: 120px;
  }
  & .card-tag-filter {
    width: 320px;
  }
`;

/** 2023/09/27 - Card Filter Component - by 1-blue */
const CardFilter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const tag = searchParams.get('tag');

  const { platforms, isLoading: platformsLoading } = useFetchPlatforms();
  const { tags, isLoading: tagsLoading } = useFetchTagsOfCard();

  /** 2023/09/27 - 플랫폼 필터링 - by 1-blue */
  const onSelectPlatform: ReactSelectProps<SelectOption>['onChange'] = selected => {
    if (!selected) return;
    if (selected instanceof Array) return;

    const path = buildQueryString(router.pathname, {
      platform: selected.value === '선택안함' ? null : selected.value,
      ...(tag && { tag }),
    });

    router.replace(path);
  };
  /** 2023/09/27 - 태그 필터링 - by 1-blue */
  const onSelectTag: ReactSelectProps<SelectOption>['onChange'] = selected => {
    if (!selected) return;
    if (!(selected instanceof Array)) return;

    const path = buildQueryString(router.pathname, {
      tag: selected.map(({ value }) => value).join(','),
      ...(platform && { platform }),
    });

    router.replace(path);
  };

  if (platformsLoading || !platforms || tagsLoading || !tags) {
    return <Skeleton.BoardFilter />;
  }

  return (
    <StyledCardFilter>
      <Form.Combobox
        id="플랫폼 필터링"
        value={[{ label: platform || '선택안함', value: platform || '선택안함' }]}
        defaultValue={[{ label: platform || '선택안함', value: platform || '선택안함' }]}
        options={[{ idx: -1, platform: '선택안함' }, ...platforms].map(({ platform }) => ({
          label: platform,
          value: platform,
        }))}
        onChange={onSelectPlatform}
        className="card-platform-filter"
      />
      <Form.Combobox
        isMulti
        id="태그 필터링"
        value={tag?.split(',').map(tag => ({ label: tag, value: tag }))}
        defaultValue={tag?.split(',').map(tag => ({ label: tag, value: tag }))}
        options={tags.map(({ tag }) => ({
          label: tag,
          value: tag,
        }))}
        onChange={onSelectTag}
        className="card-tag-filter"
        placeholder="태그들을 선택해주세요!"
      />
    </StyledCardFilter>
  );
};

export default CardFilter;
