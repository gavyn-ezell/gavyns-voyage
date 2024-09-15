import * as THREE from 'three';

export class Sounds {
    constructor( listener, audioLoader) {
        this.songs = [new THREE.Audio(listener), new THREE.Audio(listener)]
        this.currSong = this.songs[0]
        // load a sound and set it as the Audio object's buffer
        audioLoader.load( '/audio/bubblaine.ogg', (buffer) => {
            this.songs[0].setBuffer( buffer );
            this.songs[0].setLoop( true );
            this.songs[0].setVolume( 0.2 );
        });
    
        audioLoader.load( '/audio/bubblaine-underwater.ogg', (buffer) => {
            this.songs[1].setBuffer( buffer );
            this.songs[1].setLoop( true );
            this.songs[1].setVolume( 0.2 );
        });
    }
    
    update() {

    }
    toggleSound(mute){
        if (mute) {
            this.currSong.pause();
        }
        else{
            this.currSong.play();
        }

    }
    toggleMode(mute, mode) {
        this.currSong.pause()
        if (mode) {
            this.currSong = this.songs[1]
        }
        else{
            this.currSong = this.songs[0]
        }
        if (!mute){
            this.currSong.play();
        }

        
    }
}