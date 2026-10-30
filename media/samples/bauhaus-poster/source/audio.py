"""imaginarium soundtrack: minimal click-techno at 120 BPM (A minor); every shape landing = a click/blip on its frame.
Reads cues.json. Writes out/audio.wav (48 kHz stereo, 10.000 s, -14 LUFS, TP <= -1 dBTP)."""
import sys, json, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'lib', 'audio'))
import mgaudio as mg
from mgaudio import recipes, sfx, drums, synth

HERE = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(HERE, 'cues.json')))
EV = {e['id']: e for e in C['events']}
DROP, FREEZE = C['drop'], C['freeze']
pan = lambda id_: max(-0.7, min(0.7, (EV[id_]['x'] - 960) / 960 * 0.8))
t = lambda id_: EV[id_]['t']

m = recipes.techno(bpm=C['bpm'], key='A', drop=DROP, build=4.0, outro=FREEZE)
m['ping'].mute = True                      # random pings replaced by event-locked tones below

# intro: crop marks, the circle lands, grid hairlines tick
m.sfx(sfx.tick('wood'), at=t('marks'), gain=-8, pan=0)
m.sfx(sfx.impact('thud', size=0.8), at=t('circle'), gain=-2, pan=pan('circle'))
m.sfx(sfx.blip('A3', 'sine', dur=0.2, glide=1.0), at=t('circle'), gain=-5, pan=pan('circle'))
for k in range(8):
    m.sfx(sfx.tick('hi' if k % 2 else 'clock'), at=0.6 + k * 0.125, gain=-14 + 0.5 * k, pan=(-1) ** k * 0.4)

# assembly: one action per beat
m.sfx(sfx.pen('marker', dur=0.35), at=t('rule'), gain=-9, pan=pan('rule'))
m.sfx(sfx.whoosh(0.45, kind='swish', direction=1, seed=3), at=t('bar') - 0.12, gain=-10, pan=pan('bar'))
m.sfx(sfx.click('hard'), at=t('bar'), gain=-3, pan=pan('bar'))
m.sfx(sfx.blip('E4', 'tri', dur=0.12), at=t('sector'), gain=-4, pan=pan('sector'))
m.sfx(sfx.tick('clock'), at=t('sector') - 0.2, gain=-10, pan=pan('sector'))
m.sfx(sfx.blip('E5', 'square', dur=0.06, glide=1.0), at=t('triangle'), gain=-6, pan=pan('triangle'))
m.sfx(sfx.click('wood'), at=t('block'), gain=-6, pan=pan('block'))
m.sfx(sfx.click('switch'), at=t('split'), gain=-3, pan=pan('split'))
m.sfx(sfx.blip('C5', 'sine', dur=0.15), at=t('semi'), gain=-5, pan=pan('semi'))
m.sfx(sfx.pop('soft'), at=t('dot'), gain=-4, pan=pan('dot'))
m.sfx(sfx.paper('slide', dur=0.4), at=t('title'), gain=-8, pan=pan('title'))
m.sfx(sfx.click('hard'), at=t('title'), gain=-5, pan=pan('title'))
m.sfx(sfx.whoosh(0.4, kind='air', direction=-1, seed=5), at=t('foundry') - 0.1, gain=-11, pan=pan('foundry'))
m.sfx(sfx.stamp('rubber'), at=t('foundry'), gain=-4, pan=pan('foundry'))
m.sfx(sfx.blip('A4', 'tri', dur=0.12), at=t('redsector'), gain=-5, pan=pan('redsector'))

# hero: tile cascade on the drop, a tick rattle on each wave of turns
m.sfx(sfx.impact('punch', size=0.9), at=DROP, gain=0)
m.sfx(sfx.reverse_cymbal(0.9), at=DROP, gain=-8)
for b in (6.5, 7.0):
    for k in range(6):
        m.sfx(sfx.tick('hi'), at=b + k * 0.03, gain=-12 - k, pan=(-1) ** k * 0.5)
m.sfx(sfx.swish(0.5, direction=1, seed=21), at=FREEZE - 0.15, gain=-9, pan=0)

# lock: the poster lands, chord rings under the hold, clock hand ticks each beat
m.sfx(sfx.impact('punch', size=0.7), at=t('lock'), gain=-2)
m.sfx(sfx.stamp('wood'), at=t('lock'), gain=-5)
m.sfx(synth.stab(['A2', 'E3', 'A3', 'C4', 'E4'], 0.5, 0.7, 'dub'), at=t('lock'), gain=-7)
m.sfx(synth.pad(['A3', 'C4', 'E4', 'B4'], 10.0 - FREEZE, 0.6, 'warm'), at=FREEZE, gain=-15)
for k in range(1, 4):
    m.sfx(sfx.tick('tock'), at=FREEZE + k * 0.5, gain=-11, pan=-0.4)

os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
res = m.export(os.path.join(HERE, 'out', 'audio.wav'), lufs=-14, tp=-1.5,
               spectrogram=os.path.join(HERE, 'out', 'audio_spec.png'))
print({k: res[k] for k in ('duration', 'lufs', 'true_peak', 'stereo_corr', 'warnings') if k in res})
