import styles from './Toggle.module.scss';
import classNames from "classnames";

type iProps = {
    status: boolean,
    onClick: () => void,
    disabled?: boolean,
}

const Toggle = ({status, onClick, disabled}: iProps) => {

    return (
        <button
            className={classNames(styles.toggle, {
                [styles.active]: status,
                [styles.disabled]: disabled
            })}
            onClick={onClick}
            disabled={disabled}
        >
           <div className={classNames(styles.dot, {
               [styles.active]: status
           })}/>
        </button>
    )
}

export default Toggle;