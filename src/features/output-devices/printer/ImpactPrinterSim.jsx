import { useState } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import DaisyWheelSim from './DaisyWheelSim';
import DotMatrixSim from './DotMatrixSim';
import InkjetSim from './InkjetSim';
import LaserSim from './LaserSim';
import styles from './ImpactPrinterSim.module.css';

export default function ImpactPrinterSim() {
  const [activeTech, setActiveTech] = useState('wheel'); // 'wheel', 'matrix', 'inkjet', 'laser'

  const simulateContent = (
    <div>
      <div className={styles.techSelector}>
        <button
          className={`${styles.techBtn} ${activeTech === 'wheel' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('wheel')}
        >
          Daisy Wheel
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'matrix' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('matrix')}
        >
          Dot Matrix
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'inkjet' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('inkjet')}
        >
          Inkjet
        </button>
        <button
          className={`${styles.techBtn} ${activeTech === 'laser' ? styles.techBtnActive : ''}`}
          onClick={() => setActiveTech('laser')}
        >
          Laser
        </button>
      </div>

      {activeTech === 'wheel' && <DaisyWheelSim />}
      {activeTech === 'matrix' && <DotMatrixSim />}
      {activeTech === 'inkjet' && <InkjetSim />}
      {activeTech === 'laser' && <LaserSim />}
    </div>
  );

  let learnContent;
  if (activeTech === 'wheel') {
    learnContent = (
      <ExplanationPanel
        description="A Daisy Wheel Printer is an impact printer that uses a circular print wheel (resembling a daisy flower) with character decals at the tips of its petals. An electric motor spins the wheel to position the desired character under a strike hammer. The hammer hits the petal, striking the ribbon and paper to stamp a single, solid-font character. Because the characters are pre-formed molds, it cannot print graphics or change fonts without physically swapping the wheel."
        advantages={[
          'Produces letter-quality, crisp, solid-font text comparable to typewriters',
          'Simple electromechanical print head carriage design',
          'Low maintenance and highly reliable character forms',
          'Can print multi-part carbon copies due to high physical impact force',
        ]}
        disadvantages={[
          'Extremely slow print speeds (typically 10 to 50 characters per second)',
          'Very loud operating noise from physical hammer strikes',
          'Completely unable to print graphics, logos, or images',
          'Limited to the characters molded on the wheel (requires physically changing wheels to swap fonts)',
        ]}
        uses={[
          'Business letterheads, executive mail, and legal documents in the 1970s and 1980s',
          'Office systems requiring high-quality typewriter-like outputs',
          'Invoice printing requiring multi-part carbon-copy receipts',
        ]}
      />
    );
  } else if (activeTech === 'matrix') {
    learnContent = (
      <ExplanationPanel
        description="A Dot Matrix Printer is an impact printer that forms characters and graphics using a grid of tiny ink dots. The print head contains a vertical column of metal wire pins (usually 9 or 24 pins) actuated by electromagnets. As the print head moves horizontally, specific pins shoot out to strike an inked ribbon, leaving dots on the paper. Unlike daisy wheels, it can print arbitrary graphics, charts, and multiple fonts by changing the software instructions that control which pins fire."
        advantages={[
          'Highly versatile—can print basic graphics, charts, and multiple text styles',
          'Extremely durable and operates under harsh environments (factories, warehouses)',
          'Very low operational printing cost (uses inexpensive ribbon cassettes)',
          'Can feed continuous tractor-feed paper and print multi-part carbon forms',
        ]}
        disadvantages={[
          'Low print resolution with visible dot matrix grid structure',
          'Noisy operation from rapid, repeated metal solenoid strikes',
          'Slow print speeds compared to modern inkjet or laser printers',
          'Limited color support (mostly monochrome black/gray)',
        ]}
        uses={[
          'Warehouse invoices, packaging slips, and delivery receipts',
          'Continuous data logging in industrial, scientific, or telecom equipment',
          'Financial institutions printing multi-part banking transaction receipts',
        ]}
      />
    );
  } else if (activeTech === 'inkjet') {
    learnContent = (
      <ExplanationPanel
        description="An Inkjet Printer works by spraying microscopic droplets of liquid ink through tiny nozzles onto paper. Modern inkjet printers use CMYK (Cyan, Magenta, Yellow, Key/Black) subtractive color mixing. There are two core nozzle thermal print technologies: Thermal Inkjet (heating elements vaporize ink to create a bubble that pushes a droplet out) and Piezoelectric Inkjet (vibrating crystals squeeze ink out when voltage is applied). By layering tiny dots adjacent to or on top of each other, they form high-resolution full-color images."
        advantages={[
          'Exceptional color photo quality and smooth gradients',
          'Very low initial printer purchase cost',
          'Compact size and quiet operation compared to impact printers',
          'Capable of printing on various media types (glossy photo paper, fabrics)',
        ]}
        disadvantages={[
          'High operational cost due to expensive replacement ink cartridges',
          'Slow printing speeds for high-resolution graphics',
          'Printed ink is water-soluble and can smudge if exposed to moisture',
          'Nozzles can clog if the printer is left unused for long periods',
        ]}
        uses={[
          'Consumer home photo printing and color document reproduction',
          'Small office/home office (SOHO) text and graphic reports',
          'Wide-format commercial poster and banner printing',
          'Direct-to-garment apparel printing systems',
        ]}
      />
    );
  } else {
    learnContent = (
      <ExplanationPanel
        description="A Laser Printer uses electro-photographics (static electricity and light) to print text and images. An OPC drum is coated with a uniform negative charge. A laser discharges specific areas on the drum, outlining the image to be printed. Negatively charged toner particles stick only to these discharged areas. The toner is then transferred to paper using a positive charge roller, and fuser rollers heated to 200°C melt the plastic toner permanent into the paper fibers."
        advantages={[
          'Extremely fast printing speeds (often 30+ pages per minute)',
          'Very low cost-per-page ratio (toner cartridges last for thousands of sheets)',
          'Sharp, high-quality, smudge-proof black text printing',
          'Toner powder does not dry out or clog like liquid inkjet cartridges',
        ]}
        disadvantages={[
          'Higher initial hardware purchase cost',
          'High power consumption due to heated fuser rollers',
          'Bulkier size and heavier build than consumer inkjet printers',
          'Lower color photo blending performance compared to photo inkjets',
        ]}
        uses={[
          'Medium-to-large business offices requiring high-volume text printing',
          'School computer labs and administrative document centers',
          'Direct mail marketing print runs and black-and-white reports',
          'Book publishing and invoice batch printing',
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
      <h1>Printer Technologies</h1>
      <p className={styles.subtitle}>
        Compare mechanical impact, liquid inkjet nozzles, and laser electrostatic printing cycles.
      </p>
      <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
    </div>
  );
}
