'use client'

import React, {ChangeEvent, useEffect, useRef, useState} from "react";

import Accordion from "@/components/Accordion";

import styles from './HomePage.module.scss';
import Upload from "@/components/Upload";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Download from "@/components/Download";
//@ts-ignore
import FileDownload from 'react-file-download';
import mammoth from 'mammoth';
import {useSnapshot} from "valtio";
import {state} from "@/store";
import {getMessages} from "@/api";
import {formatTime} from "@/helpers";

export type iQuestion = {
    question: string,
    answer: string,
}

const HomePage: React.FC = () => {

    const {timesContinue, findAutomatic, findWithExample} = useSnapshot(state);

    const timerRef = useRef(0);

    const [questions, setQuestions] = useState<[iQuestion] | null>(null);
    const [file, setFile] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [allDisabled, setAllDisabled] = useState<boolean>(false);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const uploadFileHandler = (event: ChangeEvent<HTMLInputElement | HTMLDivElement>) => {
        event.preventDefault();
        const inputElement = event.target as HTMLInputElement;
        const divElement = event as any;
        if ((inputElement.files && inputElement.files.length) || divElement.dataTransfer?.files) {
            setQuestions(null);
            //@ts-ignore
            const file = divElement?.dataTransfer?.files[0] ?? inputElement?.files[0];
            setFile(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target?.result as string;
                const XLSX = require('xlsx');
                const workbook = XLSX.read(fileContent, {type: 'binary'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                const flatData = data
                    .flatMap((question: []) => question)
                    .map((question: string) => (
                        {
                            question,
                            answer: ''
                        }));
                //@ts-ignore
                setQuestions((prevState: iQuestion[] | null) => [...(prevState || []), ...flatData]);
            };
            reader.readAsBinaryString(file);
        }
    }

    const downloadWordDocument = () => {
        const questionsForDownload = questions?.filter((question: iQuestion) => !!question.answer);
        const question = `<p><strong>Question:</strong></p>`;
        const answer = `<p><strong>Answer:</strong></p>`;
        const docxData = !!questionsForDownload && questionsForDownload.map(item => `\n${question} \n\n ${item.question}. \n ${answer} \n ${item.answer} \n`);

        try {
            FileDownload(docxData, `Answers_${new Date().toLocaleString()}.docx`);
        } catch (error) {
            console.error('Помилка при створенні документа:', error);
        }
    }

    const startAutoFind = async () => {
        setAllDisabled(true);
        //@ts-ignore
        for (let i = 0; i < questions?.length; i++) {
            if (allDisabled) {
                break;
            }
            //@ts-ignore
            const { question } = !!questions[i];
            let apiMessages = { role: 'user', content: question };
            let apiRequestBody = {
                model: 'gpt-3.5-turbo',
                messages: [apiMessages],
            };

            try {
                await new Promise((resolve) => setTimeout(resolve, 10000));
                const data = await getMessages(apiRequestBody, API_KEY());
                //@ts-ignore
                setQuestions((prev) =>
                    prev?.map((item) =>
                        item.question === question ? { question, answer: data } : item
                    )
                );

                if (timesContinue) {
                    apiMessages = {
                        ...apiMessages,
                        content: `Continue answer for ${question}`,
                    };

                    for (let j = 0; j < timesContinue; j++) {
                        await new Promise((resolve) => setTimeout(resolve, 15000));

                        const continueData = await getMessages(apiRequestBody, API_KEY());
                        //@ts-ignore
                        setQuestions((prev) =>
                            prev?.map((item) =>
                                item.question === question
                                    ? { question, answer: item.answer + '\n' + continueData }
                                    : item
                            )
                        );
                    }
                } else if (findWithExample) {
                    apiMessages = {
                        ...apiMessages,
                        content: `Show example pls for ${question}`,
                    };

                    await new Promise((resolve) => setTimeout(resolve, 15000));

                    const exampleData = await getMessages(apiRequestBody, API_KEY());
                    //@ts-ignore
                    setQuestions((prev) =>
                        prev?.map((item) =>
                            item.question === question
                                ? { question, answer: item.answer + '\n' + exampleData }
                                : item
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (questions?.length !== undefined && i === questions?.length - 1) {
                    setAllDisabled(false);
                }
            }
        }
    };

    const stopAutoFind = () => {
      setAllDisabled(false);
    }

    const hasAnswerInEveryObject = questions?.every(item => !!item.answer);
    const hasFilledAnswer = questions?.some(item => !!item.answer);

    const approximateTime = formatTime(30 * (questions?.length !== undefined ? questions?.length : 0) * (timesContinue + 1 + Number(findWithExample)));

    const clearHandler = () => {
        setFile(null);
        setQuestions(null);
    }

    const saveApi = () => {
        if (apiKey) {
            localStorage.setItem('token', apiKey);
            setApiKey('');
        } else {
            //Todo validation
        }
    }

    const API_KEY = () => localStorage.getItem('token');

    return (
        <section className={styles.home}>
            <div className={styles.apiContainer}>
                <Input value={apiKey} setValue={setApiKey} placeholder={'Write your api key'}
                       className={styles.apiInput}/>
                <Button onClick={saveApi} className={styles.saveBtn}>Save</Button>
            </div>
            <p className={styles.linkToGenApi}>
                Open &nbsp;
                <a target="_blank" href={'https://platform.openai.com/account/api-keys'} rel={'noreferrer'}>
                    this link
                </a>
                &nbsp; to generate api key
            </p>
            <Upload
                onClick={() => {
                    if (!file) {
                        inputRef.current?.click();
                    }
                }}
                onDrop={uploadFileHandler}
                name={file}
                onClear={clearHandler}
            />
            <input
                ref={inputRef}
                onChange={uploadFileHandler}
                type={'file'}
                accept={'.xlsx'}
                className={styles.inputUpload}
            />
            {findAutomatic && questions?.length && (
                <div className={styles.autoFind}>
                    {!allDisabled
                        ? <div>
                            <Button
                                onClick={startAutoFind}
                                disabled={hasAnswerInEveryObject || !API_KEY()}
                                title={hasAnswerInEveryObject ? 'All questions have answers' : ''}
                                className={styles.autoStart}
                            >
                                Start auto find
                            </Button>
                            <p>Time: {formatTime(timerRef?.current)}</p>
                            <p>Approximate waiting time: {approximateTime}</p>
                        </div>
                        : <div>
                            <Button onClick={stopAutoFind}>Stop auto find</Button>
                            <p>Time: {formatTime(timerRef?.current)}</p>
                        </div>
                    }
                </div>
            )}
            <div className={!!questions?.length ? styles.questions : styles.not_found}>
                {!!questions?.length
                    ? <>
                        <h2>Questions list:</h2>
                        {questions.map(({question, answer}) => {
                            return <Accordion
                                key={question}
                                question={question}
                                disabled={(!API_KEY()) || allDisabled}
                                apiKey={API_KEY()}
                                answer={answer}
                                setQuestions={setQuestions}
                            />
                        })}
                    </>
                    : 'Not found questions. Please upload file!'
                }
            </div>
            {hasFilledAnswer && <Download onClick={downloadWordDocument}/>}
        </section>
    );
};

export default HomePage;