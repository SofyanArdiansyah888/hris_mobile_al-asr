import React, {useEffect, useRef, useState} from 'react';
import * as faceapi from 'face-api.js';
import {IonContent, IonPage} from "@ionic/react";
import usePresensiFormStore from "../../store/PresensiFormStore";
import {usePost} from "../../hooks/useApi";
import {useQueryClient} from "react-query";
import NotifAlert from "../../components/NotifAlert";
import {useHistory} from "react-router-dom";
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
    const [dangerAlert, setDangerAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {payload} = usePresensiFormStore()
    const [base64Image, setBase64Image] = useState("")
    const [isFaceDetected,setIsFaceDetected] = useState(false)

    // LOAD FROM USEEFFECT
    useEffect(() => {
        startVideo();
        videoRef.current && loadModels();
        return () => {
            const stream = videoRef.current?.srcObject as MediaStream | null;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                // @ts-ignore
                videoRef.current.srcObject = null;
            }
        };
    }, [videoRef.current]);

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
                    console.log('ada bambang')
                    setBase64Image(base64Image)
                    setIsFaceDetected(true)
                }

                faceapi.draw.drawDetections(canvasRef.current, resized);
                // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
                faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
            }
        }, 3000);
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

    const history = useHistory()
    const queryClient = useQueryClient()
    const {mutate, isLoading} = usePost({
        name: "absen-karyawan",
        endpoint: `do-absensi`,
        onSuccessCallback: () => {
            queryClient.invalidateQueries({
                queryKey: ['absens', 'check-absen']
            }).then(() => {
                setSuccessAlert(true);
                history.replace("/riwayat-presensi")
            }).catch((error) => console.log(error));

        },
        onErrorCallback: () => {
            setDangerAlert(true)
        },
    });

    function handlePresensi() {
            const {tipe,map_absen,nama_pegawai,kode_pegawai,keterangan,alasan,} = payload
            const postData = new FormData();
            postData.append('foto', base64Image as string)
            postData.append('tipe', tipe)
            postData.append('map_absen', map_absen)
            postData.append('nama_pegawai', nama_pegawai)
            postData.append('kode_pegawai', kode_pegawai)
            postData.append('keterangan', keterangan)
            postData.append('alasan', alasan as string)

            mutate(postData)
    }
    return (
        <IonPage>
            <IonContent className={"relative"}>
                <div className="w-full h-screen ">
                    <video className={"w-full h-full"} crossOrigin="anonymous" ref={videoRef} autoPlay></video>
                </div>
                <canvas ref={canvasRef} width={500} height={300} className="appcanvas"/>
                <button
                    className={"absolute top-[90%] left-[40%] btn bg-red-600 border-red-600"}
                    disabled={!isFaceDetected}
                    onClick={() => handlePresensi()}
                >
                    Absen
                </button>
            </IonContent>
            <NotifAlert
                isOpen={dangerAlert}
                handleCancel={() => setDangerAlert(false)}
                message={"Gagal Melakukan Presensi"}
                type="danger"
                setIsOpen={setDangerAlert}
            />
            <NotifAlert
                isOpen={successAlert}
                handleCancel={() => setSuccessAlert(false)}
                message={"Berhasil Melakukan Presensi"}
                type="success"
                setIsOpen={setSuccessAlert}
            />
        </IonPage>

    );
}

export default App;
