import { CartLarge5 } from 'reicon-react';
import { User } from 'reicon-react';

export default function HeaderCatalogo() {
    return(
        <div className='flex bg-green-950'>
            <img src="logo.png" alt="" />
            <div className="flex gap-9 border-r-9 border-green-950 items-center">
                <p className="flex justify-center text-center">Olá, usuario</p>
                <div className="flex gap-4 items-center">
                    <CartLarge5 size={34} />
                    <div className="flex justify-center bg-green-200 rounded-full w-10 h-10 items-center text-black">
                        <User size={30} />
                    </div>
                </div>
            </div>
        </div>
    )
}