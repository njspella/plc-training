/**
 * Module 2 device photos — Wikimedia Commons CDN (stable URLs).
 * Local copies: bash scripts/download_module2_images.sh (optional; for offline, replace with relative paths).
 */
const WikimediaModule2Images = {
  inductiveProximity: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Inductive_proximity_sensor.jpg',
  limitSwitchRoller: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Mini_Microswitch_-_SPDT_%28Roller_Lever%29_%2812781884965%29.jpg',
  operatorPanel: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/00-bma-automation-operator-panel-with-pushbuttons.JPG',
  emergencyStop: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Emergency_stop_button.jpg',
  photoelectric: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Photoelectric_sensor.jpg',
  laserScanner3d: 'https://upload.wikimedia.org/wikipedia/commons/0/08/CrossingSafety_07g4838.jpg',
  lightCurtain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lightcurtain.svg/960px-Lightcurtain.svg.png',
  contactorRelay: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Contactor_DIN_IEK.jpg',
  stackLight: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Signals%C3%A4ule_an_einer_grossen_selbstfahrenden_Baumaschine_%28rot_gelb_gr%C3%BCn%29.jpg',
  servoMotor: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Servomotor_01.jpg',
  servoDrive: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ingenia_i127-01_Servo_Amplifier.jpg',
  stepperMotor: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Nema_17_Stepper_Motor.jpg',
  vfd: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Variable-Frequency-Inverter.jpg',
};

const TrainingData = {
  title: "PLC Tabletop Training Program",
  subtitle: "Detailed Training Guide & Technical Reference",
  author: "Noah Staudacher — Advanced Manufacturing",
  audience: "Maintenance Technicians & Automation Personnel",
  version: "1.0",
  revisionDate: "April 2026",
  totalHours: 26.5,
  passingScore: 80,

  prerequisites: {
    skills: [
      "Basic electrical knowledge: read a 24VDC wiring diagram, use a multimeter, identify NPN vs. PNP sensor wiring",
      "Comfort with Windows 10/11: file system, opening apps, Command Prompt (ping, ipconfig)",
      "Familiarity with the plant floor: observed PLC-controlled equipment, understands E-stop and LOTO procedures"
    ],
    software: [
      { name: "Sysmac Studio (Omron)", ref: "SR-124812, SR-117625", notes: "Request via self-service. Requires BeyondTrust Privilege Mgmt." },
      { name: "IP Address Change Permission", ref: "SR-128857", notes: "Required for all PLC platforms. Single approval covers all three." },
      { name: "Studio 5000 / Logix Designer (Allen Bradley)", ref: "SR-124812", notes: "IT installs via BeyondTrust. VMI access: USIA-VNDR01 for remote." },
      { name: "Productivity Suite (AutomationDirect)", ref: "Self-service / IT", notes: "Free download. Confirm version matches PLC firmware." },
      { name: "OS32C Configuration Tool (Omron Area Scanner)", ref: "Engineering", notes: "Obtain from engineering documentation folder." }
    ]
  },

  modules: [
    {
      id: 0,
      title: "Electrical Safety & LOTO",
      hours: 0.5,
      format: "Lecture",
      icon: "shield",
      description: "Personnel safety fundamentals required before any hands-on work. Covers lockout/tagout, arc flash awareness, and safe work practices.",
      objectives: [
        "Describe LOTO procedures (OSHA 29 CFR 1910.147) for PLC cabinets",
        "Identify when energized troubleshooting is permitted vs. when LOTO is required",
        "Understand arc flash PPE categories for PLC cabinet voltages",
        "Demonstrate safe multimeter use and proper CAT-rated equipment"
      ],
      lessons: [
        {
          id: 1,
          title: "Lockout/Tagout for PLC Cabinets",
          summary: "When and how to lock out a PLC cabinet safely",
          content: [
            { type: "paragraph", text: "Before any hands-on work with PLC equipment, you must understand the difference between <strong>troubleshooting</strong> (which may be performed energized under specific conditions) and <strong>repair/maintenance</strong> (which requires full lockout/tagout)." },
            { type: "callout", variant: "danger", title: "Critical Safety Rule", text: "Never perform component replacement, wiring changes, or module swaps on an energized cabinet. LOTO is mandatory for all physical modifications." },
            { type: "heading", text: "LOTO Procedure for PLC Cabinets" },
            { type: "steps", items: [
              "Notify all affected personnel that the equipment will be locked out",
              "Identify the main disconnect switch on the PLC cabinet door (rotary disconnect or MCCB with door-interlock handle)",
              "Shut down the controlled equipment through normal stopping procedures",
              "Move the disconnect to the OFF position",
              "Apply your personal lock and tag to the disconnect — each person working on the cabinet applies their own lock",
              "Verify zero energy: use a CAT III or CAT IV rated multimeter to confirm no voltage is present at the PLC power supply input terminals and any auxiliary power feeds",
              "Check for stored energy — capacitors in VFDs and servo drives may retain charge after disconnect"
            ]},
            { type: "callout", variant: "warning", title: "Watch For", text: "Some PLC cabinets have multiple power sources — a main 480VAC feed, a separate 120VAC convenience circuit, and possibly a UPS. All sources must be identified and locked out." },
            { type: "heading", text: "Energized Troubleshooting — When Is It Permitted?" },
            { type: "paragraph", text: "Under NFPA 70E, live electrical work is permitted when de-energizing creates a greater hazard or when the task is infeasible without power. For PLC troubleshooting, this typically means:" },
            { type: "list", items: [
              "Reading PLC status LEDs, HMI screens, and I/O module indicators (visual inspection only)",
              "Connecting a laptop to the PLC's Ethernet port for software monitoring",
              "Using a multimeter to measure voltages at terminal blocks (with appropriate PPE)",
              "Temporarily forcing I/O in software for diagnostic purposes"
            ]},
            { type: "paragraph", text: "Any time you need to disconnect wires, swap modules, or replace components, you must lock out first." }
          ]
        },
        {
          id: 2,
          title: "Arc Flash Awareness & Safe Practices",
          summary: "PPE requirements and safe work practices for electrical work",
          content: [
            { type: "paragraph", text: "Arc flash is an explosive release of energy caused by an electrical fault. While rare at 24VDC control voltages, PLC cabinets often contain 480VAC power feeds, 240VAC heater circuits, or 120VAC auxiliary power that pose real arc flash risk." },
            { type: "heading", text: "Reading Arc Flash Labels" },
            { type: "paragraph", text: "Every electrical panel should have an arc flash label showing the incident energy level (in cal/cm²), the arc flash boundary, and the required PPE category. Before opening any cabinet, read this label." },
            { type: "table", headers: ["PPE Category", "Typical Energy", "Required PPE", "Typical Application"],
              rows: [
                ["Cat 1", "4 cal/cm²", "Arc-rated shirt, safety glasses", "24VDC control panels only"],
                ["Cat 2", "8 cal/cm²", "Arc-rated shirt/pants, face shield", "120/240VAC with limited fault current"],
                ["Cat 3", "25 cal/cm²", "Arc flash suit, hood", "480VAC motor control centers"],
                ["Cat 4", "40 cal/cm²", "Full arc flash suit, double-layer", "High-energy 480VAC+ systems"]
              ]
            },
            { type: "heading", text: "Safe Multimeter Practices" },
            { type: "list", items: [
              "<strong>CAT Rating:</strong> Use a CAT III rated meter minimum for PLC cabinet work. CAT IV for work at or near the service entrance.",
              "<strong>Test leads:</strong> Inspect leads for cracked insulation before every use. Replace damaged leads immediately.",
              "<strong>Probe technique:</strong> Use one hand whenever possible. Hook one lead, then probe with the other.",
              "<strong>Verify your meter:</strong> Test on a known live source before and after testing a de-energized circuit."
            ]},
            { type: "callout", variant: "info", title: "For This Training", text: "The tabletop PLC bench operates at 24VDC and 120VAC. While the risk level is lower than production equipment, we will practice the same safe work habits here that you'll use on the plant floor." }
          ]
        }
      ],
      quiz: [
        { question: "When is LOTO required for PLC cabinet work?", options: ["Only during a complete system shutdown", "Any time you need to disconnect wires, swap modules, or replace components", "Only when working above 480VAC", "Only when the supervisor says so"], correct: 1, explanation: "LOTO is mandatory for all physical modifications — wiring changes, module swaps, and component replacements. Software-only troubleshooting may be done energized with proper precautions." },
        { question: "What should you do FIRST when approaching an unfamiliar PLC cabinet?", options: ["Open the door and look inside", "Read the arc flash label on the outside", "Connect your laptop", "Turn off the main disconnect"], correct: 1, explanation: "Always read the arc flash label first to determine the required PPE before opening any electrical panel." },
        { question: "A PLC cabinet has both a 480VAC main feed and a separate 120VAC UPS. You lock out only the main disconnect. Is the cabinet safe to work on?", options: ["Yes — the main disconnect covers everything", "No — the UPS is a separate source and must also be locked out", "Yes — 120VAC is not dangerous", "It depends on the work being done"], correct: 1, explanation: "All energy sources must be identified and locked out. A UPS will continue to supply power even when the main disconnect is off." }
      ],
      demoBreaks: []
    },

    {
      id: 1,
      title: "PLC Hardware & Components",
      hours: 2.5,
      format: "Lecture + Lab",
      icon: "cpu",
      description: "Comprehensive walkthrough of PLC cabinet components, I/O modules, power distribution, and cabinet infrastructure.",
      objectives: [
        "Identify every major component inside a PLC control cabinet from physical inspection",
        "Explain the function of the CPU, power supply, Ethernet board, I/O modules, and terminal blocks",
        "Distinguish between digital I/O and analog I/O modules and their applications",
        "Read a basic PLC wiring diagram and match terminal labels to physical wiring",
        "Understand cabinet infrastructure: fuses, DIN rail, grounding, and wire labeling"
      ],
      lessons: [
        {
          id: 1,
          title: "PLC Cabinet Overview",
          summary: "Major components and their functions inside a PLC control cabinet",
          content: [
            { type: "paragraph", text: "A PLC (Programmable Logic Controller) checks signals from sensors or switches (inputs), runs through a set of programmed instructions based on those inputs and logic, and controls motors, lights, valves, or conveyors (the outputs)." },
            { type: "paragraph", text: "The PLC cabinet houses all the core control components. Understanding what's inside — and what each component does — is the foundation of every troubleshooting task." },
            { type: "heading", text: "PLC CPU Controller" },
            { type: "image", src: "images/ps_cpu_module.png", alt: "PLC CPU Module", caption: "PLC CPU Controller Module — the brain of the system" },
            { type: "paragraph", text: "The CPU is the brain of the PLC. It executes the ladder logic program in a continuous scan cycle: read all inputs → execute program logic → update all outputs → repeat. The scan time (typically 1–20ms) determines how fast the PLC responds to changes." },
            { type: "list", items: [
              "<strong>RUN LED:</strong> Solid green = program is executing normally",
              "<strong>ERR LED:</strong> Flashing red = minor fault, solid red = major fault (CPU halted)",
              "<strong>Mode switch:</strong> Selects RUN, PROGRAM, or REMOTE mode"
            ]},
            { type: "callout", variant: "info", title: "PLC Operating Modes", text: "<strong>RUN:</strong> Normal operation — program executes, outputs are active.<br><strong>PROGRAM:</strong> Program is halted — outputs are de-energized. Used for downloading programs.<br><strong>REMOTE:</strong> Mode can be changed from software. Most common setting for production machines." },
            { type: "heading", text: "Power Supply" },
            { type: "image", src: "images/ps_plc_power_supply.png", alt: "PLC Power Supply", caption: "Power Supply Module — converts AC to 24VDC" },
            { type: "paragraph", text: "The power supply converts facility AC voltage (120VAC or 240VAC) to 24VDC for the PLC modules and field devices. Key specs to note: input voltage range, output current capacity, and whether it has redundancy or short-circuit protection." },
            { type: "heading", text: "Ethernet Communication Board" },
            { type: "image", src: "images/ps_ethernet_board.png", alt: "Ethernet Communication Board", caption: "Ethernet Communication Board — network connectivity" },
            { type: "paragraph", text: "Enables EtherNet/IP or EtherCAT communication between the PLC, HMI screens, other PLCs, and engineering workstations. Check the link and activity LEDs to verify connectivity." },
            { type: "heading", text: "PLC Families On Site" },
            { type: "table", headers: ["Platform", "CPU Model", "Protocol", "Software"],
              rows: [
                ["Omron", "NX1P2, CP1L", "EtherCAT", "Sysmac Studio"],
                ["Allen Bradley", "CompactLogix", "EtherNet/IP", "Studio 5000"],
                ["AutomationDirect", "Productivity P2000", "Modbus TCP", "Productivity Suite"]
              ]
            }
          ]
        },
        {
          id: 2,
          title: "Digital I/O Modules",
          summary: "Digital input and output cards — wiring, diagnostics, and replacement",
          content: [
            { type: "heading", text: "Digital Input Modules (DI Cards)" },
            { type: "paragraph", text: "Digital input modules accept discrete on/off signals (typically 24VDC). Each channel reads a binary state — 1 (ON/TRUE) or 0 (OFF/FALSE). Field devices like sensors, switches, and push buttons wire to the module's screw terminals." },
            { type: "list", items: [
              "<strong>Sinking vs. Sourcing:</strong> Sinking inputs accept current (NPN sensors provide current path to ground). Sourcing inputs provide current (PNP sensors switch the positive supply). Most modern PLCs auto-detect, but wiring errors between NPN/PNP cause phantom signals.",
              "<strong>Channel LEDs:</strong> Each input channel has an LED — green/lit means that input is seeing a signal (ON). This is your first diagnostic tool.",
              "<strong>Common grouping:</strong> Inputs may share a common terminal in groups of 4, 8, or 16. If the common wire breaks, the entire group goes dead."
            ]},
            { type: "callout", variant: "tip", title: "Quick Diagnostic", text: "If a sensor's own LED is lit but the PLC input module LED is dark, the problem is between the sensor and the module — check wiring, terminal connections, and fuses." },
            { type: "heading", text: "Digital Output Modules (DO Cards)" },
            { type: "paragraph", text: "Digital output modules drive discrete on/off loads. The PLC sets output bits to ON/OFF, and the module energizes or de-energizes the corresponding terminal." },
            { type: "table", headers: ["Output Type", "Characteristics", "Best For"],
              rows: [
                ["Relay", "Mechanical contact, audible click, handles AC or DC, higher current (2A+)", "Motor contactors, solenoid valves, mixed-voltage loads"],
                ["Transistor (sinking/sourcing)", "Solid-state, silent, DC only, fast switching, lower current", "High-speed applications, indicator lights, low-current solenoids"],
                ["Triac", "Solid-state, AC only, silent, moderate speed", "AC-powered devices, heaters"]
              ]
            },
            { type: "callout", variant: "warning", title: "Common Failure Mode", text: "Relay output contacts wear over time (especially with inductive loads). If an output module LED is lit but the connected device doesn't respond, measure voltage at the output terminal — a worn relay contact may show high resistance or no continuity." }
          ]
        },
        {
          id: 3,
          title: "Analog I/O Modules",
          summary: "Analog input and output modules — signal types, scaling, and calibration",
          content: [
            { type: "heading", text: "Analog Input Modules (AI Cards)" },
            { type: "paragraph", text: "Analog input modules read continuous signals rather than simple on/off states. They convert real-world measurements (pressure, temperature, flow, position) into digital values the PLC can process." },
            { type: "table", headers: ["Signal Type", "Range", "Common Use"],
              rows: [
                ["4–20mA", "Current loop", "Pressure transmitters, level sensors, flow meters — most common industrial standard"],
                ["0–10VDC", "Voltage", "Potentiometers, some sensor outputs, speed references"],
                ["0–5VDC", "Voltage", "Legacy sensors, some load cells"],
                ["Thermocouple", "mV (type-specific)", "Temperature measurement (requires TC-specific module)"],
                ["RTD", "Resistance", "Precision temperature measurement (requires RTD-specific module)"]
              ]
            },
            { type: "callout", variant: "info", title: "Why 4–20mA Instead of 0–20mA?", text: "The 4mA \"live zero\" is intentional — if you read 0mA, it means a broken wire, not a zero reading. This is the single most useful diagnostic feature of the 4–20mA standard." },
            { type: "heading", text: "Analog Output Modules (AO Cards)" },
            { type: "paragraph", text: "Analog output modules generate continuous control signals. The PLC writes a value, and the module outputs a proportional voltage or current signal to control devices like VFDs, proportional valves, or chart recorders." },
            { type: "list", items: [
              "<strong>4–20mA output:</strong> Used for driving valve positioners and remote setpoints. 2-wire vs. 4-wire configurations matter for wiring.",
              "<strong>0–10VDC output:</strong> Common for VFD speed references and dimmer controls.",
              "<strong>Scaling:</strong> The PLC stores values as raw integers (e.g., 0–4095 for 12-bit, 0–65535 for 16-bit). The program scales this to engineering units."
            ]},
            { type: "callout", variant: "tip", title: "Troubleshooting Analog Signals", text: "Use a milliamp clamp meter or process calibrator to verify the actual signal at the terminal. If the PLC shows a good value but the field device isn't responding, the problem is downstream. If the PLC shows an out-of-range value, check the wiring and transmitter." }
          ]
        },
        {
          id: 4,
          title: "Cabinet Infrastructure",
          summary: "DIN rail, fuses, grounding, power distribution, and wire labeling",
          content: [
            { type: "heading", text: "DIN Rail Mounting" },
            { type: "paragraph", text: "35mm top-hat DIN rail (EN 60715) is the universal standard for mounting PLC modules, terminal blocks, relays, circuit breakers, and power supplies. Every component in the cabinet sits on it." },
            { type: "list", items: [
              "Modules clip onto DIN rail via a spring-loaded tab at the bottom",
              "To remove: insert a flat-blade screwdriver into the release tab and lever the module forward",
              "Ensure proper spacing between components for heat dissipation per manufacturer specs"
            ]},
            { type: "heading", text: "Fuses & Circuit Breakers" },
            { type: "paragraph", text: "Fuses and miniature circuit breakers (MCBs) protect the PLC power supply, output modules, and field devices from overcurrent. A blown fuse is one of the most common and easiest-to-fix causes of apparent PLC output failures." },
            { type: "callout", variant: "danger", title: "Check Fuses First!", text: "Before chasing a software problem, always check physical fuses. A blown fuse on an output circuit makes the PLC output appear to fail — the PLC commands the output ON (LED is lit on the module), but the field device doesn't respond because the fuse is blown." },
            { type: "heading", text: "24VDC Power Distribution" },
            { type: "paragraph", text: "The 24VDC output from the PLC power supply must be distributed to input modules, sensors, and some output devices. This is done via power distribution terminal blocks or fused distribution blocks. A single shorted sensor can drag down the entire 24VDC bus if distribution is not fused — taking out dozens of inputs simultaneously." },
            { type: "heading", text: "Grounding & Bonding" },
            { type: "paragraph", text: "Proper earth grounding prevents analog signal noise, intermittent communication faults, false input triggers, and ESD damage. Key practices:" },
            { type: "list", items: [
              "<strong>Star-point grounding:</strong> All ground wires connect to a single ground bus bar, which connects to building ground",
              "<strong>Cable shield grounding:</strong> Shield drain wires land on the ground bus at one end only to avoid ground loops",
              "<strong>DIN rail grounding:</strong> DIN rail is bonded to the cabinet ground bus",
              "Separate safety earth from signal/analog ground references"
            ]},
            { type: "heading", text: "Wire Labeling & Cable Management" },
            { type: "paragraph", text: "Proper wire labeling using heat-shrink markers or wrap-around labels matched to the wiring diagram is critical for maintenance. When you open a cabinet at 2 AM during an emergency, labeled wires are the difference between a 15-minute fix and a 4-hour nightmare." },
            { type: "list", items: [
              "Wire duct (Panduit) keeps wires organized and accessible",
              "Ferrules on stranded wire ends prevent fraying and loose connections",
              "Every wire should be labeled at both ends matching the wiring diagram"
            ]},
            { type: "heading", text: "Main Disconnect Switch" },
            { type: "paragraph", text: "The main power disconnect on the cabinet door is the primary LOTO point. It's required by NFPA 79 and NEC. Always verify zero energy after turning off the disconnect — some circuits (UPS-fed or external convenience outlets) may remain live." }
          ]
        }
      ],
      quiz: [
        { question: "What does a solid red ERR LED on a PLC CPU indicate?", options: ["Normal operation", "Minor fault — program still running", "Major fault — CPU halted, outputs de-energized", "Communication error only"], correct: 2, explanation: "A solid red ERR LED indicates a major fault where the CPU has halted program execution and outputs are de-energized." },
        { question: "A digital input module channel LED is dark, but the proximity sensor's own LED is lit. Where is the most likely problem?", options: ["The PLC program has a bug", "The wiring between the sensor and the module", "The sensor is faulty", "The CPU is in PROGRAM mode"], correct: 1, explanation: "If the sensor LED shows it's detecting but the I/O module doesn't see the signal, the problem is in the wiring path between them — check terminal connections, wire continuity, and fuses." },
        { question: "You read 0mA on a 4–20mA pressure transmitter circuit. What does this indicate?", options: ["Zero pressure — everything is normal", "A broken wire or disconnected transmitter", "The transmitter is reading negative pressure", "The analog module is faulty"], correct: 1, explanation: "In a 4–20mA system, 4mA represents zero/minimum reading. 0mA means there is no current flowing — indicating a broken wire, blown fuse, or disconnected transmitter." },
        { question: "Why should fuses be checked BEFORE troubleshooting in PLC software?", options: ["Fuses are expensive and should be checked regularly", "A blown fuse can make an output appear to fail even though the PLC is commanding it ON", "PLC software cannot detect fuse status", "It's an OSHA requirement"], correct: 1, explanation: "When a fuse is blown, the PLC output module LED will be lit (PLC thinks output is ON), but the field device won't respond because there's no power reaching it through the blown fuse." },
        { question: "What is the purpose of star-point grounding in a PLC cabinet?", options: ["To provide backup power", "To prevent ground loops and ensure all ground paths converge at a single reference point", "To increase cable length capacity", "To protect against lightning"], correct: 1, explanation: "Star-point grounding ensures all ground wires connect to a single bus bar, preventing ground loops that cause signal noise, intermittent faults, and communication errors." }
      ],
      demoBreaks: [
        { after: "PLC Cabinet Overview", title: "Live Cabinet Identification", duration: "10 min", description: "Walk to the tabletop bench. Trainer points to each major component: power supply (show input voltage label, output 24VDC), CPU module (show RUN/ERR LEDs, mode switch), Ethernet port (show link/activity LEDs).", activity: "Each student physically points to and names: the CPU on each of the three PLCs, the power supply, and at least one input and one output module." },
        { after: "Digital I/O Modules", title: "Wiring Trace Exercise", duration: "15 min", description: "Pick one input device (e.g., proximity sensor). Starting at the sensor, physically trace the wire through cable duct to the terminal block, then to the I/O module terminal. Show the wiring diagram side-by-side.", activity: "Students each select a different device and trace its wiring from device → terminal block → I/O module, then report which terminal block number, I/O slot, and channel." },
        { after: "Cabinet Infrastructure", title: "Three-Platform Comparison", duration: "10 min", description: "Stand at the bench with all three PLCs visible. Point out physical differences: module form factor, how I/O attaches, Ethernet ports, DIP switches, and size differences.", activity: "Students note one physical difference between platforms they find surprising. Brief group discussion." }
      ]
    },

    {
      id: 2,
      title: "Safety & Input/Output Devices",
      hours: 2.5,
      format: "Lecture + Lab",
      icon: "zap",
      description: "Input devices (sensors, switches, safety devices) and output devices (motors, relays, valves) — how they work and how they connect to the PLC.",
      objectives: [
        "Identify the main input device types and describe the signal each sends to the PLC",
        "Identify the main output device types and describe how the PLC drives each",
        "Understand the difference between standard I/O and safety I/O (dual-channel, OSSD)",
        "Recognize additional field devices: photoelectric sensors, encoders, solenoid valves, VFDs"
      ],
      lessons: [
        {
          id: 1,
          title: "Input Devices — Sensors & Switches",
          summary: "Proximity sensors, limit switches, photoelectric sensors, push buttons",
          content: [
            { type: "heading", text: "Proximity Sensors" },
            { type: "image", src: WikimediaModule2Images.inductiveProximity, alt: "Cylindrical inductive proximity sensor", caption: "Inductive proximity sensor — detects metal without contact" },
            { type: "paragraph", text: "An inductive proximity sensor detects metal objects without physical contact. It sends a 24VDC signal to the PLC digital input when a metal target enters its sensing range. Available in NPN (sinking) and PNP (sourcing) output types." },
            { type: "heading", text: "Limit Switches" },
            { type: "paragraph", text: "A limit switch is a mechanical contact sensor that triggers when an actuator (lever, roller, plunger) reaches its end-of-travel position. Provides either Normally Open (N/O) or Normally Closed (N/C) dry contacts." },
            { type: "image", src: WikimediaModule2Images.limitSwitchRoller, alt: "Miniature microswitch with roller lever actuator", caption: "Roller-lever limit / microswitch — typical end-of-travel sensing" },
            { type: "heading", text: "Photoelectric Sensors" },
            { type: "paragraph", text: "Photoelectric sensors use light beams for detection. Three main types are used in manufacturing:" },
            { type: "table", headers: ["Type", "Configuration", "Range", "Best For"],
              rows: [
                ["Through-beam", "Separate emitter + receiver", "Longest (up to 30m)", "Part counting, conveyor jam detection — most reliable"],
                ["Retroreflective", "Emitter/receiver in one housing + reflector", "Medium (up to 10m)", "Presence detection where mounting space is limited on one side"],
                ["Diffuse", "Emitter/receiver in one housing, detects object directly", "Short (up to 1m)", "Close-range part detection, color/contrast sensing"]
              ]
            },
            { type: "sideBySide",
              left: [
                { type: "image", src: WikimediaModule2Images.photoelectric, alt: "Photoelectric sensor device", caption: "Photoelectric sensor — through-beam, retroreflective, and diffuse types use similar hardware" }
              ],
              right: [
                { type: "callout", variant: "tip", title: "Maintenance Tip", text: "Dirty lenses are the #1 cause of photoelectric sensor failures. Regular cleaning with a lint-free cloth can prevent most false triggers and missed detections." }
              ]
            },
            { type: "heading", text: "Push Buttons" },
            { type: "image", src: WikimediaModule2Images.operatorPanel, alt: "Industrial operator panel with pushbuttons", caption: "Operator panel with pushbuttons — typical start/stop and mode selection" },
            { type: "paragraph", text: "Push buttons provide operator input to the PLC. Can be N/O (closes when pressed) or N/C (opens when pressed), momentary (spring-return) or maintained (latching). E-stop buttons are always N/C — they open the safety circuit when pressed and must be physically reset." },
            { type: "image", src: WikimediaModule2Images.emergencyStop, alt: "Red emergency stop pushbutton", caption: "Emergency stop — wired as normally closed (N/C) in the safety circuit" }
          ]
        },
        {
          id: 2,
          title: "Safety Devices",
          summary: "Area scanners, light curtains, safety relays, and OSSD concepts",
          content: [
            { type: "heading", text: "Area Scanners" },
            { type: "image", src: WikimediaModule2Images.laserScanner3d, alt: "3D laser radar obstacle detection installation", caption: "3D laser scanning for obstacle detection (example: level-crossing system — illustrates zone scanning, not a specific OS32C model)" },
            { type: "paragraph", text: "An area scanner uses a rotating laser to scan a defined area of space. If it detects a person or obstruction within its configured safety zone, it sends a signal to the PLC to stop or de-energize connected equipment." },
            { type: "list", items: [
              "Configurable warning and protective fields",
              "OSSD (Output Signal Switching Device) safety outputs to PLC",
              "Common brands: SICK S300/S3000, Omron OS32C",
              "Programmed via USB using manufacturer software"
            ]},
            { type: "heading", text: "Light Curtains" },
            { type: "paragraph", text: "A light curtain is an infrared safety barrier consisting of an emitter and receiver pair. If any beam is broken (e.g., a hand reaches through), the OSSD outputs drop and the machine stops. Used to guard press brakes, palletizers, and robotic cells." },
            { type: "image", src: WikimediaModule2Images.lightCurtain, alt: "Diagram of a light curtain guarding a machine opening", caption: "Light curtain concept — interrupted beams drop OSSD outputs (diagram)" },
            { type: "heading", text: "Safety Relays" },
            { type: "image", src: WikimediaModule2Images.contactorRelay, alt: "Industrial contactor on DIN rail", caption: "DIN-rail power switching device — safety relays are often similar rail-mounted modules with dual-channel inputs" },
            { type: "paragraph", text: "Safety relays monitor safety circuits using dual-channel inputs with forced-guided contacts. They verify that both OSSD channels from a safety device agree before allowing machine operation. If the channels disagree (indicating a fault), the relay locks out and requires manual reset." },
            { type: "heading", text: "What is OSSD?" },
            { type: "callout", variant: "info", title: "OSSD — Output Signal Switching Device", text: "Safety-rated devices use two independent output channels (OSSD1 and OSSD2). Both must be ON for the machine to run. This dual-channel design means a single component failure cannot defeat the safety function. Standard single-channel sensors cannot be used for safety-rated applications." }
          ]
        },
        {
          id: 3,
          title: "Output Devices",
          summary: "Light towers, motors, drives, relays, solenoid valves, and VFDs",
          content: [
            { type: "heading", text: "Light Tower (Stack Light)" },
            { type: "image", src: WikimediaModule2Images.stackLight, alt: "Red amber green stack light on machinery", caption: "Stack (tower) light — each color segment is typically a separate PLC output" },
            { type: "paragraph", text: "Stack lights indicate machine status: <strong>Green</strong> = running, <strong>Red</strong> = fault/stopped, <strong>Amber</strong> = warning/attention needed, <strong>Blue</strong> = operator call. Each color is driven by a separate PLC digital output." },
            { type: "heading", text: "Servo Motors & Drives" },
            { type: "image", src: WikimediaModule2Images.servoMotor, alt: "Industrial servomotor", caption: "Servomotor — closed-loop position, speed, and torque control with feedback" },
            { type: "paragraph", text: "Servo motors provide precise position, speed, and torque control. The servo drive receives commands from the PLC (typically via EtherCAT or EtherNet/IP) and controls the motor accordingly. Used for CNC positioning, robotic joints, and precise material handling." },
            { type: "image", src: WikimediaModule2Images.servoDrive, alt: "Servo amplifier drive unit", caption: "Servo drive (amplifier) — executes motion commands from the PLC over the fieldbus" },
            { type: "heading", text: "Stepper Motors" },
            { type: "paragraph", text: "Stepper motors provide open-loop position control using discrete step pulses. Simpler and less expensive than servos but limited in torque and speed. Used for lower-precision positioning applications." },
            { type: "image", src: WikimediaModule2Images.stepperMotor, alt: "NEMA 17 stepper motor", caption: "Stepper motor — moved in discrete steps under pulse command from the PLC or indexer" },
            { type: "heading", text: "Relays" },
            { type: "paragraph", text: "Relays are electrically-operated switches that isolate PLC outputs from high-voltage or high-current loads. The PLC energizes the relay coil (24VDC), and the relay contacts switch the load circuit (which may be 120VAC, 240VAC, or higher)." },
            { type: "image", src: WikimediaModule2Images.contactorRelay, alt: "Contactor mounted on DIN rail", caption: "Contactor on DIN rail — common style of relay/contactor switched by a PLC output" },
            { type: "heading", text: "Solenoid Valves" },
            { type: "paragraph", text: "Solenoid valves control pneumatic or hydraulic flow. The PLC digital output energizes the solenoid coil, which shifts a spool to direct air or fluid to cylinders, actuators, or clamps." },
            { type: "table", headers: ["Type", "Action", "Application"],
              rows: [
                ["5/2 single-solenoid", "Spring return — de-energize returns to home", "Single-acting cylinders, simple extend/retract"],
                ["5/2 double-solenoid", "Detented — stays in last position", "Double-acting cylinders where position must hold on power loss"],
                ["5/3 center-closed", "Center position blocks all ports", "Holding position under load with no air flow"]
              ]
            },
            { type: "heading", text: "Variable Frequency Drives (VFDs)" },
            { type: "paragraph", text: "VFDs control AC motor speed by varying output frequency and voltage. Found on conveyors, pumps, fans, and mixers. Control methods:" },
            { type: "list", items: [
              "<strong>Hardwired:</strong> PLC digital output for run/stop, analog output (4–20mA) for speed reference",
              "<strong>Network:</strong> PLC sends commands and reads feedback over EtherNet/IP, EtherCAT, or Modbus — start/stop, speed setpoint, actual speed, current draw, and fault codes all in one connection"
            ]},
            { type: "image", src: WikimediaModule2Images.vfd, alt: "Variable frequency drive inverter unit", caption: "Variable-frequency drive — varies output frequency and voltage to the motor" },
            { type: "callout", variant: "warning", title: "VFD Safety Note", text: "VFD DC bus capacitors retain dangerous voltage (up to 800VDC) after the drive is powered off. Wait for the DC bus voltage to decay to zero (check the drive display or measure with a meter) before working on VFD wiring." },
            { type: "heading", text: "Motor Contactors & Starters" },
            { type: "paragraph", text: "For motors without VFDs, contactors switch motor power on/off. A motor starter = contactor + overload relay. The PLC energizes the contactor coil (usually through an interposing relay), and the overload relay's auxiliary contacts feed back to a PLC input for trip monitoring." },
            { type: "heading", text: "Encoders" },
            { type: "paragraph", text: "Encoders provide position and speed feedback. <strong>Incremental encoders</strong> output A/B pulses proportional to rotation (connect to PLC high-speed counter inputs). <strong>Absolute encoders</strong> output a unique position value even after power loss (connect via SSI, BiSS, or EtherCAT)." }
          ]
        }
      ],
      quiz: [
        { question: "What are the three types of photoelectric sensors?", options: ["Inductive, capacitive, ultrasonic", "Through-beam, retroreflective, diffuse", "NPN, PNP, relay output", "Analog, digital, safety"], correct: 1, explanation: "Through-beam (separate emitter/receiver), retroreflective (one housing + reflector), and diffuse (one housing, detects target directly) are the three main photoelectric sensor types." },
        { question: "A proximity sensor has its LED lit but the PLC doesn't see the signal. The I/O module channel LED is also dark. What is the most likely cause?", options: ["The sensor is broken", "Bad wiring between the sensor and the I/O module", "The PLC program has a bug", "The HMI is misconfigured"], correct: 1, explanation: "Sensor LED lit = sensor is detecting. Module LED dark = module isn't receiving the signal. The problem is in the wiring path between them." },
        { question: "Why do safety devices use two OSSD channels instead of one?", options: ["To double the signal strength", "To provide redundancy — a single component failure cannot defeat the safety function", "To allow two machines to share one sensor", "To reduce wiring costs"], correct: 1, explanation: "Dual-channel OSSD ensures that if one channel fails, the other still triggers a safety stop. Both channels must agree for the machine to run." },
        { question: "A VFD has been powered off. Is it immediately safe to touch the wiring?", options: ["Yes — power is off", "No — DC bus capacitors can retain dangerous voltage", "Only if you wait 30 seconds", "Only if the motor has stopped spinning"], correct: 1, explanation: "VFD DC bus capacitors can retain up to 800VDC after power-off. Always wait for the bus voltage to fully discharge and verify with a meter before touching wiring." },
        { question: "What controls the speed of an AC motor connected to a VFD?", options: ["The PLC changes the motor's winding configuration", "The VFD varies the output frequency and voltage to the motor", "A mechanical gearbox inside the VFD", "The power supply voltage is adjusted"], correct: 1, explanation: "VFDs control motor speed by varying the frequency of the AC power supplied to the motor. Higher frequency = higher speed, lower frequency = lower speed." }
      ],
      demoBreaks: [
        { after: "Input Devices — Sensors & Switches", title: "Input Device Activation", duration: "10 min", description: "At the bench, activate each input device: trigger the proximity sensor with a metal target, actuate the limit switch, press push buttons.", activity: "Each student activates each input device and observes both the device's own LED and the I/O module channel LED light up. First time seeing the full input signal chain." },
        { after: "Output Devices", title: "Output Device Observation", duration: "10 min", description: "Force outputs to energize the light tower (cycle colors), click the relay, and command a servo motor move. Point out I/O module output LEDs.", activity: "Students observe outputs and match each physical action to its module LED. Listen for the relay click, watch the servo shaft move, see the light tower cycle." },
        { after: "Safety Devices", title: "Area Scanner OSSD Demo", duration: "10 min", description: "Show the OS32C area scanner. Have someone walk into the detection zone. Show the scanner LED change, OSSD drop, and downstream effect.", activity: "Students observe the full safety chain: intrusion → scanner response → OSSD state change → device de-energization. Ask: 'What just stopped and why?'" }
      ]
    },

    {
      id: 3,
      title: "Software Setup & PLC Connectivity",
      hours: 3.5,
      format: "Hands-on Lab",
      icon: "monitor",
      description: "Installing PLC software, configuring IP addresses, and connecting to all three PLC platforms. Includes program backup/restore procedures.",
      objectives: [
        "Configure a laptop IP address to communicate with a PLC on a given subnet",
        "Connect to an Omron NX1P2 using Sysmac Studio",
        "Connect to an Allen Bradley controller using Studio 5000",
        "Connect to a Productivity PLC using Productivity Suite",
        "Perform program upload (backup) and understand download procedures"
      ],
      lessons: [
        {
          id: 1,
          title: "IP Address Configuration",
          summary: "Setting your laptop IP to communicate with PLCs on any subnet",
          content: [
            { type: "paragraph", text: "Every PLC connection starts with IP address configuration. Your laptop must be on the same subnet as the PLC to communicate." },
            { type: "heading", text: "Step-by-Step: Setting Your IP Address" },
            { type: "steps", items: [
              "Open the Windows search bar and type <strong>Network Connections</strong>",
              "Double-click the Ethernet adapter showing \"Unidentified Network\" (this is the one connected to the PLC)",
              "Click <strong>Properties</strong>, enter your username and password if prompted",
              "Scroll to <strong>Internet Protocol Version 4 (TCP/IPv4)</strong> and double-click",
              "Select <strong>Use the following IP address</strong>",
              "Set the first three octets to match the PLC's IP. Set the last octet to a unique number (not the PLC's address). Example: PLC is 192.168.1.100 → set laptop to 192.168.1.50",
              "Set Subnet mask to <strong>255.255.255.0</strong>",
              "Click OK and close all dialogs"
            ]},
            { type: "callout", variant: "info", title: "Subnet Explained Simply", text: "With a subnet mask of 255.255.255.0, the first three number groups must match between your laptop and the PLC. Only the last number must be different. If the PLC is 192.168.5.20, your laptop could be 192.168.5.50 — but NOT 192.168.1.50 (different third octet)." },
            { type: "heading", text: "Verify Connectivity with Ping" },
            { type: "paragraph", text: "Open Command Prompt and type: <code>ping 192.168.1.100</code> (replace with the PLC's actual IP). You should see replies. If you see \"Request timed out\" or \"Destination host unreachable,\" check your IP settings, cable, and link lights." },
            { type: "callout", variant: "tip", title: "IT Access Requirement", text: "Changing your IP address requires permission. Reference SR-128857 in self-service. One approval covers all three PLC platforms." }
          ]
        },
        {
          id: 2,
          title: "Connecting to Omron (Sysmac Studio)",
          summary: "Direct Ethernet and remote connection procedures for Omron NX1P2",
          content: [
            { type: "paragraph", text: "Sysmac Studio is Omron's integrated development environment for the NX/NJ series controllers. Request it via self-service using references SR-124812 and SR-117625." },
            { type: "heading", text: "Direct Ethernet Connection" },
            { type: "steps", items: [
              "Plug the Ethernet cable from your laptop directly into the PLC's Ethernet port",
              "Open Sysmac Studio and open or create a project",
              "Select <strong>Direct Connection via Ethernet</strong> in the connection dialog",
              "Click <strong>Connect</strong> — the software will scan for controllers on the subnet",
              "If prompted, select the correct controller from the discovered list"
            ]},
            { type: "heading", text: "Remote Connection" },
            { type: "steps", items: [
              "Select <strong>Remote Connection via Ethernet</strong>",
              "Enter the PLC's IP address in the connection settings",
              "Ensure your laptop's IP address has the same first three octets",
              "Click <strong>Connect</strong>"
            ]},
            { type: "paragraph", text: "If Ethernet fails, try <strong>Direct Connection via USB</strong> as a backup — connect a USB cable from your laptop to the PLC's USB port." },
            { type: "heading", text: "Verifying Online Status" },
            { type: "paragraph", text: "When connected, the Sysmac Studio toolbar shows a green 'Online' indicator. The project tree updates to show the live controller status. Verify the RUN LED on the physical PLC matches what software reports." }
          ]
        },
        {
          id: 3,
          title: "Connecting to Allen Bradley (Studio 5000)",
          summary: "Who Active, going online, and navigating Studio 5000",
          content: [
            { type: "paragraph", text: "Studio 5000 Logix Designer is the programming environment for Allen Bradley CompactLogix and ControlLogix controllers. Request via self-service (reference SR-124812). IT installs via BeyondTrust." },
            { type: "heading", text: "Connection Steps" },
            { type: "steps", items: [
              "Set your IP address to the same subnet as the controller (e.g., PLC is 192.168.1.100, set laptop to 192.168.1.50)",
              "Open Studio 5000 and open the project file (.ACD)",
              "Go to <strong>Communications > Who Active</strong> (or press Ctrl+W in RSLinx)",
              "Expand the Ethernet driver to browse the network — the controller should appear",
              "Right-click the controller and select <strong>Go Online</strong>",
              "The software will compare the offline project to the online program — review any differences"
            ]},
            { type: "callout", variant: "warning", title: "Online vs. Offline Mismatch", text: "If the offline project doesn't match what's in the controller, Studio 5000 will warn you. Always upload from the controller first to get the current program before making changes." }
          ]
        },
        {
          id: 4,
          title: "Connecting to AutomationDirect (Productivity Suite)",
          summary: "Ethernet connection and program access for Productivity PLCs",
          content: [
            { type: "paragraph", text: "Productivity Suite is free to download from AutomationDirect.com. Confirm the version matches the PLC firmware (P1000, P2000, or P3000 series)." },
            { type: "heading", text: "Connection Steps" },
            { type: "steps", items: [
              "Connect an Ethernet cable from your laptop to the PLC's Ethernet port (or a switch on the same network)",
              "Set your IP to the same subnet as the PLC",
              "Open Productivity Suite and select <strong>Connect</strong> from the toolbar",
              "Enter the PLC's IP address when prompted",
              "The software connects and shows the live program status"
            ]},
            { type: "heading", text: "Viewing Live Data" },
            { type: "paragraph", text: "Once online, go to <strong>View > Data View</strong> to see a live table of all tag values — I/O points, memory bits, timers, and counters. Filter by name to find specific tags." }
          ]
        },
        {
          id: 5,
          title: "Program Backup & Restore",
          summary: "How to upload (backup) and download programs — the most important habit you'll build",
          content: [
            { type: "callout", variant: "danger", title: "The #1 Rule", text: "ALWAYS upload (backup) the current program from the PLC to your laptop BEFORE making any changes. This is non-negotiable on production machines." },
            { type: "heading", text: "Uploading (Backup) a Program" },
            { type: "paragraph", text: "Uploading reads the current program from the PLC to your laptop. Do this every time before you modify anything." },
            { type: "table", headers: ["Platform", "Steps"],
              rows: [
                ["Omron Sysmac Studio", "Go online → Transfer > Upload from Controller → Save project with descriptive name"],
                ["AB Studio 5000", "Go online → Upload → Save .ACD file with date and machine name"],
                ["Productivity Suite", "Connect → File > Read Project from PLC → Save with descriptive name"]
              ]
            },
            { type: "heading", text: "File Naming Convention" },
            { type: "paragraph", text: "Use a consistent naming format: <code>[MachineName]_[PLCType]_[Date]_[Reason].ext</code>" },
            { type: "paragraph", text: "Example: <code>CobotReamer_NX1P2_20260407_PreMaintenance.smc2</code>" },
            { type: "heading", text: "Downloading (Restore) a Program" },
            { type: "paragraph", text: "Downloading writes a program from your laptop to the PLC. This replaces the running program and is only done for intentional changes or restoration after a failure." },
            { type: "callout", variant: "warning", title: "Production Impact", text: "Downloading to a production PLC will interrupt the running program. Coordinate with production before any download. On the training bench, downloads are safe to practice." }
          ]
        }
      ],
      quiz: [
        { question: "A PLC has IP address 192.168.5.20 with subnet mask 255.255.255.0. Which laptop IP would allow communication?", options: ["10.0.0.50", "192.168.1.50", "192.168.5.50", "192.168.5.20"], correct: 2, explanation: "With subnet 255.255.255.0, the first three octets must match (192.168.5.x). The last octet must be different from the PLC (not .20). 192.168.5.50 is correct." },
        { question: "You try to ping the PLC but get 'Request timed out.' What should you check first?", options: ["Reinstall the PLC software", "Reboot the PLC", "Verify your IP address, check the cable connection, and confirm link lights are on", "Call IT"], correct: 2, explanation: "Start with the basics: verify your IP is on the correct subnet, confirm the Ethernet cable is plugged in and link lights are active on both ends, then work from there." },
        { question: "Before modifying a program on a production PLC, what must you ALWAYS do first?", options: ["Get supervisor approval", "Upload (backup) the current program", "Switch the PLC to PROGRAM mode", "Disconnect the HMI"], correct: 1, explanation: "Always upload/backup the current program before making any changes. This ensures you can restore the original if something goes wrong." },
        { question: "What is the keyboard shortcut to browse the network in Studio 5000?", options: ["Ctrl+W (Who Active via RSLinx)", "Ctrl+B", "F5", "Ctrl+Enter"], correct: 0, explanation: "Ctrl+W opens Who Active in RSLinx, which lets you browse the Ethernet network and discover Allen Bradley controllers." }
      ],
      demoBreaks: [
        { after: "IP Address Configuration", title: "Physical Connection Walkthrough", duration: "10 min", description: "Physically connect an Ethernet cable from laptop to the Omron NX1P2. Show link lights on both ends. Open Command Prompt, ping the PLC — show success. Change one octet to demonstrate a failed ping.", activity: "Students take turns plugging in the cable, verifying link lights, and running a ping test. Each experiences at least one failed and one successful ping." },
        { after: "Connecting to AutomationDirect (Productivity Suite)", title: "Live Online — All Three Platforms", duration: "15 min", description: "With the laptop connected, go online with each platform in sequence: Sysmac Studio → NX1P2, Studio 5000 → CompactLogix, Productivity Suite → P2000. Show the online indicator and matching RUN LED.", activity: "Students note the different workflows for each platform and observe visual confirmation (software indicator + physical LED)." },
        { after: "Program Backup & Restore", title: "Program Upload (Backup)", duration: "10 min", description: "Perform a full upload from PLC to laptop. Save with a proper filename. Show file location. Emphasize: do this EVERY TIME before changing anything on production equipment.", activity: "Students perform the upload on at least one platform and verify the saved file exists." }
      ]
    },

    {
      id: 4,
      title: "Reading & Troubleshooting Logic",
      hours: 3.5,
      format: "Hands-on Lab",
      icon: "search",
      description: "Using I/O dashboards, tag browsers, and ladder logic editors to trace signals and diagnose faults across all three platforms.",
      objectives: [
        "Apply the 5-layer fault isolation model to systematically troubleshoot PLC issues",
        "Navigate the I/O dashboard to view real-time signal status",
        "Trace a signal from physical input through ladder logic to physical output",
        "Use forcing and monitoring tools safely and effectively",
        "Understand data types, tag structure, and variable scoping"
      ],
      lessons: [
        {
          id: 1,
          title: "Structured Troubleshooting Methodology",
          summary: "The 5-layer fault isolation model — a repeatable framework for diagnosis",
          content: [
            { type: "paragraph", text: "Before diving into software tools, you need a systematic troubleshooting method. Random poking at the PLC wastes time. The 5-layer model isolates the fault location before you start fixing." },
            { type: "heading", text: "The 5-Layer Fault Isolation Model" },
            { type: "paragraph", text: "When something isn't working, the fault exists in one of five layers. Work through them in order:" },
            { type: "steps", items: [
              "<strong>Physical Device</strong> — Is the field device itself working? Check sensor LEDs, listen for relay clicks, verify mechanical operation.",
              "<strong>Wiring</strong> — Is the signal getting from the device to the PLC? Check terminal block connections, measure voltage with a multimeter, verify wire continuity.",
              "<strong>I/O Module</strong> — Is the PLC module receiving/sending the signal? Check channel LEDs on the I/O card. A lit LED means the module sees the signal.",
              "<strong>PLC Logic</strong> — Is the program processing the signal correctly? Go online and trace the ladder rung. Is a contact preventing power flow? Is a timer stuck?",
              "<strong>Network/HMI</strong> — Is the information reaching the operator? Check HMI communication, verify tag mappings, confirm alarm configuration."
            ]},
            { type: "callout", variant: "info", title: "Key Principle", text: "<strong>Software tells you what the PLC thinks it sees. A multimeter tells you what's actually there.</strong> Always verify physical reality against software status. If they disagree, the truth is in the physical measurement." },
            { type: "heading", text: "Half-Split Troubleshooting" },
            { type: "paragraph", text: "Start at the midpoint of the signal path to halve your search space. If the I/O module LED is lit (layer 3 is good), the problem is either in logic (layer 4) or HMI (layer 5) — you've eliminated layers 1–3 in one check." }
          ]
        },
        {
          id: 2,
          title: "Data Types & Tag Structure",
          summary: "Understanding BOOL, INT, REAL, and tag naming conventions",
          content: [
            { type: "paragraph", text: "Before reading tags in the I/O dashboard, you need to understand what you're looking at." },
            { type: "table", headers: ["Data Type", "Description", "Example"],
              rows: [
                ["BOOL", "True/False, ON/OFF, 1/0", "Proximity sensor state, push button state"],
                ["INT (16-bit)", "Whole number -32,768 to 32,767", "Counter values, small setpoints"],
                ["DINT (32-bit)", "Whole number ±2.1 billion", "High-speed counter values, encoder counts"],
                ["REAL (floating point)", "Decimal numbers", "Temperature (72.5°F), pressure (45.3 PSI)"],
                ["STRING", "Text", "HMI messages, recipe names"]
              ]
            },
            { type: "heading", text: "Tag Naming Conventions" },
            { type: "paragraph", text: "Good tag names follow a prefix-based convention that tells you the function area at a glance:" },
            { type: "list", items: [
              "<strong>SAFETY_EStop</strong> — safety function, E-stop circuit",
              "<strong>MOTION_AxisHome</strong> — motion control, axis home position",
              "<strong>HMI_CycleStart</strong> — HMI-triggered, cycle start command",
              "<strong>CONV_ProxSensor1</strong> — conveyor area, proximity sensor 1"
            ]},
            { type: "heading", text: "Global vs. Local Variables" },
            { type: "paragraph", text: "A <strong>global variable</strong> is accessible from any program block in the PLC project. A <strong>local (program-scoped) variable</strong> is only visible within its own routine. Most I/O tags and inter-program signals should be global. Temporary calculation variables can be local." }
          ]
        },
        {
          id: 3,
          title: "Reviewing Signals — Omron",
          summary: "I/O dashboard, variable monitoring, and live logic viewing in Sysmac Studio",
          content: [
            { type: "heading", text: "The I/O Dashboard" },
            { type: "paragraph", text: "Open the I/O dashboard to see all input and output signals in a single view. Key columns:" },
            { type: "list", items: [
              "<strong>Node column:</strong> Which I/O node/module the signal is connected to. If blank, it's a global variable defined in logic.",
              "<strong>Variable name:</strong> The tag name used in the ladder logic",
              "<strong>Current value:</strong> Live value — TRUE/FALSE for BOOL, numeric for INT/REAL"
            ]},
            { type: "heading", text: "Live Logic Viewing" },
            { type: "steps", items: [
              "Go to the <strong>Programs</strong> tab and expand it",
              "Double-click a program/routine to open the ladder logic editor",
              "Click the <strong>Monitor</strong> button (or toggle to online view) to see live values",
              "Contacts that are passing power show as highlighted/colored",
              "Contacts that are blocking power show as not highlighted",
              "Find the rung that is not working and identify which contact is blocking power flow"
            ]},
            { type: "callout", variant: "tip", title: "Cross-Reference", text: "Right-click any tag in Sysmac Studio and select Cross Reference to see every rung where that tag is used. Essential for understanding complex programs." }
          ]
        },
        {
          id: 4,
          title: "Reviewing Signals — Allen Bradley",
          summary: "Monitor Tags, Tag Browser, and ladder logic tracing in Studio 5000",
          content: [
            { type: "heading", text: "I/O Configuration" },
            { type: "paragraph", text: "In the Controller Organizer (left panel), expand <strong>I/O Configuration</strong>. Click any I/O module to view tag values mapped to that module. This shows you the physical layer — what the module is actually receiving." },
            { type: "heading", text: "Monitor Tags" },
            { type: "paragraph", text: "Go to <strong>Logic > Monitor Tags</strong> (or press Ctrl+W while online). The Tag Browser shows all tags with live values. Filter by name, data type, or scope." },
            { type: "heading", text: "Tracing Ladder Logic" },
            { type: "paragraph", text: "Open a routine and go online. Studio 5000 highlights the power flow through each rung in green. Work left to right on a rung to find which contact is blocking power (not highlighted). That contact's input condition is the one preventing the output from energizing." },
            { type: "heading", text: "Forcing I/O" },
            { type: "paragraph", text: "Right-click a tag in Monitor Tags and select Force ON or Force OFF. <strong>Forces override the physical signal</strong> — use with extreme caution." },
            { type: "callout", variant: "danger", title: "Force Safety", text: "Forcing an output ON bypasses all safety logic. Only force I/O for diagnostic purposes on a locked-out/safe machine. Always remove all forces when done — check the force indicator in the status bar. A forgotten force on a production machine can cause serious injury." }
          ]
        },
        {
          id: 5,
          title: "Reviewing Signals — Productivity Suite",
          summary: "Data View, live monitoring, and signal tracing in Productivity Suite",
          content: [
            { type: "heading", text: "Data View" },
            { type: "paragraph", text: "Go to <strong>View > Data View</strong> (or click the Data View tab at the bottom). This shows a live table of all tag values: I/O points, internal memory bits, timers, and counters. The \"Current Value\" column updates in real time — discrete inputs show 0 (off) or 1 (on)." },
            { type: "heading", text: "Signal Tracing" },
            { type: "paragraph", text: "Open the ladder program and go online. Like the other platforms, power flow is visually highlighted. Identify blocked rungs by finding contacts that are not passing power, then investigate the associated physical device or upstream logic." },
            { type: "paragraph", text: "Toggle a physical device and confirm the value changes in Data View to verify signal continuity from the field through to the PLC." }
          ]
        }
      ],
      quiz: [
        { question: "In the 5-layer fault isolation model, what is Layer 1?", options: ["PLC Logic", "Physical Device", "Wiring", "I/O Module"], correct: 1, explanation: "Layer 1 is the Physical Device — check if the field device itself is working (sensor LED lit, relay clicking, mechanical operation) before looking at anything else." },
        { question: "A PLC input tag shows 0, but you measure 24VDC at the I/O module terminal with a multimeter. What layer has the fault?", options: ["Layer 1 — Physical Device", "Layer 2 — Wiring", "Layer 3 — I/O Module", "Layer 4 — PLC Logic"], correct: 2, explanation: "If 24VDC is present at the terminal but the PLC tag shows 0, the I/O module itself may be faulty or misconfigured — the module is receiving voltage but not registering it." },
        { question: "What does it mean when a contact is highlighted/colored in online ladder logic view?", options: ["The contact has an error", "The contact is forcing the output OFF", "The contact is passing power (its condition is TRUE)", "The contact has been modified recently"], correct: 2, explanation: "In online mode, highlighted contacts are TRUE and passing power through the rung. Non-highlighted contacts are FALSE and blocking power flow." },
        { question: "What is the danger of forgetting to remove a forced output?", options: ["It wastes PLC memory", "It slows down the scan cycle", "The output will stay ON regardless of safety logic, potentially causing injury", "It corrupts the program file"], correct: 2, explanation: "A forced output bypasses all programmatic control, including safety interlocks. If forgotten, a machine could start or move unexpectedly." },
        { question: "A REAL data type tag reads 72.5. What kind of value could this represent?", options: ["A Boolean state (ON/OFF)", "A counter value", "A temperature, pressure, or other continuous measurement", "An error code"], correct: 2, explanation: "REAL (floating point) data types store decimal values and are commonly used for analog measurements like temperature, pressure, level, and flow readings." }
      ],
      demoBreaks: [
        { after: "Structured Troubleshooting Methodology", title: "Physical Input → Software Response", duration: "10 min", description: "With the I/O dashboard open on the projected screen and the bench visible, have a student activate the proximity sensor. The class watches the tag change in real time.", activity: "Students take turns activating inputs while the class calls out which tag changed. Repeat with limit switch and push button. Then reverse — show an output tag and watch the physical device." },
        { after: "Reviewing Signals — Allen Bradley", title: "Force I/O — See It, Respect It", duration: "10 min", description: "Force an output ON — students watch the light tower illuminate even though no logic commands it. Then force an input. Then remove forces and show normal operation.", activity: "Students observe the physical result of forcing. Trainer asks: 'What could go wrong if you force an output ON and forget?' Students locate the force indicator in each platform." },
        { after: "Reviewing Signals — Productivity Suite", title: "Planted Fault — Full Signal Trace", duration: "15 min", description: "Trainer pre-plants a fault (disconnected proximity sensor wire). Walk through the 5-layer model live: check output → check logic → check input tag → check module LED → check wiring → find disconnected wire.", activity: "Students follow along and call out observations at each step. Guided walkthrough before independent scenarios in Module 7." }
      ]
    },

    {
      id: 5,
      title: "Area Scanner Programming",
      hours: 2.5,
      format: "Hands-on Lab",
      icon: "radar",
      description: "Programming and verifying the Omron OS32C area scanner — defining safety zones, configuring OSSD outputs, and physical verification.",
      objectives: [
        "Program or verify the configuration of an Omron OS32C area scanner",
        "Define protective and warning zones using the OS32C Configuration Tool",
        "Confirm OSSD outputs are functioning correctly via PLC monitoring",
        "Physically verify zone boundaries with measurement"
      ],
      lessons: [
        {
          id: 1,
          title: "OS32C Configuration Tool Setup",
          summary: "Installing the tool, connecting via USB, and reading existing configurations",
          content: [
            { type: "heading", text: "Install the Configuration Tool" },
            { type: "paragraph", text: "Download the OS32C Configuration Tool from Omron's website. Requires Windows 10/11." },
            { type: "heading", text: "Connect to the Scanner" },
            { type: "steps", items: [
              "Connect a USB cable from your laptop to the mini-USB port on the OS32C",
              "Open the Configuration Tool and select the correct COM port",
              "Click <strong>Connect</strong>",
              "Click <strong>Read from Device</strong> to load the current zone configuration"
            ]},
            { type: "paragraph", text: "The configuration tool shows the scanner's detection field as a top-down polar view. Existing zones appear as colored overlays." }
          ]
        },
        {
          id: 2,
          title: "Defining Safety Zones",
          summary: "Creating protective and warning zones, configuring detection parameters",
          content: [
            { type: "heading", text: "Zone Types" },
            { type: "table", headers: ["Zone", "Purpose", "Response"],
              rows: [
                ["Protective Zone", "Immediate danger area around the machine", "OSSD outputs drop immediately — machine stops"],
                ["Warning Zone", "Approach area outside the protective zone", "Warning output activates (alarm, slow-down) but OSSD stays active"]
              ]
            },
            { type: "heading", text: "Defining Zone Boundaries" },
            { type: "steps", items: [
              "Select the zone type to edit (protective or warning)",
              "Draw the zone boundary using the polygon or radius tool in the configuration software",
              "Set the detection sensitivity (minimum object size) — typically 30–70mm for personnel detection",
              "Configure multiple zone sets if the machine requires different safety zones for different operating modes",
              "Download the configuration to the scanner and verify the new zones are active"
            ]},
            { type: "callout", variant: "warning", title: "Zone Validation Required", text: "After any zone change, you must physically verify the boundaries. Walk toward the scanner from multiple angles and confirm the protective zone triggers at the correct distance. Measure with a tape measure and compare to the configured boundary." }
          ]
        },
        {
          id: 3,
          title: "OSSD Testing & Verification",
          summary: "Confirming safety outputs are properly wired and functioning",
          content: [
            { type: "heading", text: "OSSD Verification Procedure" },
            { type: "steps", items: [
              "With the scanner configuration active, confirm both OSSD1 and OSSD2 outputs are wired to the PLC safety input or safety relay",
              "Open the PLC software and go online — monitor the safety input tags mapped to the OSSD outputs",
              "With the zone clear, verify both OSSD tags show TRUE (both channels active)",
              "Have a person enter the protective zone — verify both OSSD tags drop to FALSE simultaneously",
              "Remove the person from the zone — verify both OSSD tags return to TRUE",
              "Confirm the downstream safety circuit responds correctly (machine enabled/disabled)"
            ]},
            { type: "callout", variant: "danger", title: "Single-Channel Failure Test", text: "If your safety system allows it, test single-channel failure: temporarily disconnect one OSSD wire. The safety relay should detect the channel disagreement and lock out. If the machine continues to run on one channel only, the safety wiring is incorrect and must be fixed immediately." },
            { type: "heading", text: "Scanner LED Status" },
            { type: "table", headers: ["LED State", "Meaning"],
              rows: [
                ["Green steady", "Normal operation — zone clear"],
                ["Yellow steady", "Warning zone intrusion detected"],
                ["Red steady", "Protective zone intrusion — OSSD dropped"],
                ["Red flashing", "Scanner fault or configuration error"]
              ]
            }
          ]
        }
      ],
      quiz: [
        { question: "What happens when an object enters the protective zone of an area scanner?", options: ["A warning alarm sounds but the machine continues", "The OSSD outputs drop and the machine stops", "The scanner displays an error message", "Nothing — the operator must press E-stop"], correct: 1, explanation: "When the protective zone is breached, both OSSD outputs immediately drop to OFF, which triggers the safety relay/circuit to stop the machine." },
        { question: "After changing zone boundaries in the configuration tool, what must you do?", options: ["Just click Save and the scanner updates automatically", "Download to the scanner AND physically verify the new boundaries with measurement", "Reboot the PLC", "Replace the scanner batteries"], correct: 1, explanation: "Zone changes must be downloaded to the scanner, and the new boundaries must be physically verified by walking toward the scanner and measuring actual trigger distances." },
        { question: "The area scanner's LED is flashing red. What does this mean?", options: ["Normal operation — zone is clear", "Warning zone intrusion", "Scanner fault or configuration error", "Low battery"], correct: 2, explanation: "A flashing red LED indicates a scanner fault or configuration error that must be resolved before the scanner can provide safety protection." }
      ],
      demoBreaks: [
        { after: "OS32C Configuration Tool Setup", title: "USB Connection & Live Scan View", duration: "10 min", description: "Connect USB to the OS32C on the bench. Open the configuration tool and show the live scan view. Have students walk at various distances to see themselves in the scan display.", activity: "Students walk toward and away from the scanner, watching the detection point move in real time. Makes the concept of detection zones tangible." },
        { after: "OSSD Testing & Verification", title: "Zone Programming & Physical Verification", duration: "15 min", description: "Modify a warning zone boundary, download to the scanner, then physically verify with a student approaching. Show the OSSD output state change on the PLC dashboard simultaneously.", activity: "Students measure actual trigger distance with a tape measure and compare to configured distance. Verify both scanner LED and PLC input state change." }
      ]
    },

    {
      id: 6,
      title: "HMI Navigation & Fault Clearing",
      hours: 2.5,
      format: "Lecture + Lab",
      icon: "layout",
      description: "Operating the HMI screen — login, alarm management, I/O status monitoring, and fault clearing procedures.",
      objectives: [
        "Log into an HMI screen and navigate between key screens",
        "View and interpret active alarms and fault history",
        "Clear faults and reset the machine after a safe condition is restored",
        "Use the I/O status screen to verify field device communication",
        "Manually jog or operate outputs for maintenance testing"
      ],
      lessons: [
        {
          id: 1,
          title: "HMI Overview & Login",
          summary: "What an HMI is, screen navigation, and user access levels",
          content: [
            { type: "heading", text: "What is an HMI?" },
            { type: "image", src: "images/hmi_screen.png", alt: "HMI Screen", caption: "HMI screen — the operator's window into the PLC system" },
            { type: "paragraph", text: "HMI stands for Human-Machine Interface. It's a touchscreen panel that lets the operator monitor and control the PLC system in real time. Common brands on site: Omron NB/NA series, Allen Bradley PanelView, AutomationDirect C-more." },
            { type: "heading", text: "Logging In" },
            { type: "steps", items: [
              "Touch the screen to wake it — the home/overview screen will display",
              "Look for a padlock icon, user icon, or \"Login\" button (typically upper-right corner)",
              "Enter credentials using the on-screen keypad (check machine binder for default maintenance credentials)",
              "Press Enter or OK to log in"
            ]},
            { type: "heading", text: "User Access Levels" },
            { type: "table", headers: ["Level", "Typical Users", "Permissions"],
              rows: [
                ["Operator", "Production operators", "View status, clear minor alarms, start/stop cycles"],
                ["Maintenance", "Maintenance technicians", "View I/O status, clear faults, manual jog, adjust setpoints"],
                ["Engineering", "Controls engineers, automation lead", "Full access — modify screens, change configurations, adjust safety parameters"]
              ]
            }
          ]
        },
        {
          id: 2,
          title: "Alarm Management & Fault Clearing",
          summary: "Reading alarms, understanding fault codes, and restoring normal operation",
          content: [
            { type: "heading", text: "Viewing Active Alarms" },
            { type: "paragraph", text: "Navigate to the Alarms screen (often a bell icon or dedicated Alarms button). Active alarms display the alarm code, description, timestamp, and associated tag name. Most recent alarms appear at the top." },
            { type: "heading", text: "Fault Clearing Procedure" },
            { type: "steps", items: [
              "<strong>Read the alarm</strong> — note the alarm code, description, and timestamp. Take a photo for documentation.",
              "<strong>Identify the root cause</strong> — use the alarm description and tag name to determine what triggered the fault. Open PLC software if needed to trace the associated logic.",
              "<strong>Correct the physical condition</strong> — clear an obstruction, replace a sensor, reset a safety device, fix a wiring issue. Never clear an alarm without addressing the cause.",
              "<strong>Clear the alarm on the HMI</strong> — select the alarm and press Clear/Reset. Some alarms require the fault condition to be gone before they can be cleared.",
              "<strong>Verify normal operation</strong> — confirm the alarm doesn't immediately return and the machine enters Ready state."
            ]},
            { type: "callout", variant: "danger", title: "Never 'Clear and Hope'", text: "Clearing an alarm without fixing the underlying cause is a recipe for recurring faults, production downtime, and potential safety incidents. If the alarm comes back after clearing, the root cause hasn't been resolved." },
            { type: "heading", text: "I/O Status Screen" },
            { type: "paragraph", text: "The I/O status screen shows real-time states of all inputs and outputs. Use it to verify sensors are communicating, outputs are energizing, and the physical world matches what the PLC reports." }
          ]
        },
        {
          id: 3,
          title: "Manual Control & Setpoint Adjustment",
          summary: "Jogging outputs, testing devices, and adjusting parameters from the HMI",
          content: [
            { type: "heading", text: "Manual Jog/Output Control" },
            { type: "paragraph", text: "During maintenance, you may need to manually operate individual outputs — jog a motor, extend a cylinder, energize a solenoid — for testing or positioning. This is done from the HMI's Manual Control screen (maintenance access required)." },
            { type: "callout", variant: "warning", title: "Safety First", text: "Manual mode bypasses the normal automatic sequence. Ensure the area is clear, safety guards are functional, and all personnel are aware before jogging any output." },
            { type: "heading", text: "Setpoint Adjustment" },
            { type: "paragraph", text: "Timers, counters, speed references, and recipe parameters can be adjusted from the HMI. Always note the original value before changing it. Changes take effect immediately on most systems." }
          ]
        }
      ],
      quiz: [
        { question: "What is the correct order for clearing a fault on the HMI?", options: ["Clear the alarm first, then investigate the cause", "Read the alarm → Identify and fix the root cause → Clear the alarm → Verify normal operation", "Restart the PLC → Clear all alarms → Resume production", "Call the supervisor and wait"], correct: 1, explanation: "Always identify and fix the root cause before clearing the alarm. Clearing first without fixing leads to recurring faults." },
        { question: "The HMI shows three access levels. What can a Maintenance-level user do that an Operator cannot?", options: ["View production statistics", "Access I/O status, clear faults, manual jog, and adjust setpoints", "Modify HMI screens", "Nothing — they have the same access"], correct: 1, explanation: "Maintenance access adds I/O status viewing, advanced fault clearing, manual output control, and setpoint adjustment beyond basic operator functions." },
        { question: "An alarm appears on the HMI. You clear it, but it immediately returns. What does this mean?", options: ["The HMI is malfunctioning", "The root cause of the fault has not been resolved", "You need to restart the PLC", "The alarm has a 5-minute timeout"], correct: 1, explanation: "A recurring alarm after clearing means the underlying fault condition is still present. You must fix the physical cause before the alarm will stay cleared." }
      ],
      demoBreaks: [
        { after: "HMI Overview & Login", title: "Live HMI Walkthrough", duration: "10 min", description: "At the bench HMI, log in, navigate to key screens: overview, I/O status, alarms, manual control. Activate a proximity sensor and show the I/O status screen reflect it.", activity: "Each student navigates to a different screen on the HMI. Students confirm they can find the I/O status screen and identify physical device states." },
        { after: "Alarm Management & Fault Clearing", title: "Fault Injection → Alarm → Clearance", duration: "15 min", description: "Trainer creates a fault (blocks area scanner). Walk through: read alarm → identify cause → clear obstruction → clear alarm → verify normal operation.", activity: "After trainer demo, each student performs the full cycle: trainer injects a fault → student reads alarm → fixes physical cause → clears alarm → verifies." }
      ]
    },

    {
      id: 7,
      title: "Scenario-Based Fault Exercises",
      hours: 4,
      format: "Lab / Assessment",
      icon: "wrench",
      description: "Five realistic fault scenarios pre-staged on the bench. Diagnose and resolve each independently using the skills from Modules 1–6.",
      objectives: [
        "Independently diagnose and resolve a tripped area scanner fault",
        "Identify and correct an IP connectivity failure",
        "Trace a missing sensor signal from PLC to field device",
        "Identify a logic fault (incorrect timer preset) by tracing the ladder rung",
        "Replace a faulty push button and verify proper operation"
      ],
      lessons: [
        {
          id: 1,
          title: "How Scenarios Work",
          summary: "Structure, expectations, and grading criteria for fault exercises",
          content: [
            { type: "paragraph", text: "Each scenario is pre-staged on the bench by the instructor. You receive only a symptom description — no hints about the cause. Your job is to diagnose and resolve the fault independently using the tools and methods from Modules 1–6." },
            { type: "heading", text: "Exercise Structure" },
            { type: "table", headers: ["Phase", "Duration", "Activity"],
              rows: [
                ["Briefing", "5 min", "Trainer describes the symptom. You discuss your troubleshooting plan before touching anything."],
                ["Execution", "25–30 min", "Work independently (or in pairs) on the bench. Trainer observes but doesn't assist unless safety is at risk."],
                ["Debrief", "10 min", "Group discussion: What did you find? What steps did you take? Trainer reveals the planted fault and the ideal path."]
              ]
            },
            { type: "callout", variant: "info", title: "Success Criteria", text: "You must resolve each scenario within the time limit. Assessment looks at: correct fault identification, logical troubleshooting sequence (not random guessing), proper tool usage, and safe work practices throughout." }
          ]
        }
      ],
      quiz: [],
      demoBreaks: []
    },

    {
      id: 8,
      title: "Advanced Manufacturing Specifics",
      hours: 3.5,
      format: "Lecture + Discussion",
      icon: "layers",
      description: "Custom machine documentation, ladder logic building blocks, servo motor configuration, global variables, and adding I/O components to a PLC.",
      objectives: [
        "Locate and use custom build documentation for Vermeer machines",
        "Understand core ladder logic instructions and their symbols",
        "Configure basic servo motor parameters in Sysmac Studio",
        "Create and use global variables with proper naming conventions",
        "Add I/O modules and devices to an existing PLC configuration"
      ],
      lessons: [
        {
          id: 1,
          title: "Custom Machine Documentation",
          summary: "Where to find documentation for Cobot Carbide Tower, Cobot Reamer, Servo Motor, and Rodloader",
          content: [
            { type: "paragraph", text: "All custom build documentation is stored on the shared network drive under: <strong>Engineering > Custom Builds > [Machine Name]</strong>. Always check here first before making any changes." },
            { type: "table", headers: ["Machine", "Key Documents"],
              rows: [
                ["Cobot Carbide Tower", "Wiring diagrams, Omron NX1P2 PLC program, Sysmac Studio project file, robot cell layout. Check revision history for latest approved version."],
                ["Cobot Reamer", "Task program, EtherCAT slave configuration, tooling offset table, safety zone drawings."],
                ["Servo Motor Incorporation", "Axis mapping spreadsheet, drive parameter backup file, mechanical coupling specs, motion profile documentation."],
                ["Rodloader", "Full wiring package, Productivity Suite project, I/O assignment list, sequence of operations document."]
              ]
            },
            { type: "callout", variant: "warning", title: "Revision Control", text: "Always verify you are working from the latest revision. Outdated documentation leads to incorrect troubleshooting and wasted time." }
          ]
        },
        {
          id: 2,
          title: "Ladder Logic Building Blocks — Part 1",
          summary: "Core instructions: contacts, coils, latches, timers, and counters",
          content: [
            { type: "heading", text: "Contacts and Coils" },
            { type: "table", headers: ["Instruction", "Symbol", "Function"],
              rows: [
                ["Normally Open (XIC/NO)", "--[ ]--", "Passes power when the referenced bit is ON (1). Checks if an input is active."],
                ["Normally Closed (XIO/NC)", "--[/]--", "Passes power when the referenced bit is OFF (0). Blocks logic when a fault/interlock is active."],
                ["Output Coil (OTE)", "--( )--", "Sets the referenced bit ON when the rung has power. Turns OFF when power is lost."],
                ["Latch (OTL)", "--(L)--", "Sets the bit ON and it stays ON even after the rung loses power. Requires an unlatch to turn off."],
                ["Unlatch (OTU)", "--(U)--", "Turns off a latched bit. Used in pairs with OTL for start/stop logic."]
              ]
            },
            { type: "heading", text: "Timers" },
            { type: "table", headers: ["Timer", "Function", "Common Use"],
              rows: [
                ["TON (Timer On-Delay)", "Starts counting when rung is true. DN bit turns ON after preset time.", "Debounce sensors, sequence delays, dwell times"],
                ["TOF (Timer Off-Delay)", "Starts counting when rung goes false. DN bit stays ON for preset time after rung goes false.", "Cooldown periods, coast-down timing"],
                ["RTO (Retentive Timer)", "Like TON but accumulator retains value when rung goes false. Must use RES to reset.", "Total run-time tracking, accumulated process time"]
              ]
            },
            { type: "heading", text: "Counters" },
            { type: "table", headers: ["Counter", "Function", "Common Use"],
              rows: [
                ["CTU (Count Up)", "Increments by 1 each time the rung transitions from false to true. DN bit turns ON at preset.", "Part counting, cycle counting"],
                ["CTD (Count Down)", "Decrements by 1 each transition. DN bit turns ON when accumulator reaches zero.", "Batch remaining count, magazine count"]
              ]
            }
          ]
        },
        {
          id: 3,
          title: "Ladder Logic Building Blocks — Part 2",
          summary: "Comparison, math, move instructions, and other function blocks",
          content: [
            { type: "heading", text: "Comparison Instructions" },
            { type: "paragraph", text: "Comparison instructions evaluate two values and pass power if the condition is true:" },
            { type: "table", headers: ["Instruction", "Meaning", "Example"],
              rows: [
                ["EQU", "Equal", "Check if counter = target value"],
                ["NEQ", "Not Equal", "Check if status flag has changed"],
                ["GRT", "Greater Than", "Check if temperature exceeds limit"],
                ["LES", "Less Than", "Check if pressure is below minimum"],
                ["GEQ", "Greater Than or Equal", "Check if timer accumulator >= setpoint"],
                ["LEQ", "Less Than or Equal", "Check if speed is within range"]
              ]
            },
            { type: "heading", text: "Math & Move Instructions" },
            { type: "list", items: [
              "<strong>MOV (Move):</strong> Copies a value from Source to Destination. Used for loading setpoints, copying recipes, and resetting accumulators.",
              "<strong>ADD / SUB / MUL / DIV:</strong> Arithmetic on tag values. Used for scaling analog signals, calculating rates, and batch arithmetic.",
              "<strong>CPT (Compute):</strong> Evaluates a formula expression. Useful for complex calculations in a single instruction."
            ]}
          ]
        },
        {
          id: 4,
          title: "Servo Motor Configuration",
          summary: "Setting up servo axes in Omron Sysmac Studio over EtherCAT",
          content: [
            { type: "heading", text: "Adding a Servo Axis" },
            { type: "steps", items: [
              "In the Sysmac Studio project tree, go to <strong>Motion Control > Axes</strong>",
              "Right-click and add a new <strong>Servo Axis</strong>",
              "Assign it to the EtherCAT node number matching the physical drive (check drive's rotary switches or DIP settings)"
            ]},
            { type: "heading", text: "Unit Conversion Settings" },
            { type: "paragraph", text: "Under Axis Parameters > Unit Conversion, configure:" },
            { type: "list", items: [
              "Encoder pulses per revolution",
              "User units (mm, degrees, inches) per motor revolution",
              "Gear ratio if a gearbox is present"
            ]},
            { type: "heading", text: "Key Parameters" },
            { type: "table", headers: ["Parameter", "What It Controls", "Risk if Wrong"],
              rows: [
                ["Max Velocity", "Speed limit for the axis", "Too fast = mechanical damage, too slow = cycle time loss"],
                ["Acceleration / Deceleration", "Ramp rates", "Too aggressive = motor faults, too gentle = slow response"],
                ["Position Limits", "Software travel limits", "Prevents axis from moving beyond mechanical range"],
                ["Torque Limit", "Maximum motor force", "Too high = potential to damage tooling or workpiece"]
              ]
            },
            { type: "callout", variant: "warning", title: "Parameter Changes on Production", text: "Never change servo parameters on a production machine without comparing to the documented values first. Small changes to acceleration or position limits can cause crashes, product damage, or injury." }
          ]
        },
        {
          id: 5,
          title: "Global Variables & Adding Components",
          summary: "Creating global variables, naming conventions, and adding I/O modules",
          content: [
            { type: "heading", text: "Creating Global Variables" },
            { type: "paragraph", text: "Global variables are accessible from any program block in the PLC project. In <strong>Omron Sysmac Studio</strong>, define them in the Global Variable Table. In <strong>Allen Bradley Studio 5000</strong>, these are Controller-scoped tags." },
            { type: "heading", text: "Naming Convention" },
            { type: "paragraph", text: "Use a function area prefix for instant clarity:" },
            { type: "list", items: [
              "<strong>SAFETY_</strong> — E-stop, safety relay, scanner signals",
              "<strong>MOTION_</strong> — Servo axis commands and feedback",
              "<strong>HMI_</strong> — Operator interface signals",
              "<strong>CONV_</strong> — Conveyor system signals",
              "<strong>IO_</strong> — General I/O points"
            ]},
            { type: "heading", text: "Adding I/O Components" },
            { type: "table", headers: ["Platform", "Steps"],
              rows: [
                ["Omron (EtherCAT)", "Right-click EtherCAT master > Add Slave. Select from ESI library. Assign node address. Map tags to I/O channels in the I/O Map view."],
                ["Allen Bradley", "Right-click I/O Configuration > New Module. Search by catalog number. Set IP address and slot. Download and verify in I/O tree."],
                ["AutomationDirect", "Use the I/O Configuration wizard in Productivity Suite. Select module type, assign slot, map tags."]
              ]
            }
          ]
        }
      ],
      quiz: [
        { question: "A TON timer has a preset of 5000ms and the accumulator shows 5000ms. Is the DN (Done) bit ON or OFF?", options: ["OFF — the timer is still counting", "ON — the accumulator has reached the preset", "It depends on the rung state", "OFF — 5000ms means the timer has reset"], correct: 1, explanation: "When a TON timer's accumulator reaches or exceeds the preset value, the DN (Done) bit turns ON. 5000ms accumulated = 5000ms preset means done." },
        { question: "What is the difference between OTE (Output Coil) and OTL (Output Latch)?", options: ["They are the same", "OTE turns off when the rung loses power; OTL stays on until an OTU unlatch instruction", "OTL is faster than OTE", "OTE is used for digital, OTL for analog"], correct: 1, explanation: "OTE is non-retentive — it follows the rung state. OTL is retentive — once latched ON, it stays ON even if the rung goes false. An OTU instruction is required to turn it off." },
        { question: "Before changing servo motor parameters on a production machine, what should you do?", options: ["Just make the change — parameters auto-revert on restart", "Compare the current values to the documented values and backup the program first", "Switch the PLC to PROGRAM mode", "Disconnect the encoder"], correct: 1, explanation: "Always compare to documented values and backup the program before changing servo parameters. Incorrect parameters can cause mechanical crashes, product damage, or injury." },
        { question: "What prefix would you use for a global variable controlling an E-stop circuit?", options: ["CONV_", "MOTION_", "SAFETY_", "HMI_"], correct: 2, explanation: "Safety-related signals (E-stop, safety relays, scanner inputs) use the SAFETY_ prefix for immediate identification." }
      ],
      demoBreaks: [
        { after: "Servo Motor Configuration", title: "Servo Parameters — Live Adjustment", duration: "15 min", description: "On the EtherCAT servo drive, show current parameters. Make a safe change (reduce velocity by 50%), command a move, observe the difference. Restore original.", activity: "Students read parameters, predict what a change will do, observe the result, then restore. Reinforces the read → predict → verify → restore cycle." },
        { after: "Global Variables & Adding Components", title: "Add I/O Component End-to-End", duration: "15 min", description: "Walk through adding a new tag for an unused I/O point: create tag, map to physical channel, write a simple rung, download, test with physical device.", activity: "Students follow along on laptops, replicating the tag and rung. Each pair tests their logic on the bench — the capstone integrative activity." }
      ]
    }
  ],

  scenarios: [
    {
      id: 1,
      title: "Tripped Area Scanner — Machine Won't Start",
      objective: "Diagnose why the machine will not enter auto cycle. Identify the fault, clear the condition, reset the scanner, and restore cycle-ready state.",
      setup: "Instructor places a small object inside the area scanner's protective zone, holding the OSSD output low. The HMI shows 'Safety Circuit Fault.'",
      timeLimit: "15 minutes",
      steps: [
        "Read HMI alarm code and note the associated tag name",
        "Open PLC software and go online",
        "Find the safety circuit rung — confirm the scanner input tag is FALSE",
        "Physically inspect the scanner's detection zone",
        "Remove the obstruction from the protective zone",
        "Verify the scanner OSSD output returns to TRUE in the PLC",
        "Clear the fault on the HMI and verify the machine enters Ready state"
      ],
      successCriteria: "Participant correctly identifies the scanner input tag, removes obstruction, resets fault, and machine enters ready state within 15 minutes."
    },
    {
      id: 2,
      title: "Network/IP Issue — Cannot Connect to PLC",
      objective: "Diagnose why the laptop cannot connect to the Omron PLC. Correct the IP configuration and establish a successful online connection.",
      setup: "Instructor sets the laptop Ethernet adapter IP to the wrong subnet (e.g., 10.0.0.50 when PLC is 192.168.1.100). Sysmac Studio shows 'Connection Failed.'",
      timeLimit: "10 minutes",
      steps: [
        "Open Command Prompt and run ipconfig — note the current IP address",
        "Ping the PLC IP address — confirm no response",
        "Open Network Connections, identify the correct Ethernet adapter",
        "Change the IP address to the same subnet as the PLC (e.g., 192.168.1.50)",
        "Ping again — confirm successful response",
        "Open Sysmac Studio and connect to the PLC"
      ],
      successCriteria: "Participant correctly identifies and corrects the IP address, pings successfully, and connects to the PLC within 10 minutes."
    },
    {
      id: 3,
      title: "Proximity Sensor Signal Not Reaching PLC",
      objective: "A conveyor sequence is stuck because a proximity sensor signal is not reaching the PLC. Diagnose whether the fault is in the sensor, wiring, or PLC input channel.",
      setup: "Instructor disconnects a wire at the proximity sensor output terminal block (or loosens a wire nut). The PLC tag reads 0 even when a metal target is present at the sensor.",
      timeLimit: "20 minutes",
      steps: [
        "Identify the sensor tag name from the HMI alarm or I/O dashboard",
        "Go online in PLC software — confirm the input tag is 0",
        "Trigger the sensor manually — confirm sensor LED turns on (sensor works)",
        "Check the I/O module channel LED — if dark, the signal isn't reaching the module",
        "Measure voltage at the I/O module terminal with a multimeter",
        "Trace the wiring back from the module to the sensor terminal block",
        "Find and fix the disconnected wire",
        "Verify the PLC tag reads 1 when the sensor is triggered"
      ],
      successCriteria: "Participant uses sensor LED, multimeter, and PLC tag monitor to isolate the wiring fault and restore the signal within 20 minutes."
    },
    {
      id: 4,
      title: "Logic Fault — Output Not Energizing",
      objective: "An output (light tower or relay) is not energizing. Trace the ladder rung to identify which input condition is preventing the output.",
      setup: "Instructor changes a timer preset to an extremely long value (e.g., 30,000ms instead of 3,000ms). The downstream output never energizes because the timer DN bit never activates in normal observation time.",
      timeLimit: "20 minutes",
      steps: [
        "Open PLC software, go online, navigate to the affected program block",
        "Find the output coil that should be energizing",
        "Work left to right on the rung — identify which contact is not passing power",
        "Find the timer contact (DN bit) that is blocking — note the timer is still counting",
        "Check the timer preset value — recognize 30,000ms is abnormally long",
        "Compare to documentation or expected value (should be 3,000ms)",
        "Correct the timer preset and confirm the output energizes"
      ],
      successCriteria: "Participant traces the rung to the timer, identifies the incorrect preset, corrects it, and confirms output energizes within 20 minutes."
    },
    {
      id: 5,
      title: "Component Replacement — Faulty Push Button",
      objective: "A push button has failed. Replace it, rewire correctly, and verify the PLC receives the signal.",
      setup: "Instructor provides a push button with a disconnected or swapped wire. The HMI shows the associated input is not responding to button presses.",
      timeLimit: "25 minutes",
      steps: [
        "Identify the push button channel from the wiring diagram",
        "Confirm the input tag is not toggling using PLC Tag Monitor",
        "Remove the old button (disconnect wiring, note wire labels)",
        "Install the replacement button in the correct location",
        "Reconnect wiring to the correct terminals matching the wiring diagram",
        "Test the button — confirm the PLC input tag toggles with each press",
        "Verify the associated function works in the machine sequence"
      ],
      successCriteria: "Participant correctly replaces the push button, makes proper wiring connections, and verifies PLC signal within 25 minutes. Wiring is neat and terminal screws are torqued."
    }
  ],

  escalation: {
    levels: [
      {
        level: 1,
        title: "Technician Resolves Independently",
        color: "success",
        items: [
          "Sensor replacement (proximity, photoelectric, limit switch)",
          "Push button swap",
          "IP configuration and PLC connectivity",
          "HMI fault clear and alarm management",
          "Safety circuit reset (area scanner, light curtain, E-stop)",
          "Area scanner zone verification",
          "I/O signal trace via PLC software",
          "Fuse replacement (after identifying root cause of blown fuse)"
        ]
      },
      {
        level: 2,
        title: "Escalate to Lead Technician / Noah Staudacher",
        color: "warning",
        items: [
          "Ladder logic modification required",
          "Servo drive fault (E-series codes, STO errors)",
          "New I/O module addition or configuration",
          "Area scanner zone reprogramming on production equipment",
          "VFD parameter changes or fault diagnosis",
          "Any fault that persists after Level 1 troubleshooting"
        ]
      },
      {
        level: 3,
        title: "Escalate to Automation Engineering",
        color: "danger",
        items: [
          "PLC program structural changes",
          "EtherCAT/EtherNet/IP configuration changes",
          "New machine integration",
          "Firmware updates on any controller or drive",
          "Any unresolvable communication fault after Level 2 troubleshooting",
          "Safety system design changes"
        ]
      }
    ],
    documentation: [
      "Machine name and asset number",
      "PLC platform and software version",
      "HMI alarm code and alarm text (take a photo)",
      "Tag name(s) involved, current vs. expected values",
      "Steps already taken and results",
      "Time of fault occurrence and production impact"
    ]
  },

  knowledgeCheck: [
    { question: "What is the function of the PLC power supply, and what voltage does it typically output to the I/O modules?", type: "written" },
    { question: "Describe the difference between a Normally Open (N/O) and Normally Closed (N/C) contact in ladder logic.", type: "written" },
    { question: "A proximity sensor's LED is lit (indicating it is detecting a target), but the PLC input tag shows 0. What are two likely causes?", type: "written" },
    { question: "What does OSSD stand for, and why do safety devices use two OSSD channels instead of one?", type: "written" },
    { question: "You need to connect your laptop to an Omron PLC with IP address 192.168.5.20. What should you set your laptop's IP and subnet mask to?", type: "written" },
    { question: "In Studio 5000, what menu option do you use to browse the network and find controllers? What is the keyboard shortcut to go online?", type: "written" },
    { question: "A TON timer has a preset of 5000ms and an accumulator of 5000ms. Is the DN bit ON or OFF?", type: "written" },
    { question: "What is a global variable, and how does it differ from a program-scoped tag?", type: "written" },
    { question: "List the three access levels on a typical HMI and describe what each level allows.", type: "written" },
    { question: "At what escalation level should a technician address a servo drive STO (Safe Torque Off) fault?", type: "written" }
  ],

  handouts: [
    { id: "quick-ref", title: "Ladder Logic Quick Reference", description: "One-page reference card covering all ladder logic symbols and instructions (contacts, coils, timers, counters, comparison, math)." },
    { id: "wiring-diagram", title: "Bench Wiring Diagram Packet", description: "Complete wiring diagrams for the tabletop PLC bench including all three PLC platforms, I/O assignments, and field device connections." },
    { id: "ip-cheatsheet", title: "IP Configuration Cheat Sheet", description: "Step-by-step IP configuration for each platform with screenshots. Includes common subnet examples and ping troubleshooting." },
    { id: "escalation-card", title: "Escalation Procedure Card", description: "Pocket-sized reference card showing Level 1/2/3 escalation criteria, contact information, and what to document before escalating." },
    { id: "safety-checklist", title: "Safe Work Practices Checklist", description: "Pre-work safety checklist covering LOTO verification, PPE requirements, and energized work guidelines. Students sign at start of training." },
    { id: "troubleshooting-flowchart", title: "5-Layer Troubleshooting Flowchart", description: "Visual flowchart of the 5-layer fault isolation model: Physical Device → Wiring → I/O Module → PLC Logic → Network/HMI." }
  ]
};
