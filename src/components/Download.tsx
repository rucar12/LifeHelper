import styles from './Download.module.scss';
import React from "react";
import classNames from "classnames";

type iProp = {
    className?: string,
    onClick: () => void,
}

const Download = ({onClick, className}: iProp) => {

    return (
        <div
            className={classNames(styles.downloadFile, className)}
            onClick={onClick}
            title={'Download doc file'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5M7 10L12 15 17 10M12 15V3"/>
            </svg>
        </div>
    )
}

export default Download;