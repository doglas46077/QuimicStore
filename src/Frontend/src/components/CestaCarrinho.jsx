import { use, useEffect, useRef } from "react"
import {motion} from "motion/react"
import {CartLarge5} from "reicon-react"
import { useCarrinho } from "./JavaScript/carrinhoAnimacao"

export const cesta = {basket: null, ring: null}
function CestaCarrinho({size = 32}) {
    const basktRef = useRef(null)
    const ringRef = useRef(null)
    const {totalItem} = useCarrinho()

    useEffect(() => {
        cesta.basket = basketRef.current
        cesta.ring = ringRef.current
        return() => {
            cesta.basket = null
            cesta.ring = null
        }
    }, [])

    return (
        <>
        <div className="relative inline-flex items-center justify-center" ref={basktRef} style={{width:size, height:size, willChange:"transform"}}>
        <motion.div ref={ringRef} className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400 opacity-0" style={{willChange: "trasform, opacity"}}/>

        <CartLarge5 size={size}/>

        {totalItem > 0 && (
            <span className="absolute -right-2 -top-1.5 min-w-18px rounded-full bg-amber-400 px-1 text-center text-[11px] font-bold leading-18px text-emerald-950">
                {totalItem}
            </span>
        )}
        </div>
        </>
    )
}

export default CestaCarrinho