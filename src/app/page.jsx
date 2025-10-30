import Image from 'next/image'

export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
 
      <div className="basis-full flex flex-col justify-center md:basis-2/3">
        <p className="text-green-400 text-s font-bold">
          Discover history, one monument daily.
        </p>
        <h1 className="pb-5">
          Discover the <span className="text-green-500">Wonders</span> of History
        </h1>
        <p className="md:text-lg">
          History is more than dates and kings — it lives in the monuments that
          stand tall today. Dive into our collection of blogs and uncover the
          art, architecture, and heritage of iconic sites.
        </p>
      </div>

     
      <div className=" hidden lg:block basis-1/3 pt-5">
        <div className="rounded-2xl overflow-hidden">
          <Image
            src="/Eiffel_Tower.jpg"
            alt="Eiffel Tower"
            width={500}
            height={500}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}

