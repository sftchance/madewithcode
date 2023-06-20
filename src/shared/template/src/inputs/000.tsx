export default {
    imports: [
        `import { useState } from "react"`,
    ],
    steps: [{
        duration: 0,
        delay: 15,
        code: `() => {
            return <>
                <button>Good morning, beautiful.</button>
            </>
        }`,
    }, {
        duration: 15,
        code: `() => {
            const [counter, setCounter] = useState(0);

            setTimeout(() => {
                setCounter(counter + 1)
            }, 1000);

            return <>
                <button>Good night, handsome ({counter}).</button>
            </>
        }`,
    }]
} as {
    imports: string[],
    steps: {
        duration: number,
        delay?: number,
        code: string,
    }[]
}