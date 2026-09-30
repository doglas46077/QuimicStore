import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";
import { Routes, Route } from "react-router-dom";
import SectionCarrinho from "./components/PrincipalCarrinho";
import SectionPerfil from "./components/SectionPerfil";
import SectionStatus from "./components/SectionStatus";
import SectionPedidoDetalhes from "./components/SectionPedidoDetalhes";


function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">

       <Routes>
        <Route path="/" element={<SectionCadastro />} />
      <Route path="/login" element={ <LoginCard/>}/>
      <Route path="/catalogo" element={<SectionCatalogo/>}/>

      <Route path="/carrinho" element={<SectionCarrinho/>}/>
      <Route path="/pedidos" element={<SectionPedidoStatus/>}/>

      <Route path="/perfil" element={<SectionPerfil/>}/>

      <Route path="/pedidoDetalhe" element={<SectionPedidoDetalhes/>}/>
      <Route path="/pedidoStatus" element={<SectionPedidoStatus/>}/>
        </Routes>
        </div>
    </>
  )
}



export default App