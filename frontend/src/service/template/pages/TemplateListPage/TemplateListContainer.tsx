import { Link } from 'react-router-dom';

import { GetTemplatesResponse } from 'service/@shared/types/template';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Text } from 'common/components';

import { PAGE_LIST } from 'service/@shared/constants';

interface Props {
  templates: GetTemplatesResponse;
}

const TemplateListContainer = ({ templates }: Props) => {
  return (
    <div>
      {templates.map(
        ({ templateId, templateTitle, templateDescription, updatedAt, usedCount, creator }) => (
          <div key={templateId}>
            <Link to={`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`}>
              <div>
                <Text>{templateTitle}</Text>
                <Text>{templateDescription}</Text>
                <Text>{getElapsedTimeText(updatedAt)}</Text>
                <Text>{`${usedCount}회 사용됨`}</Text>
                <div
                  style={{
                    backgroundImage: `url(${creator.profileUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '30px',
                    width: '30px',
                  }}
                ></div>
                <Text>{`by ${creator.nickname}`}</Text>
              </div>
            </Link>
          </div>
        ),
      )}
    </div>
  );
};

export default TemplateListContainer;
