import styles from './Input.module.scss';
import classNames from "classnames";

type iProps = {
    value: string | number;
    setValue: (value: any) => void,
    placeholder: string,
    className?: string,
    type?: string,
    min?: number,
    disabled?: boolean,
}

const Input = ({placeholder, value, setValue, className, min, disabled, type = 'text'}: iProps) => {

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
                min={min}
                type={type}
                value={value}
                placeholder={placeholder}
                name={'apiKey'}
                disabled={disabled}
                onChange={event => {
                    if (type === 'number') {
                        if (event.target.value === '' || /^\d+$/.test(event.target.value)) {
                            setValue(parseInt(event.target.value, 10));
                        }
                    } else if (type !== 'number') {
                        setValue(event.target.value);
                    }
                }}
            />
        </div>
    )
}

export default Input;