import Comunicados from "./components/Comunicados"
import Banner from "./components/Banner"
import Sidebar from "./components/Sidebar"
import Cardslinks from "./components/Cardslink"
import Cards from "./components/cards";
import Header from "./components/header";
import Botoes from "./components/botoes";
import "./styles.css";
import { useState } from 'react'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'

function App() {
    return (
        <>
        <div className="bg-zinc-900 h-screen">
        <div className="bg-amber-600 ">

function App(){
    return(
        <div className="flex bg-white">
<Sidebar/>

<main className="relative flex-1 p-6">
    <Banner/>
    <Cardslinks/>
    <Comunicados/>
</main>
        </div>
    )
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='bg-olive-100 font-bold'>
      <Header></Header>
      <Section></Section>
      <Footer></Footer>
    </div>
    </>
  )
}



export default App
