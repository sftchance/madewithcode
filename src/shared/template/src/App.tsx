import { Routes, Route } from 'react-router-dom'

import { Sandbox } from './pages/Sandbox'

import './App.css'

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Sandbox />} />
                <Route path="/:id/" element={<Sandbox />} />

                {/* <Route path="/studio" element={<Studio />} /> */}
                {/* <Route path="/studio/:id/" element={<Studio />} /> */}
                {/* <Route path="/timelapse/" element={<Timelapse />} /> */}
                {/* <Route path="/timelapse/:id/" element={<Timelapse />} /> */}
            </Routes>
        </>
    )
}

export default App
