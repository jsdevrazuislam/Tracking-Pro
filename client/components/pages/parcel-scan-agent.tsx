'use client';

import React, { useEffect, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

const BarcodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    async function init() {
      try {
        const videoDevices = await reader.listVideoInputDevices();
        if (videoDevices.length > 0) {
          setVideoDevice(videoDevices[0]);
        }
      } catch (err) {
        console.error("Error listing video devices", err);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (!videoDevice) return;

    const reader = new BrowserMultiFormatReader();
    let controls: any = undefined;

    reader.decodeFromVideoDevice(videoDevice.deviceId, 'video', (result: Result | undefined, error) => {
      if (result) {
        setResult(result.getText());
        controls?.stop(); // stop scanner once code is found
      }
    }).then(ctrl => {
      controls = ctrl;
    }).catch(err => {
      console.error('Decode error:', err);
    });

    return () => {
      controls?.stop();
    };
  }, [videoDevice]);

  return (
    <div>
      {result ? (
        <p>Scanned Code: <strong>{result}</strong></p>
      ) : (
        <p>Scanning...</p>
      )}
      <video id="video" width="600" height="400" />
    </div>
  );
};

export default BarcodeScanner;
