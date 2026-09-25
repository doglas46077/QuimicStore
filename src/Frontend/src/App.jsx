import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import ProductPage from "./components/ProductPage";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
       <Layers/>
       <ProductPage />

       <SectionCatalogo/>
       
       <LoginCard/>
        </div>
    </>
  )
}



export default App
