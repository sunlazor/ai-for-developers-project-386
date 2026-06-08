import {Routes, Route} from 'react-router-dom'
import {Layout} from '@/components/Layout'
import {HomePage} from '@/pages/HomePage'
import {BookingPage} from '@/pages/BookingPage'
import {HostPage} from '@/pages/HostPage'

export default function App() {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/book/:slug" element={<BookingPage/>}/>
                <Route path="/host" element={<HostPage/>}/>
            </Route>
        </Routes>
    )
}