'use client'

export default function InteractiveCard({children} : {children:React.ReactNode}) {

    return(
        <div className="w-full h-[300px] rounded-lg shadow-lg bg-white transition-all duration-300 hover:shadow-2xl hover:bg-neutral-200" >
            {children}
        </div>
    );
}