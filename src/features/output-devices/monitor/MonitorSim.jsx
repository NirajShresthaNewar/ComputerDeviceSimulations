import { useState } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CrtCutawayDiagram from './CrtCutawayDiagram';
import PhosphorScreen from './PhosphorScreen';
import LcdSim from './LcdSim';
import LedSim from './LedSim';
import PixelSim from './PixelSim';
import { usePhosphorScan } from './usePhosphorScan';
import styles from './MonitorSim.module.css';

export default function MonitorSim() {
  const [activeTech, setActiveTech] = useState('crt'); // 'crt', 'lcd', 'led', 'pixel'
  const { running, start, stop, reset, beamPos, phosphor, gridW, gridH, revision } = usePhosphorScan();

  const simulateContent = (
    <div>
      <div className={styles.techSelector}>
        <button
          className={`${styles.techBtn} ${activeTech === 'crt' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('crt')}
        >
          CRT Monitor
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'lcd' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('lcd')}
        >
          LCD Monitor
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'led' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('led')}
        >
          LED / OLED Monitor
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'pixel' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('pixel')}
        >
          Pixel Grid
        </button>
      </div>

      {activeTech === 'crt' && (
        <div className={styles.simulateGrid}>
          <CrtCutawayDiagram beamPos={beamPos} gridW={gridW} gridH={gridH} running={running} />
          <div className={styles.right}>
            <PhosphorScreen phosphor={phosphor} gridW={gridW} gridH={gridH} revision={revision} />
            <div className={styles.controls}>
              {!running ? (
                <button className={styles.btn} onClick={start}>Start Beam</button>
              ) : (
                <button className={styles.btn} onClick={stop}>Stop Beam</button>
              )}
              <button className={styles.btnSecondary} onClick={reset}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {activeTech === 'lcd' && <LcdSim />}

      {activeTech === 'led' && <LedSim />}

      {activeTech === 'pixel' && <PixelSim />}
    </div>
  );

  // Dynamic explanation panel contents depending on the active technology tab
  let learnContent;
  if (activeTech === 'crt') {
    learnContent = (
      <ExplanationPanel
        description="A CRT (Cathode Ray Tube) monitor produces an image by firing a focused beam of electrons from an electron gun at the back of the tube toward a phosphor-coated screen at the front. Deflection coils around the tube's neck use magnetic fields to steer the beam, sweeping it left to right across one line, then snapping back and dropping down to the next line — a pattern called raster scanning. Wherever the beam strikes, it excites the phosphor coating, causing it to glow briefly. Because phosphor glow fades quickly, the beam must continuously re-scan the entire screen many times per second (the refresh rate) for the image to appear stable to the human eye, a phenomenon known as persistence of vision."
        advantages={[
          'Excellent color accuracy and true blacks',
          'Very fast response time with minimal motion blur',
          'No fixed native resolution — easily supports multiple resolutions',
          'Wide viewing angles with consistent image quality',
        ]}
        disadvantages={[
          'Bulky and heavy due to the vacuum tube design',
          'Consumes significantly more power than flat panels',
          'Susceptible to screen burn-in and flicker at low refresh rates',
          'Largely obsolete, replaced by LCD/LED displays',
        ]}
        uses={[
          'Legacy computer monitors and television sets',
          'Retro and competitive gaming (valued for low input lag)',
          'Oscilloscopes and other lab/diagnostic equipment',
          'Historical and educational demonstrations of display technology',
        ]}
      />
    );
  } else if (activeTech === 'lcd') {
    learnContent = (
      <ExplanationPanel
        description="An LCD (Liquid Crystal Display) monitor works by using a liquid crystal layer sandwiched between two perpendicular polarizing filters. A backlight provides constant white light. By applying electrical voltage to the liquid crystals, they untwist or twist to control whether the light's polarization angle rotates. If it rotates to match the front polarizer, light passes through; otherwise, it is blocked. Color filters (Red, Green, and Blue) create the final subpixel colors."
        advantages={[
          'Thin, lightweight, and occupies very little space',
          'Highly energy-efficient compared to CRT monitors',
          'Crisp image display at native resolution with no flicker',
          'Low production costs, making them highly affordable',
        ]}
        disadvantages={[
          'Slower response times can lead to ghosting/motion blur',
          'Fixed native resolution; non-native resolutions look blurry',
          'Poorer viewing angles and contrast compared to OLED',
          'Cannot display true blacks due to the continuous backlight',
        ]}
        uses={[
          'Standard office and desktop computer monitors',
          'Laptops, tablets, and smartphone displays',
          'Calculators, digital watches, and home appliances',
          'Budget television screens',
        ]}
      />
    );
  } else if (activeTech === 'led') {
    learnContent = (
      <ExplanationPanel
        description="LED and OLED monitors represent modern display technologies. LED monitors are simply LCD screens that use arrays of Light Emitting Diodes (LEDs) for backlighting. Full-Array Local Dimming (FALD) LED screens turn off specific backlight zones behind dark images to improve contrast, though this can cause 'blooming' halos around bright objects. OLED (Organic LED) screens are emissive: they have no backlight. Every pixel generates its own light and can turn off completely, yielding true blacks and infinite contrast."
        advantages={[
          'OLED offers infinite contrast ratio and perfect black levels',
          'Extremely fast response times (almost instantaneous)',
          'Thinner profiles (especially OLED) and wide viewing angles',
          'FALD offers high peak brightness for HDR content',
        ]}
        disadvantages={[
          'OLED is susceptible to permanent screen burn-in',
          'FALD LED screens display blooming or halos around bright elements',
          'OLED panels are more expensive to manufacture',
          'Slightly higher power consumption than standard LCDs on bright scenes',
        ]}
        uses={[
          'High-end television screens and gaming monitors',
          'Premium smartphones and wearable displays',
          'Graphic design and color-critical editing suites',
          'Home theater setups requiring high-dynamic-range (HDR) support',
        ]}
      />
    );
  } else {
    // activeTech === 'pixel'
    learnContent = (
      <ExplanationPanel
        description="Every color image on a digital screen is composed of millions of tiny squares called pixels (picture elements). Each pixel is further divided into three colored light sources: Red, Green, and Blue subpixels. Displays use additive color mixing: by glowing these subpixels at different intensities, they create any color. For example, Red and Green subpixels glowing together make Yellow, while all three at full brightness make White. Because pixels are extremely small, our eyes cannot distinguish the individual RGB stripes at a normal viewing distance, blending them into a single continuous color."
        advantages={[
          'Enables display of millions of colors using just three primary light sources',
          'Scales to extremely high pixel densities (PPI) for retina-quality sharpness',
          'Standardized RGB subpixel matrices allow simple software color mapping',
          'Enables thin, flat display profiles with precise hardware color controls',
        ]}
        disadvantages={[
          'Subpixel layout spacing can cause text fringing (aliasing)',
          'Requires substantial processing power and memory for high-resolution rendering',
          'Physical screen grid structures can create a pixelated screen-door effect if pixels are too large',
          'Bad or stuck subpixels can result in visible dead pixels',
        ]}
        uses={[
          'All modern flat-panel displays (laptops, monitors, smartphones, TVs)',
          'Digital cameras and image sensor layout matrices (Bayer filters)',
          'Graphic user interface (GUI) design and digital color-rendering systems',
          'Subpixel font-rendering systems (like ClearType or FreeType) to sharpen text',
        ]}
      />
    );
  }

  const quizContent = (
    <p style={{ color: 'var(--color-text-muted)' }}>
      Quiz questions for this device are coming in Phase 6.
    </p>
  );

  return (
    <div>
      <h1>Monitor Technologies</h1>
      <p className={styles.subtitle}>
        Compare how CRT electron beams, LCD liquid crystals, and LED/OLED backlights work.
      </p>
      <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
    </div>
  );
}