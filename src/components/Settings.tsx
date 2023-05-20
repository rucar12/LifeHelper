'use client'

import styles from './Settings.module.scss';
import Button from "@/components/Button";
import {useState} from "react";
import {state} from "@/store";
import Toggle from "@/components/Toggle";
import {useSnapshot} from "valtio";
import Input from "@/components/Input";

const Settings = () => {

    const store = useSnapshot(state);

    const [findAutomatic, setFindAutomatic] = useState<boolean>(store.findAutomatic ?? false);
    const [timesContinue, setTimesContinue] = useState<number>(store.timesContinue ?? 0);
    const [findWithExample, setFindWithExample] = useState<boolean>(store.findWithExample ?? false);

    const clearFiltersHandler = () => {
        setFindAutomatic(false);
        setFindWithExample(false);
        setTimesContinue(0);

        state.findAutomatic = false;
        state.timesContinue = 0;
        state.findWithExample = false;
    }

    const saveFiltersHandler = () => {
        state.findAutomatic = findAutomatic;
        state.timesContinue = timesContinue;
        state.findWithExample = findWithExample;
    }
    
    return (
        <section className={styles.settings}>
            <div className={styles.categories}>
                <div className={styles.automaticFind}>
                    <p>Find answers automatic</p>
                    <Toggle status={findAutomatic} onClick={() => setFindAutomatic(prevState => !prevState)}/>
                </div>
                <div className={styles.continue}>
                    <p>Continue after found answer:</p>
                    <Input
                        className={styles.timesContinue}
                        type="number"
                        disabled={findWithExample}
                        min={0}
                        setValue={setTimesContinue}
                        value={timesContinue}
                        placeholder={'Repeats'}
                    />
                </div>
                <div className={styles.example}>
                    <p>Find answer with example</p>
                    <Toggle
                        status={findWithExample}
                        onClick={() => {
                            setTimesContinue(0);
                            return setFindWithExample(prevState => !prevState)
                        }}
                        disabled={!!timesContinue}
                    />
                </div>
            </div>
            <div className={styles.buttons}>
                <Button onClick={clearFiltersHandler} className={styles.button}>Clear</Button>
                <Button onClick={saveFiltersHandler} className={styles.button}>Save</Button>
            </div>
        </section>
    )
}

export default Settings;