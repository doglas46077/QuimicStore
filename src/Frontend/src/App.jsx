import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
<<<<<<< HEAD
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";
import { Routes, Route } from "react-router-dom";
import SectionCarrinho from "./components/PrincipalCarrinho";
import SectionPerfil from "./components/SectionPerfil";
import SectionStatus from "./components/SectionStatus";
import SectionPedidoDetalhes from "./components/SectionPedidoDetalhes";
import ProtecaoRotas from "./components/ProtecaoRotas";
import TelaAdm from "./components/TelaAdm";
=======
import Layers from "./components/Layers";
import ProductPage from "./components/ProductPage";
>>>>>>> front/feature/pre-carrinho

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
<<<<<<< HEAD
=======
       <Layers/>
       <ProductPage />
>>>>>>> front/feature/pre-carrinho

       <Routes>
        <Route path="/" element={<SectionCadastro />} />
      <Route path="/login" element={<LoginCard/>}/>
      <Route path="/catalogo" element={<ProtecaoRotas><SectionCatalogo/></ProtecaoRotas>}/>

      <Route path="/carrinho" element={<ProtecaoRotas><SectionCarrinho/></ProtecaoRotas>}/>
      <Route path="/pedidos" element={<ProtecaoRotas><SectionPedidoStatus/></ProtecaoRotas> }/>

      <Route path="/perfil" element={<ProtecaoRotas><SectionPerfil/></ProtecaoRotas> }/>

      <Route path="/pedidoDetalhe" element={<ProtecaoRotas><SectionPedidoDetalhes/></ProtecaoRotas> }/>
      <Route path="/pedidoStatus" element={<ProtecaoRotas><SectionPedidoStatus/></ProtecaoRotas> }/>
      <Route path="/adm" element={<ProtecaoRotas><TelaAdm/></ProtecaoRotas>}/>
        </Routes>
        </div>
    </>
  )
}



export default App