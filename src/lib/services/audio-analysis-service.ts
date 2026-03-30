// ---------------------------------------------------------------------------
// Audio Analysis Service (Web Audio API — client-side)
// ---------------------------------------------------------------------------

export interface AudioFeatures {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  peakAmplitude: number;
  rmsLevel: number;
  estimatedBPM: number;
  dynamicRange: number;
  spectralCentroid: number;
}

export async function analyzeAudioFile(file: File): Promise<AudioFeatures> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);

  // Basic metadata
  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;

  // Peak amplitude and RMS level
  let peak = 0;
  let sumSquares = 0;
  for (let i = 0; i < channelData.length; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > peak) peak = abs;
    sumSquares += channelData[i] * channelData[i];
  }

  const rmsLevel = Math.sqrt(sumSquares / channelData.length);
  const dynamicRange = 20 * Math.log10(peak / (rmsLevel || 0.0001));

  // BPM estimation
  const estimatedBPM = estimateBPM(channelData, sampleRate);

  // Spectral centroid (simplified — using zero-crossing rate as proxy)
  const spectralCentroid = estimateSpectralCentroid(channelData, sampleRate);

  audioContext.close();

  return {
    duration,
    sampleRate,
    numberOfChannels,
    peakAmplitude: peak,
    rmsLevel,
    estimatedBPM,
    dynamicRange,
    spectralCentroid,
  };
}

function estimateBPM(data: Float32Array, sampleRate: number): number {
  // Downsample to ~200Hz and compute energy envelope
  const hopSize = Math.floor(sampleRate / 200);
  const energyEnvelope: number[] = [];

  for (let i = 0; i < data.length - hopSize; i += hopSize) {
    let sum = 0;
    for (let j = 0; j < hopSize; j++) {
      sum += data[i + j] * data[i + j];
    }
    energyEnvelope.push(sum / hopSize);
  }

  // Autocorrelation for tempo in range 60-200 BPM
  // At 200Hz sample rate: BPM = 60 * 200 / lag
  // For 60 BPM: lag = 200, For 200 BPM: lag = 60
  const minLag = 60; // 200 BPM
  const maxLag = 200; // 60 BPM
  let bestLag = minLag;
  let bestCorr = -Infinity;

  for (
    let lag = minLag;
    lag < Math.min(maxLag, energyEnvelope.length / 2);
    lag++
  ) {
    let corr = 0;
    const n = Math.min(energyEnvelope.length - lag, 1000);
    for (let i = 0; i < n; i++) {
      corr += energyEnvelope[i] * energyEnvelope[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  return Math.round((60 * 200) / bestLag);
}

function estimateSpectralCentroid(
  data: Float32Array,
  sampleRate: number
): number {
  // Zero-crossing rate as a rough frequency proxy
  let crossings = 0;
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
      crossings++;
    }
  }

  // Zero-crossing rate to approximate frequency
  const zcr = crossings / (data.length / sampleRate);
  return Math.round(zcr / 2); // Approximate Hz
}
