// soundtouch-worklet.js
class SoundTouchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.filter = null;

    this.port.onmessage = (e) => {
      if (e.data.filter) {
        this.filter = e.data.filter;
      }
    };
  }

  process(inputs, outputs) {
    if (!this.filter) return true;

    const outL = outputs[0][0];
    const outR = outputs[0][1];
    const frames = outL.length;

    const interleaved = new Float32Array(frames * 2);
    const extracted = this.filter.extract(interleaved, frames);

    if (extracted === 0) {
      outL.fill(0);
      outR.fill(0);
      return false;
    }

    let j = 0;
    for (let i = 0; i < frames; i++) {
      outL[i] = interleaved[j++];
      outR[i] = interleaved[j++];
    }

    return true;
  }
}

registerProcessor("soundtouch-processor", SoundTouchProcessor);