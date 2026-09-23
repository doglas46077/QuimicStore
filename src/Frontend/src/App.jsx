import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";
import { Routes, Route } from "react-router-dom";
import SectionCarrinho from "./components/PrincipalCarrinho";
import SectionPerfil from "./components/SectionPerfil";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
       <Layers/>

       <SectionCatalogo/>
       
       <SectionPerfil/>

       
       <SectionPedidoStatus/>

       

       <Routes>
        <Route path="/" element={<SectionCadastro />} />
      <Route path="/login" element={ <LoginCard/>}/>
        </Routes>

        <SectionCarrinho />

       

        </div>
    </>
  )
}



export default App