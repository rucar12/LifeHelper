'use client'

import styles from './Accordion.module.scss';
import {useState} from "react";
import classNames from "classnames";
import {getMessages} from "@/api";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import {iQuestion} from './HomePage';
import {state} from "@/store";
import {useSnapshot} from "valtio";

type iProps = {
    question: string,
    apiKey: string | null,
    answer?: string,
    disabled?: boolean,
    setQuestions: (value: [iQuestion] | null) => void,
}


const Accordion = ({question, apiKey, answer, setQuestions, disabled}: iProps) => {

    const {findWithExample, timesContinue} = useSnapshot(state);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSend = async () => {
        if (!disabled) {
            setIsOpen(prevState => !prevState);
            if (!answer) {
                setIsLoading(true);

                let apiMessages = { role: 'user', content: question};

                const apiRequestBody = {
                    "model": "gpt-3.5-turbo",
                    "messages": [apiMessages]
                }

                getMessages(apiRequestBody, apiKey)
                    .then((data: string) => {
                        //@ts-ignore
                        setQuestions((prev: [iQuestion]) => prev.map((item) => item.question === question ? {question, answer: data} : item));
                    })
                    .then(() => {
                        if (findWithExample) {
                            const textExample = `Show example pls for ${question}`;
                            continueHandler(textExample).then(() => setIsLoading(true));
                        } else if (timesContinue) {
                            for (let i = 0; i < timesContinue; i++) {
                                continueHandler().then(() => setIsLoading(true));
                            }
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        }
    };
    const continueHandler = async (textContinue?: string) => {
        let textForContinue = textContinue ?? 'Continue answer for';
        setIsLoading(true);

        let apiMessages = { role: 'user', content: `${textForContinue} ${question}`};
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [apiMessages]
        }

        getMessages(apiRequestBody, apiKey)
            .then((data: string) => {
                //@ts-ignore
                setQuestions((prev: [iQuestion]) => {
                    return prev.map((item) => item.question === question ? {question, answer: item.answer + '\n' + data} : item)
                });
            })
            .catch(() => {
                //setAnswer('Invalid API KEY!')
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const disabledOpenedTitle = !!disabled
        ? 'Connect your api key for operation!'
        : !answer
            ? 'Click for getting answer'
            : 'Click for show/hide answer'

    return (
        <div
            className={styles.accordion}
        >
            <div
                onClick={handleSend}
                title={disabledOpenedTitle}
                className={classNames(styles.question, {
                    [styles.opened]: isOpen,
                    [styles.disabled]: disabled
                })
                }
            >
                <div className={!!answer ? styles.greenPoint : styles.redPoint}/>
                <p>{question}</p>
                <div className={classNames(styles.arrow, {
                    [styles.opened]: isOpen,
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>
            <div className={classNames(styles.answerContainer, {
                [styles.visible]: isOpen
            })}>
                {isLoading && !answer
                    ? <Loader />
                    : <div className={styles.answer}>
                        <pre>{answer}</pre>
                        <Button onClick={continueHandler} isLoading={isLoading} className={styles.continue}>Continue</Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Accordion;