import Image from "next/image";
export default function Banner({text1, text2} : {text1:string, text2:string}) {
    return(
        <div className="block p-1 w-screen h-[700px] relative">
            <Image src='/Banner/Banner1.jpg' alt='Banner' fill={true} objectFit='cover'/>
            <div className={"relative top-[250px] z-20 text-center"}>
                <h1 className='text-6xl font-bold'>{text1}</h1>
                <h3 className='text-3xl font-medium'>{text2}</h3>
            </div>
        </div>
    );
}
