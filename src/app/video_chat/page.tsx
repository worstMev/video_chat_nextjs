'use client';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

export default function Page() {
    const [my_peer_id, set_my_peer_id] = useState(''); 
    const [remote_peer_id, set_remote_peer_id] = useState('');

    const remote_video_ref = useRef(null);
    const my_video_ref = useRef(null);
    const peer_instance = useRef(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            set_my_peer_id(id)
        });

        peer.on('call', (call) => {
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                my_video_ref.current.srcObject = mediaStream;
                my_video_ref.current.play();
                call.answer(mediaStream)
                call.on('stream', function(remoteStream) {
                    remote_video_ref.current.srcObject = remoteStream
                    remote_video_ref.current.play();
                });
            });
        })
        peer_instance.current = peer;
    }, []);
    
    const call = (remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {

            my_video_ref.current.srcObject = mediaStream;
            my_video_ref.current.play();

            const call = peer_instance.current.call(remotePeerId, mediaStream)

            call.on('stream', (remoteStream) => {
                remote_video_ref.current.srcObject = remoteStream
                remote_video_ref.current.play();
            });
        });
    }

    const callMany = (remote_peer_ids) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {

            my_video_ref.current.srcObject = mediaStream;
            my_video_ref.current.play();

            for ( remote_peer_id in remote_peer_ids ) {
                //call every remote peer
                const call = peer_instance.current.call(remotePeerId, mediaStream)

                //create a video for every peer ? dynamic rendering
                call.on('stream', (remoteStream) => {
                    remote_video_ref.current.srcObject = remoteStream
                    remote_video_ref.current.play();
                });
            }

        });
    }

    return(
        <div>
            <p> starting video ... </p>
            <h1>Current user id is {my_peer_id}</h1>
            <input type="text" value={remote_peer_id} onChange={e => set_remote_peer_id(e.target.value)} />
            <button onClick={() => call(remote_peer_id)}>Call</button>
            <div>
            <video ref={my_video_ref} />
            </div>
            <div className={styles.remote_vids}>

            <video ref={remote_video_ref} />
            </div>
        </div>
    );
}
