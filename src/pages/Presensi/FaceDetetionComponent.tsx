import React, {useEffect, useRef} from 'react';
import * as faceapi from 'face-api.js';
import {IonContent, IonPage} from "@ionic/react";
interface DetectionBox {
    detection: {
        box: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
}
function App() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // LOAD FROM USEEFFECT
    useEffect(() => {
        startVideo();
        videoRef.current && loadModels();
    }, []);

    // OPEN YOUR FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then((currentStream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // LOAD MODELS FROM FACE API
    const loadModels = () => {
        Promise.all([
            // THIS FOR FACE DETECT AND LOAD FROM YOUR PUBLIC/MODELS DIRECTORY
            faceapi.nets.tinyFaceDetector.loadFromUri('assets'),
            faceapi.nets.faceLandmark68Net.loadFromUri('assets'),
            faceapi.nets.faceRecognitionNet.loadFromUri('assets'),
            faceapi.nets.faceExpressionNet.loadFromUri('assets'),
        ]).then(() => {
            faceMyDetect();
        });
    };

    const faceMyDetect = () => {
        setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                const detections = await faceapi.detectAllFaces(videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                // DRAW YOUR FACE IN WEBCAM
                // @ts-ignore
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                faceapi.matchDimensions(canvasRef.current, {
                    width: 500,
                    height: 500,
                });

                const resized = faceapi.resizeResults(detections, {
                    width: 450,
                    height: 600,
                });

                if (resized.length > 0) {
                    const base64Image = getBase64Image(videoRef.current, resized[0]);
                    console.log('Base64 Image:', base64Image);
                }

                faceapi.draw.drawDetections(canvasRef.current, resized);
                // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
                faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
            }
        }, 1000);
    };

    function getBase64Image(video: HTMLVideoElement, detection: DetectionBox): string {
        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;
        const ctx = canvas.getContext('2d');
        // @ts-ignore
        ctx.drawImage(video, 0, 0, video.width, video.height);

        const {x, y, width, height} = detection.detection.box;
        // @ts-ignore
        const faceImageData = ctx.getImageData(x, y, width, height);

        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = width;
        faceCanvas.height = height;
        const faceCtx = faceCanvas.getContext('2d');
        // @ts-ignore
        faceCtx.putImageData(faceImageData, 0, 0);

        return faceCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    }

    return (
        <IonPage>
            <IonContent>
                <div className="w-full h-screen ">
                    <video className={"w-full h-full"} crossOrigin="anonymous" ref={videoRef} autoPlay></video>
                </div>
                <canvas ref={canvasRef} width={500} height={300} className="appcanvas"/>
            </IonContent>
        </IonPage>

    );
}

export default App;
