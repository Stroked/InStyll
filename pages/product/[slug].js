import React, { useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import Wrapper from "@/components/Wrapper";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel";
import RelatedProducts from "@/components/RelatedProducts";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = ({ product, products }) => {
    const [selectedSize, setSelectedSize] = useState();
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();
    const p = product?.data?.[0]?.attributes;

    const notify = () => {
        toast.success("Success. Check your cart!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    return (
        <div className="w-full md:py-20">
            <ToastContainer />
            <Wrapper>
                <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
                    {/* left column start */}
                    <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
                        <ProductDetailsCarousel/>
                    </div>
                    {/* left column end */}

                    {/* right column start */}
                    <div className="flex-[1] py-3">
                        {/* PRODUCT TITLE */}
                        <div className="text-[34px] font-semibold mb-2 leading-tight">
                            Sea Landscape Fleece Jacket
                        </div>

                        {/* PRODUCT SUBTITLE */}
                        <div className="text-lg font-semibold mb-5">
                            Burberry
                        </div>

                        {/* PRODUCT PRICE */}
                        <div className="flex items-center">
                            <p className="mr-2 text-lg font-semibold">
                                $200
                            </p>
                            <p className="text-base  font-medium line-through">
                                $160
                            </p>
                            <p className="ml-auto text-base font-medium text-green-500">
                                20% extra
                            </p>

                        </div>

                        <div className="text-md font-medium text-black/[0.5]">
                            excl. taxes
                        </div>
                        <div className="text-md font-medium text-black/[0.5] mb-20">
                            {`(Also includes all applicable duties)`}
                        </div>

                        {/* PRODUCT SIZE RANGE START */}
                        <div className="mb-10">
                            {/* HEADING START */}
                            <div className="flex justify-between mb-2">
                                <div className="text-md font-semibold">
                                    Select Size
                                </div>
                                <div className="text-xs text-black/[0.8] cursor-pointer align-middle">
                                    [INSERT STYLLAR TOOL]
                                </div>
                            </div>
                            {/* HEADING END */}

                            {/* SIZE START */}
                            <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                                <div className="border rounded-md text-center py-3 font-medium hover:border-black cursor-pointer">
                                    XS
                                </div>
                                <div className="border rounded-md text-center py-3 font-medium hover:border-black cursor-pointer">
                                    S
                                </div>
                                <div className="border rounded-md text-center py-3 font-medium hover:border-black cursor-pointer">
                                    M
                                </div>
                                <div className="border rounded-md text-center py-3 font-medium cursor-not-allowed bg-black/[0.1] opacity-50">
                                    L
                                </div>
                                <div className="border rounded-md text-center py-3 font-medium hover:border-black cursor-pointer">
                                    XL
                                </div>
                                <div className="border rounded-md text-center py-3 font-medium cursor-not-allowed bg-black/[0.1] opacity-50">
                                    XXL
                                </div>
                                
                            </div>
                            {/* SIZE END */}
                            {/* SHOW ERROR START */}
                            <div className="text-red-600 mt-1">
                                Size selection is required
                            </div>
                            {/* SHOW ERROR  END */}
                       </div>
                        {/* PRODUCT SIZE RANGE END */}

                        {/* ADD TO CART BUTTON START */}
                        <button
                            className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
                            onClick={() => {
                                if (!selectedSize) {
                                    setShowError(true);
                                    document.getElementById("sizesGrid").scrollIntoView({
                                                                            block: "center",
                                                                            behavior: "smooth",
                                                                        });
                                } else {
                                    dispatch(
                                        addToCart({
                                            ...product?.data?.[0],
                                            selectedSize,
                                            oneQuantityPrice: p.price,
                                        })
                                    );
                                    notify();
                                }
                            }}>
                            Add to Cart 
                        </button>
                        {/* ADD TO CART BUTTON END */}

                        {/* WHISHLIST BUTTON START */}
                        <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
                            Wishlist
                            <IoMdHeartEmpty size={20} />
                        </button>
                        {/* WHISHLIST BUTTON END */}

                        <div>
                            <div className="text-lg font-bold mb-5">
                                Product Details
                            </div>
                            <div className="markdown text-md mb-5">
                                <ReactMarkdown>
                                Sea Landscape Print Fleece by Burberry crafted from wool featuring an oversized silhouette, long sleeves with elastic cuffs, dropped shoulders, a funnel collar with a concealed zipper fastening, a lined interior, a contrasting rubber logo patch on the sleeve and a sea landscape throughout. Style with a crewneck jumper, slacks and lace-up sneakers for a cozy yet trendy cool day out in the city.  </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                    {/* right column end */}
                </div>

                <RelatedProducts/>
            </Wrapper>
        </div>
    );
};

export default ProductDetails;

