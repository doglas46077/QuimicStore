import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
{/*
       <Layers/>

       <SectionCatalogo/>
       
       
       
       <SectionPedidoStatus/>
       */}
       

       <Routes>
        <Route path="/" element={<SectionCadastro />} />
      <Route path="/login" element={ <LoginCard/>}/>
        </Routes>

        </div>
    </>
  )
}



export default App
