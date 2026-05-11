/**
 * Fifty-question multiple-choice written knowledge check.
 * Loads after js/data.js; assigns TrainingData.knowledgeCheck.
 * Choice order varies so the correct letter is not always A.
 */
(function () {
'use strict';

TrainingData.knowledgeCheck = {
  format: 'multipleChoice',
  title: 'Written Knowledge Check',
  passingScorePercent: 80,
  passingFraction: '40 / 50',
  timeSuggestedMinutes: 75,
  questions: [
  {
    "question": "The PLC executes its program on a repeatable cycle that typically:?",
    "choices": [
      "Writes outputs → reads inputs",
      "Solves math only once per shift",
      "Only scans when an HMI button is pressed",
      "Reads inputs → solves logic → writes outputs"
    ],
    "correctIndex": 3
  },
  {
    "question": "A sinking (NPN-style) discrete input wired to sourcing PLC input wiring usually requires.?",
    "choices": [
      "Compliance with datasheet for input type — mixing types incorrectly prevents valid ON state",
      "Solely grounding the shield",
      "Solely terminating with 120Ω",
      "Nothing special"
    ],
    "correctIndex": 0
  },
  {
    "question": "A Normally Open ladder contact passes power when.?",
    "choices": [
      "Timer DN is cleared",
      "Associated bit FALSE",
      "PLC is STOP mode",
      "Associated bit TRUE"
    ],
    "correctIndex": 3
  },
  {
    "question": "A Normally Closed ladder contact passes power when.?",
    "choices": [
      "Accumulated preset reached",
      "Associated bit FALSE",
      "Analog fault",
      "Associated bit TRUE"
    ],
    "correctIndex": 1
  },
  {
    "question": "TON DN bit turns ON when.?",
    "choices": [
      "Immediately on one pulse",
      "Whenever TT clears",
      "Preset downloads",
      "Accumulator ≥ preset AND rung enabling timer is true per instruction rules"
    ],
    "correctIndex": 3
  },
  {
    "question": "TOF output remains ON briefly after input goes FALSE until.?",
    "choices": [
      "SFC step increments",
      "Accumulator reaches preset",
      "Sensors cool",
      "Ethernet reconnect"
    ],
    "correctIndex": 1
  },
  {
    "question": "XIC means.?",
    "choices": [
      "Examine-if-open",
      "Examine-if-closed",
      "Output latch",
      "One-shot"
    ],
    "correctIndex": 1
  },
  {
    "question": "CTU DONE is ON when.?",
    "choices": [
      "Accumulated count ≥ preset",
      "Analog span changes",
      "Every scan",
      "Only at midnight"
    ],
    "correctIndex": 0
  },
  {
    "question": "MOV instruction.?",
    "choices": [
      "Deletes rung",
      "Measures ohms",
      "Copies source value to destination tag",
      "Starts servo homing"
    ],
    "correctIndex": 2
  },
  {
    "question": "Control circuit grounding must.?",
    "choices": [
      "Always conduit-only",
      "Follow plant drawing / bonding plan — stray references cause noise",
      "Never reference earth",
      "Rotate phases"
    ],
    "correctIndex": 1
  },
  {
    "question": "Sensor LED shows target but PLC input 0 — next check after sensor OK.?",
    "choices": [
      "Change IP",
      "Rewrite all code",
      "Replace CPU",
      "Wiring and I/O module integrity before rewriting ladder"
    ],
    "correctIndex": 3
  },
  {
    "question": "Half-split places a measurement.?",
    "choices": [
      "Mid-path to halve unknown segment",
      "Only at HMI",
      "Only Friday",
      "Always at motor"
    ],
    "correctIndex": 0
  },
  {
    "question": "HMI alarm packets should carry.?",
    "choices": [
      "Only title",
      "Only color",
      "Timestamp, code, descriptive text, tag linkage",
      "MAC only"
    ],
    "correctIndex": 2
  },
  {
    "question": "HMIs separate.?",
    "choices": [
      "Everyone equal",
      "Scan time on every button",
      "Operator vs maintenance capabilities",
      "Font only"
    ],
    "correctIndex": 2
  },
  {
    "question": "Rockwell-style work needs matching.?",
    "choices": [
      "Paint code",
      "Printer driver",
      "Random USB stick",
      "Controller project revision vs what is documented online"
    ],
    "correctIndex": 3
  },
  {
    "question": "Sysmac IEC ladder uses.?",
    "choices": [
      "No tags",
      "NO/NC contacts, coils, timer/counter FB semantics similar to other PLCs",
      "Pure ladder only on paper",
      "No timers"
    ],
    "correctIndex": 1
  },
  {
    "question": "EtherNet/IP is.?",
    "choices": [
      "CIP on Ethernet",
      "Proprietary serial",
      "Hydraulic PSI",
      "Welding process"
    ],
    "correctIndex": 0
  },
  {
    "question": "Subnet mask defines.?",
    "choices": [
      "Cable length",
      "Fuse rating",
      "Network vs host partition of IP",
      "Motor poles"
    ],
    "correctIndex": 2
  },
  {
    "question": "Host uniqueness on /24 LAN.?",
    "choices": [
      "subnet must be /8",
      "Two gateways same MAC OK",
      "Last octet unique (except reserved)",
      "IPs can duplicate freely"
    ],
    "correctIndex": 2
  },
  {
    "question": "Duplicate IPs on same VLAN cause.?",
    "choices": [
      "Intermittent / broken communication",
      "Analog auto-scale",
      "Better historian clarity",
      "Slightly faster pings"
    ],
    "correctIndex": 0
  },
  {
    "question": "Switch port LED dark often means.?",
    "choices": [
      "SFC deadlock",
      "Encoder glitch",
      "No link energization / bad cable",
      "PLC sleep"
    ],
    "correctIndex": 2
  },
  {
    "question": "Before changing PLC IP.?",
    "choices": [
      "Bypass interlock",
      "Assume DHCP magically routes production",
      "Confirm SR/policy and correct subnet/island",
      "Cold boot only"
    ],
    "correctIndex": 2
  },
  {
    "question": "Dual OSSD discrepancy requires.?",
    "choices": [
      "Reload HMI fonts",
      "Safety fault procedure — no improvised bypass",
      "Tune timers",
      "Shrink subnet"
    ],
    "correctIndex": 1
  },
  {
    "question": "STO removes.?",
    "choices": [
      "Controlled motive power paths per drive OEM",
      "Air filters",
      "Barcode",
      "Hydraulic hoses"
    ],
    "correctIndex": 0
  },
  {
    "question": "Safety reset permissive ensures.?",
    "choices": [
      "System verified safe before motion restart",
      "Welding enable",
      "PWM frequency change",
      "Recipe auto-write"
    ],
    "correctIndex": 0
  },
  {
    "question": "Open 4–20 mA loop often.?",
    "choices": [
      "Produces 480 VAC",
      "Reads perfect 12.000 always",
      "Drives PLC into fault/saturation indication depending on config",
      "Aligns servo"
    ],
    "correctIndex": 2
  },
  {
    "question": "Analog scaling.?",
    "choices": [
      "Maps fonts to viscosity",
      "Maps conduits",
      "Maps raw counts to engineering units",
      "Maps IPs to hues"
    ],
    "correctIndex": 2
  },
  {
    "question": "Tag vs meter mismatch.?",
    "choices": [
      "Assume sensor wrong only",
      "Physical measurement outweighs PLC indication until investigated",
      "Always delete PLC",
      "Assume tag always truth"
    ],
    "correctIndex": 1
  },
  {
    "question": "Panel wiring rework needs.?",
    "choices": [
      "Coffee only",
      "Tie-wrap only",
      "LOTO/permit discipline per policy",
      "Tape only"
    ],
    "correctIndex": 2
  },
  {
    "question": "I/O power supply.?",
    "choices": [
      "Feeds only OLED",
      "Feeds only PLC scan",
      "Sized for field load — browning voltage causes flaky logic",
      "Feeds Wi-Fi antenna"
    ],
    "correctIndex": 2
  },
  {
    "question": "DC branch fuse blow.?",
    "choices": [
      "Means analog OK",
      "Ethernet fixed",
      "Removes branch power mimicking phantom logic faults",
      "Means encoder OK"
    ],
    "correctIndex": 2
  },
  {
    "question": "Shield termination.?",
    "choices": [
      "Never terminate",
      "Glue only",
      "Tape both ends float",
      "Per EMI grounding drawing — rarely both ends arbitrarily"
    ],
    "correctIndex": 3
  },
  {
    "question": "Encoder differential miswire yields.?",
    "choices": [
      "Higher torque",
      "Count loss / jitter",
      "Cleaner HMI",
      "Slower ping"
    ],
    "correctIndex": 1
  },
  {
    "question": "VFD run permissive.?",
    "choices": [
      "Interlocks proving safe torque enable conditions",
      "Deletes firmware",
      "Measures humidity",
      "Bypasses guarding"
    ],
    "correctIndex": 0
  },
  {
    "question": "Servo enable chain contains.?",
    "choices": [
      "Toner",
      "T-shirt",
      "Barcode",
      "STO, drive ready, PLC motion permission per OEM"
    ],
    "correctIndex": 3
  },
  {
    "question": "Servo faults.?",
    "choices": [
      "Weekly only",
      "Auto heal",
      "Appear on drive keypad/diagnostics correlate to PLC faults",
      "Invisible"
    ],
    "correctIndex": 2
  },
  {
    "question": "Recipe versioning risk.?",
    "choices": [
      "Wrong recipe edits setpoints unknowingly",
      "Barcode stickiness",
      "Cable color mood",
      "Toner viscosity"
    ],
    "correctIndex": 0
  },
  {
    "question": "PLC revision truth.?",
    "choices": [
      "Assume intern USB",
      "Assume cloud",
      "Assume Friday build",
      "Match approved archive to processor before deep dives"
    ],
    "correctIndex": 3
  },
  {
    "question": "Maintenance request Thrive.?",
    "choices": [
      "MRO guesses",
      "MET cold calls",
      "Vendor first",
      "Operations opens ticket first"
    ],
    "correctIndex": 3
  },
  {
    "question": "MET escalation timing.?",
    "choices": [
      "~1 hr troubleshooting start if unresolved (site policy applies)",
      "Coffee break",
      "Mondays only",
      "Quarterly audit"
    ],
    "correctIndex": 0
  },
  {
    "question": "Vendor touching prod ladder.?",
    "choices": [
      "Free if fast",
      "Assume weekend OK",
      "Assume warranty covers liability",
      "Change control Engineering + Purchasing"
    ],
    "correctIndex": 3
  },
  {
    "question": "Escalation documentation.?",
    "choices": [
      "Favorite color",
      "Barcode only",
      "Timeline, PLC rev, alarm text, tests that did NOT change symptom",
      "T-shirt slogan"
    ],
    "correctIndex": 2
  },
  {
    "question": "Network vs operator screen layer.?",
    "choices": [
      "Cyclic transport vs bindings/alarms/graphics",
      "Never different",
      "Barcode only",
      "Twin identities always"
    ],
    "correctIndex": 0
  },
  {
    "question": "Intermittent gremlins.?",
    "choices": [
      "Solder CPU",
      "Erase PLC",
      "Capture historian/trends before blindly cycling power",
      "Ignore"
    ],
    "correctIndex": 2
  },
  {
    "question": "OSSDs paired to.?",
    "choices": [
      "Hue shift",
      "Barcode only",
      "Detect wiring defeat or channel disparity",
      "Multiply torque"
    ],
    "correctIndex": 2
  },
  {
    "question": "Light curtain OSSD disagreement.?",
    "choices": [
      "Assume timer",
      "Bypass with jumper",
      "Keep safe-state — troubleshoot per safety PLC procedure",
      "Tune PID always"
    ],
    "correctIndex": 2
  },
  {
    "question": "Electrical diagrams validate.?",
    "choices": [
      "Snack schedule",
      "Barcode position",
      "Poster font",
      "Device tags, conductors, terminals, references"
    ],
    "correctIndex": 3
  },
  {
    "question": "Heavy PLC program burden.?",
    "choices": [
      "Barcode",
      "Mood",
      "Can extend scan impacting IO determinism",
      "Toner"
    ],
    "correctIndex": 2
  },
  {
    "question": "Wi-Fi to AGV/AP roaming.?",
    "choices": [
      "Heal ladder",
      "Can drop cyclic traffic momentarily",
      "Tune analog",
      "Bypass fuse"
    ],
    "correctIndex": 1
  },
  {
    "question": "Ping reachable but.?",
    "choices": [
      "cures grounding",
      "cures servo tuning",
      "Industrial protocol may remain filtered by VLAN/ACL",
      "cures guarding"
    ],
    "correctIndex": 2
  }
],
};
})();
