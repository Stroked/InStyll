import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
//import { fetchDataFromApi } from "@/utils/api";

export default function Home() {
    return (
        <main>
            <HeroBanner />
            <Wrapper>
                {/* heading and paragaph start */}
                <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
                    <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
                        Styllar Test Website 
                    </div>
                    <div className="text-md md:text-xl">
                        This is shopping, refined.

                        From then on, every piece is precision-matched to you — sleeves aligned, shoulders balanced, proportions exact. No size guessing. No compromises.

                        Just clothing engineered to fit — beautifully.
                    </div>
                    <div className="text-md md:text-xl">
                        This is shopping, refined.

                        Every piece is precision-matched to you — sleeves aligned, shoulders balanced, proportions exact. No size guessing. No compromises. <b>
                           Just clothing engineered to fit — beautifully. </b>
                    </div>
                </div>
                {/* heading and paragaph end */}               
                 {/* products grid start */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                   
                </div>
                {/* products grid end */}
            </Wrapper>

        </main>
    );
}
