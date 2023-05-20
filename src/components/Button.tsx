import styles from './Button.module.scss';
import classNames from "classnames";
import {ReactNode} from "react";
import Loader from "@/components/Loader";

type iProps = {
    className?: string,
    onClick: () => void,
    isLoading?: boolean,
    disabled?: boolean,
    title?: string,
    children: ReactNode,
}

const Button = ({className, onClick, children, isLoading, disabled, title = ''}:iProps) => {

    return (
        <button
            className={classNames(styles.button, className)}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {isLoading ? <Loader /> : children}
        </button>
    )
}

export default Button;