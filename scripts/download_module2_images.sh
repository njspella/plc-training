#!/usr/bin/env bash
# Download Module 2 (Safety & I/O devices) photos from Wikimedia Commons into images/.
# Run from repo root: bash scripts/download_module2_images.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/images"
mkdir -p "$IMG"
cd "$IMG"

fetch() {
  local out="$1" url="$2"
  echo "Fetching $out"
  curl -fsSL -o "$out" "$url"
}

fetch io_inductive_proximity.jpg "https://upload.wikimedia.org/wikipedia/commons/c/c8/Inductive_proximity_sensor.jpg"
fetch io_limit_switch_roller.jpg "https://upload.wikimedia.org/wikipedia/commons/9/92/Mini_Microswitch_-_SPDT_%28Roller_Lever%29_%2812781884965%29.jpg"
fetch io_operator_panel_pushbuttons.JPG "https://upload.wikimedia.org/wikipedia/commons/c/c3/00-bma-automation-operator-panel-with-pushbuttons.JPG"
fetch io_emergency_stop.jpg "https://upload.wikimedia.org/wikipedia/commons/d/df/Emergency_stop_button.jpg"
fetch io_photoelectric.jpg "https://upload.wikimedia.org/wikipedia/commons/9/9a/Photoelectric_sensor.jpg"
fetch safety_laser_scanner_3d.jpg "https://upload.wikimedia.org/wikipedia/commons/0/08/CrossingSafety_07g4838.jpg"
fetch safety_light_curtain.png "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lightcurtain.svg/960px-Lightcurtain.svg.png"
fetch io_contactor_relay.jpg "https://upload.wikimedia.org/wikipedia/commons/3/3c/Contactor_DIN_IEK.jpg"
fetch io_stack_light.jpg "https://upload.wikimedia.org/wikipedia/commons/3/32/Signals%C3%A4ule_an_einer_grossen_selbstfahrenden_Baumaschine_%28rot_gelb_gr%C3%BCn%29.jpg"
fetch io_servo_motor.jpg "https://upload.wikimedia.org/wikipedia/commons/d/d2/Servomotor_01.jpg"
fetch io_servo_drive.jpg "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ingenia_i127-01_Servo_Amplifier.jpg"
fetch io_stepper_motor.jpg "https://upload.wikimedia.org/wikipedia/commons/8/83/Nema_17_Stepper_Motor.jpg"
fetch io_vfd.jpg "https://upload.wikimedia.org/wikipedia/commons/7/7e/Variable-Frequency-Inverter.jpg"

echo "Done. See images/IMAGE_ATTRIBUTIONS.md for licenses and credits."
