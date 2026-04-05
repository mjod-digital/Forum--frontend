import styles from './Ready.module.scss';
import classNames from 'classnames';

interface ReadyProps {
    onOpen?: () => void;
}

function Ready({ onOpen }: ReadyProps) {
  return <section className={styles.root}>
    <div className={styles.content}>
        <div className={styles.text}>
            <h2 className={classNames(styles.title, 'title-b')}>ПРЕЗЕНТАЦИЯ <span>ГОТОВОГО</span> ПРОЕКта</h2>
            <p className={classNames(styles.paragraph, 'paragraph')}>Избранные лоты в вашей подборке</p>
            <button className={styles.btn} onClick={onOpen}>скачать презентацию</button>
        </div>
    </div>
  </section>;
}

export default Ready;
