import firebase from "firebase/app";
import "firebase/firestore";
import mediasoupClient from "mediasoup-client";
import {AudioContext, IAudioContext} from "standardized-audio-context";
import {MediasoupAudioTrack, MediasoupRouter, MediasoupVideoTrack, MediaTrack} from "../../client.model";
import {DatabaseRouter} from "../../database.model";
import webAudioTouchUnlock from "../../../../util/webAudioTouchUnlock";

export const getFastestRouter = (): Promise<MediasoupRouter> => {
    return new Promise<MediasoupRouter>((resolve, reject) => {
        return firebase
            .database()
            .ref("routers")
            .once("value")
            .then(async (snapshot: firebase.database.DataSnapshot) => {
                if (!snapshot.exists()) {
                    return reject("No routers available");
                }
                let fastestRouter: MediasoupRouter = null;
                let lowestLatency = -1;
                console.log(snapshot.val());
                const routers: {
                    [id: string]: DatabaseRouter
                } = snapshot.val();
                for (const routerId of Object.keys(routers)) {
                    const router: DatabaseRouter = routers[routerId];
                    const latency: number = await ping("https://" + router.domain + ":" + router.port + "/ping")
                        .catch((err) => {
                            console.error('Could not ping router' + router.domain, err);
                            return 99999
                        });
                    console.log("Latency of router " + router.domain + ": " + latency);
                    if (lowestLatency === -1 || lowestLatency > latency) {
                        fastestRouter = {
                            ...router,
                            id: routerId
                        };
                    }
                }
                if (fastestRouter) {
                    console.log("USING " + fastestRouter.domain);
                    return resolve(fastestRouter);
                }
                return reject("No routers available");
            });
    });
}

export const getAudioContext = (): Promise<AudioContext> => {
    return new Promise<AudioContext>((resolve, reject) => {
        // @ts-ignore
        const audioCtx: AudioContext = new AudioContext();
        webAudioTouchUnlock(audioCtx)
            .then((unlocked: boolean) => {
                if (unlocked) {
                    // AudioContext was unlocked from an explicit user action, sound should start playing now
                } else {
                    // There was no need for unlocking, devices other than iOS
                }
            });
        if (!audioCtx)
            reject("Audio not ready");
        return resolve(audioCtx);
    });

}

export const getLocalAudioTracks = (): Promise<MediaStreamTrack[]> => {
    return navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
            autoGainControl: false,
            channelCount: 1,
            echoCancellation: false,
            latency: 0,
            noiseSuppression: false,
            sampleRate: 48000,
            sampleSize: 16,
        }
    })
        .then((stream: MediaStream) => stream.getAudioTracks())
}

export const getLocalVideoTracks = (): Promise<MediaStreamTrack[]> => {
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
        .then((stream: MediaStream) => stream.getVideoTracks())
}

export const createMediasoupMediaTrack = (id: string, consumer: mediasoupClient.types.Consumer, audioContext: IAudioContext): MediaTrack => {
    if (consumer.kind === "audio") {
        return new MediasoupAudioTrack(id, consumer, audioContext);
    }
    return {
        id: id,
        type: "video",
        track: consumer.track
    } as MediasoupVideoTrack;
}


function request_image(url) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject(url);
        };
        img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    });
}

function ping(url: string, multiplier?: number): Promise<number> {
    return new Promise<number>(function (resolve, reject) {
        const start: number = (new Date()).getTime();
        const response = function () {
            let delta: number = ((new Date()).getTime() - start);
            delta *= (multiplier || 1);
            resolve(delta);
        };
        request_image(url).then(response).catch(() => reject(Error('Error')));

        // Set a timeout for max-pings, 300ms.
        setTimeout(function () {
            reject(Error('Timeout'));
        }, 300);
    });
}
