import styles from './Input.module.scss';
import classNames from "classnames";

type iProps = {
    value: string | number;
    setValue: (value: string) => void,
    placeholder: string,
    className?: string,
}

const Input = ({placeholder, value, setValue, className}: iProps) => {

    return (
        <div className={classNames(styles.input, className)}>
            <label
                htmlFor={'apiKey'}
                className={classNames(styles.label, {
                    [styles.invisible]: !value,
                })}>
                {placeholder}
            </label>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                name={'apiKey'}
                onChange={event => setValue(event.target.value)}
            />
        </div>
    )
}

export default Input;