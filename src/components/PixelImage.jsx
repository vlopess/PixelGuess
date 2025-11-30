import React, {useEffect, useRef, useState} from "react";
import {CustomLoader} from "./Loader.jsx";

export const PixelImage = ({ image, pixelFactor, revealed }) => {
    const canvasRef = useRef(null);
    const [imgObj, setImgObj] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = image;
        img.onload = () => setImgObj(img);
    }, [image]);

    useEffect(() => {
        if (imgObj && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const w = canvas.width = imgObj.naturalWidth || 500;
            const h = canvas.height = imgObj.naturalHeight || 750;

            ctx.imageSmoothingEnabled = false;

            if (revealed || pixelFactor <= 1) {
                ctx.drawImage(imgObj, 0, 0, w, h);
            } else {
                const sw = w / pixelFactor;
                const sh = h / pixelFactor;
                ctx.drawImage(imgObj, 0, 0, sw, sh);
                ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
            }
        }
    }, [imgObj, pixelFactor, revealed]);

    return (
        <div className="relative w-full max-w-xs mx-auto aspect-[2/3] rounded-lg overflow-hidden shadow-2xl bg-gray-900 border border-gray-700">
            {!imgObj && <CustomLoader />}
            <canvas ref={canvasRef} className={`w-full h-full object-cover transition-opacity duration-500 ${imgObj ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    );
};
