let activeStream: MediaStream | null = null;

export async function getCameraStream(): Promise<MediaStream> {
  // If we already have an active live stream, reuse it directly
  if (
    activeStream &&
    activeStream.active &&
    activeStream.getVideoTracks().some((t) => t.readyState === 'live')
  ) {
    return activeStream;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user',
    },
    audio: false,
  });

  activeStream = stream;
  return stream;
}

export function stopCameraStream() {
  if (activeStream) {
    activeStream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.warn('Error stopping track:', e);
      }
    });
    activeStream = null;
  }
}

export function getActiveCameraStream(): MediaStream | null {
  if (
    activeStream &&
    activeStream.active &&
    activeStream.getVideoTracks().some((t) => t.readyState === 'live')
  ) {
    return activeStream;
  }
  return null;
}
