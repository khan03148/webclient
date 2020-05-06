import {Consumer} from "mediasoup/lib/Consumer";

export interface ParticipantFromServer {
    userId: string;
    socketId: string;
    displayName: string;
    ipv4: string;
    ipv6: string;
    soundjack: boolean;
    producerIds: string[]
}

export interface Participant extends ParticipantFromServer {
    audioLatency?: number;
    videoLatency?: number;
    stream?: MediaStreamTrack;
    consumers: {
        [consumerId: string]: Consumer
    };
}

export interface StageFromServer {
    id: string;
    name: string;
    password: string;
    directorUserId: string;
    participants: {
        [userId: string]: ParticipantFromServer
    }
}

export interface Stage extends StageFromServer {
    participants: {
        [userId: string]: Participant
    }
}