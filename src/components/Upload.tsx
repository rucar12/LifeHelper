import styles from './Upload.module.scss';
import DeleteSVG from '@/assets/images/delete.svg'
import Image from "next/image";

const Upload = ({onClick, onDrop, onClear, name}) => {

    return (
        <div
            className={styles.upload}
            onClick={onClick}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
        >
            <div className={styles.general_info}>
                <p>{name ?? 'Upload file'}</p>
                {name && <button onClick={onClear}>
                    <Image src={DeleteSVG} alt={'delete'}/>
                </button>}
            </div>
            {!name && <p className={styles.helper}>Format: .xlsx</p>}
        </div>
    );
};

export default Upload;