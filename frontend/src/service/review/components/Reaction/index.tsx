import { Text, Icon } from 'common/components';

import styles from './styles.module.scss';

function Reaction() {
  return (
    <div className={styles.articleFooter}>
      <div className={styles.articleReaction}>
        <Icon code="favorite" type="outlined"></Icon>
        <Text className="likes" size={12} weight="lighter">
          0 Likes
        </Text>
      </div>

      <div className={styles.articleReaction}>
        <Icon code="bookmark" type="outlined"></Icon>
        <Text className="bookmarks" size={12} weight="lighter">
          0 Bookmarks
        </Text>
      </div>
    </div>
  );
}

export default Reaction;
