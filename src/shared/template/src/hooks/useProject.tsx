import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_LENGTH = 10;

type Project = {
    name: string;
    description: string;
    steps: {
        duration?: number;
        code?: string;
    }[];
}

const PROJECTS: Project[] = [{
    name: '⚪ Halftone Images with Web Shaders',
    description: 'Turn any image into its halftone visualization using simple WebGL shaders with scroll-animation using Framer.',
    steps: [{
        duration: 1,
        code: `(props)=>{
    const { useState } = React;
    const [counter, setCounter] = useState(0);
    
    const increase = () => {
        setCounter(counter + 1);
    };
    
    return (<>
        <h1>Hello world</h1>
    </>);
}`
    }, {
        duration: 11,
        code: `(props)=>{
    const {useState}=React;
    const [counter,setCounter]=useState(0);
    
    const increase=()=>{
        setCounter(counter+1);
    };
    
    return (<>
        <h1>Good night</h1>
    </>);
}`
    }]
}, {
    name: 'Solidity: For Loops',
    description: 'This is the second project and we use it to lay out the foundation of ⚪ madewithcode.',
    steps: [{
        duration: 11
    }]
}]

const useProject = (id: string | undefined) => {
    const project = useMemo(() => {
        if (!id && PROJECTS.length === 0)
            return;

        if (!id && PROJECTS.length === 1)
            return PROJECTS[0];

        return PROJECTS.find(project => project.name === id);
    }, [id]);

    return project;
}

const useProjects: (props: {
    id?: string;
    pageLength?: number;
}) => {
    projects: Project[];
    project?: Project;
    count: number;
    page: number;
    hasNext: boolean;
    move: (size: number) => void;
} = ({ id, pageLength = PAGE_LENGTH }) => {
    const project = useProject(id);

    const [page, setPage] = useState(1);

    const projects = useMemo(() => {
        return PROJECTS.slice((page - 1) * pageLength, page * pageLength)
    }, [page]);

    const count = project
        ? project.steps.length
        : PROJECTS.length;

    const hasNext = page < Math.ceil(count / pageLength);

    const onMove = useCallback((size: number) => {
        setPage(size);
    }, [page]);

    useEffect(() => {
        if (id) setPage(1);
    }, [id])

    return {
        projects,
        project,
        count,
        page,
        hasNext,
        move: (size: number = 1) => onMove(page + size),
    }
}

export { useProject, useProjects };