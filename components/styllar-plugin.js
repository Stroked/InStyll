import React, { useState } from 'react';

const StyllarPlugin = () => {
    // --- 1. REACT STATE MANAGEMENT ---
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const [result, setResult] = useState(null);

    // Form states
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [frontImage, setFrontImage] = useState(null);
    const [sideImage, setSideImage] = useState(null);

    const API_ENDPOINT = "http://136.113.197.77:5000/predict/size-from-chart";

    // --- 2. INTELLIGENCE & SCRAPING (Unchanged logic) ---
    function detectProductCategory() {
        let scoreTop = 0; let scoreBottom = 0;
        const bottomKeywords = ['pant', 'jeans', 'trouser', 'skirt', 'short', 'legging', 'jogger', 'bottom', 'denim', 'cargo'];
        const topKeywords = ['shirt', 'top', 'tee', 'blouse', 'jacket', 'coat', 'hoodie', 'sweater', 'vest', 'cardigan', 'dress', 't-shirt'];
        const textToScan = (document.title + " " + (document.querySelector('h1')?.innerText || "")).toLowerCase();
        bottomKeywords.forEach(word => { if(textToScan.includes(word)) scoreBottom += 2; });
        topKeywords.forEach(word => { if(textToScan.includes(word)) scoreTop += 2; });
        return (scoreBottom > scoreTop) ? 'bottom' : 'top';
    }

    function scanPageForSizeData() {
        const data = { chart_type: 'none', chart_content: null, available_sizes: [] }; 
        const table = document.querySelector('table');
        if (table && /chest|waist|bust|hip|size/i.test(table.innerText)) {
            data.chart_type = 'html_table';
            data.chart_content = table.outerHTML;
            return data;
        }
        const allImages = document.querySelectorAll('img'); 
        for (let img of allImages) {
            const src = img.src.toLowerCase();
            const alt = (img.alt || "").toLowerCase();
            if ((src.includes('size') && src.includes('chart')) || (alt.includes('size') && alt.includes('guide'))) {
                data.chart_type = 'image_url';
                data.chart_content = img.src;
                return data;
            }
        }
        
        const sizeGuideDiv = document.querySelector('.size-guide, #size-chart, .measurement-guide, [class*="SizeGuide"]');
        if (sizeGuideDiv) {
            data.chart_type = 'raw_text';
            data.chart_content = sizeGuideDiv.innerText;
            return data;
        }
        
        const buttons = document.querySelectorAll('button, span, li');
        buttons.forEach(el => {
            const txt = el.innerText.trim();
            if (/^(XS|S|M|L|XL|XXL|[0-9]{2})$/i.test(txt) && txt.length < 4) {
                if (!data.available_sizes.includes(txt)) data.available_sizes.push(txt);
            }
        });
        return data;
    }

    // --- 3. SUBMIT HANDLER ---
    const runBodyScan = async () => {
        if (!frontImage || !sideImage || !height || !weight) {
            alert("Please fill all fields.");
            return;
        }

        setStatus('loading');
        const category = detectProductCategory();
        const pageData = scanPageForSizeData();
        
        const fd = new FormData();
        fd.append('front_image', frontImage);
        fd.append('side_image', sideImage);
        fd.append('height', height);
        fd.append('weight', weight);
        fd.append('product_type', category);
        fd.append('chart_type', pageData.chart_type);
        fd.append('chart_content', pageData.chart_content);
        fd.append('available_sizes', JSON.stringify(pageData.available_sizes));

        try {
            const res = await fetch(API_ENDPOINT, { method: 'POST', body: fd });
            const data = await res.json();
            if(data.error) throw new Error(data.error);

            setResult(data);
            setStatus('success');
        } catch (e) {
            setErrorMsg(e.message);
            setStatus('error');
        }
    };

    // --- 4. REACT JSX UI (Using Tailwind CSS for styling) ---
    return (
        <div className="fixed bottom-6 right-6 z-[999999]">
            {/* The Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-black text-white px-7 py-3.5 rounded-full shadow-xl font-bold text-sm hover:opacity-80 transition-opacity"
            >
                Styllar 
            </button>

            {/* The Modal Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[330px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-black">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="m-0 text-lg font-bold">Smart Fit Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black text-2xl leading-none">&times;</button>
                    </div>

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-gray-600">Analyzing body & page data...</p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && result && (
                        <div className="text-center py-6">
                            <div className="text-sm text-green-600 font-bold tracking-wider">MATCH FOUND</div>
                            <div className="text-5xl font-black my-4 text-black">{result.recommended_size}</div>
                            <div className="text-xs text-gray-500 mb-6">Confidence: {result.confidence}</div>
                            <button 
                                onClick={() => { setStatus('idle'); setResult(null); }} 
                                className="text-blue-600 text-sm underline hover:text-blue-800"
                            >
                                Run New Scan
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="py-4">
                            <p className="text-red-500 text-sm mb-4">Error: {errorMsg}</p>
                            <button 
                                onClick={() => setStatus('idle')} 
                                className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Input Form State */}
                    {status === 'idle' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                                Upload photos for a precision body scan.
                            </p>
                            
                            <div className="flex gap-3 mb-4">
                                <input 
                                    type="number" 
                                    placeholder="Height (cm)" 
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-1/2 p-2.5 border border-gray-300 rounded-lg outline-none focus:border-black text-sm"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Weight (kg)" 
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-1/2 p-2.5 border border-gray-300 rounded-lg outline-none focus:border-black text-sm"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Front Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setFrontImage(e.target.files[0])}
                                    className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 file:text-black hover:file:bg-gray-200"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Side Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setSideImage(e.target.files[0])}
                                    className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 file:text-black hover:file:bg-gray-200"
                                />
                            </div>

                            <button 
                                onClick={runBodyScan} 
                                className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
                            >
                                Run Body Scan
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StyllarPlugin;