import styles from './Button.module.scss';
import classNames from "classnames";
import {ReactNode} from "react";
import Loader from "@/components/Loader";
import {useSnapshot} from "valtio";
import {state} from "@/store";

type iProps = {
    className?: string,
    onClick: () => void,
    isLoading?: boolean,
    children: ReactNode
}

const Button = ({className, onClick, children, isLoading}:iProps) => {

    const {theme} = useSnapshot(state);

    return (
        <button
            className={classNames(styles.button, className, {
                [styles.dark]: theme === 'dark'
            })}
            onClick={onClick}
        >
            {isLoading ? <Loader /> : children}
        </button>
    )
}

export default Button;