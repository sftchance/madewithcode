import CodeMirror from '@uiw/react-codemirror';

import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

import { Sandbox } from "./Sandbox"

import "../styles/Timelapse.scss"

export const Studio: React.FC = () => {
    const { id } = useParams();

    const [step, setStep] = useState(0)
    const [steps, setSteps] = useState([] as {
        duration: number,
        code: () => JSX.Element,
        str: string,
        delay?: number,
    }[])

    const [isPlaying, setIsPlaying] = useState(false);

    const onExport = () => {
        const file = new Blob([steps.map(step => step.code).join('\n\n')], { type: 'text/plain' })

        const a = document.createElement('a')

        a.href = URL.createObjectURL(file)
        a.download = `${id}.tsx`

        a.click()

        URL.revokeObjectURL(a.href)

        a.remove()
    }

    const onChange = (value: any, viewUpdate: any) => {
        console.log(value, viewUpdate)

        setSteps(steps => {
            const newSteps = [...steps]

            newSteps[step].code = value

            return newSteps
        })
    }

    useEffect(() => {
        import(`../inputs/${id}.tsx`)
            .then((module) => {
                setSteps(module.default)
            })
            .catch((error) => {
                console.error(`Error importing file: ${error}`);
            });

        // By importing we are getting the jsx version back, which we do need. However, we also need the plain text version for the editor.
        // So we need to import the file again, but this time as plain text.
        // open file as plain text
    }, [id]);

    return <div className='timelapse studio'>
        <div className="preview">
            <p className="header">
                Preview ({id || 'untitled'}.tsx)

                <span>
                    <button onClick={onExport}>
                        ⬇️
                    </button>

                    <button onClick={() => { }}>
                        💾
                    </button>
                </span>
            </p>

            <div className="content">
                <Sandbox code={steps[step]?.code} />
            </div>
        </div>

        <div className="timeline">
            <div className="controls">
                <button
                    className="beginning"
                    onClick={() => setStep(0)}
                    disabled={step === 0}
                >
                    {`<<`}
                </button>

                <button
                    className="previous"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 0}
                >
                    {`<`}
                </button>

                <button className="controller" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? '⏸︎' : '▶️'}
                </button>

                <button
                    className="next"
                    onClick={() => setStep(step + 1)}
                    disabled={step === steps.length - 1}
                >
                    {`>`}
                </button>

                <button
                    className="end"
                    onClick={() => setStep(steps.length - 1)}
                    disabled={step === steps.length - 1}
                >
                    {`>>`}
                </button>
            </div>

            <div className="thread">
                <p>{1 + step}</p>

                <div className="steps">
                    {steps.map((_, index) => {
                        return <div
                            key={index}
                            className="step"
                            onClick={() => setStep(index)}
                        />
                    })}
                </div>
            </div>

            <div className="air">
                <button onClick={() => {
                    const newSteps = [...steps]

                    newSteps.splice(step + 1, 0, {
                        duration: 0,
                        delay: 15,
                        code: steps[step].code,
                        str: steps[step].str
                    })

                    setSteps(newSteps)

                    setStep(step + 1)
                }}>
                    {`➕`}
                </button>

                <button
                    disabled={step === 0}
                    onClick={() => {
                        // Remove the current step
                        const newSteps = [...steps]

                        newSteps.splice(step, 1)

                        setSteps(newSteps)

                        setStep(step - 1)

                        if (step === 0) {
                            setStep(0)
                        }

                        if (step === steps.length) {
                            setStep(steps.length - 1)
                        }
                    }}>
                    {`🗑️`}
                </button>
            </div>
        </div>

        <div className="editor">
            <p className="header">Editor</p>

            <div className="content">
                {steps.map((stepped, index) => {
                    return <CodeMirror
                        key={index}
                        theme={okaidia}
                        value={stepped?.code.toString() || ""}
                        extensions={[javascript({ jsx: true })]}
                        onChange={onChange}
                        style={{
                            display: index === step ? 'block' : 'none'
                        }}
                    />
                })}
            </div>
        </div>
    </div >
}