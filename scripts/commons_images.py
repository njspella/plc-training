"""
Single source of truth: Wikimedia Commons URLs for slide hardware photos.

Used by scripts/download_slide_images.py and scripts/generate_offline_ooxml.py
(export embeds photos by fetching these URLs when images/ files are missing).
"""
from __future__ import annotations

import time
import urllib.error
import urllib.request

_COMMONS_UA = "plc-training/1.0 (educational; +https://commons.wikimedia.org/)"


def fetch_commons_bytes(url: str, retries: int = 3) -> bytes | None:
    """Download original file bytes from upload.wikimedia.org (with retries)."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": _COMMONS_UA})
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
            if data:
                return data
        except (urllib.error.URLError, OSError, TimeoutError):
            time.sleep(1.5 * (attempt + 1))
    return None

# (filename under images/, full URL to original on upload.wikimedia.org)
COMMONS_IMAGES: list[tuple[str, str]] = [
    # Module 1 — PLC Cabinet Overview
    ("cabinet_plc_cpu.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a3/Simatic_S7-1200.JPG"),
    (
        "cabinet_power_supply_24v.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/f/f9/24V_DC_power_supply_din_mount_2.5A.jpg",
    ),
    (
        "cabinet_industrial_ethernet.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c4/Siemens_ESM_TP80.JPG",
    ),
    # Module 2 — I/O & safety
    (
        "io_inductive_proximity.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c8/Inductive_proximity_sensor.jpg",
    ),
    (
        "io_limit_switch_roller.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/92/Mini_Microswitch_-_SPDT_%28Roller_Lever%29_%2812781884965%29.jpg",
    ),
    (
        "io_operator_panel_pushbuttons.JPG",
        "https://upload.wikimedia.org/wikipedia/commons/c/c3/00-bma-automation-operator-panel-with-pushbuttons.JPG",
    ),
    ("io_emergency_stop.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/df/Emergency_stop_button.jpg"),
    ("io_photoelectric.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9a/Photoelectric_sensor.jpg"),
    (
        "safety_laser_scanner_3d.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/e/eb/Sick_laserscanner.jpg",
    ),
    (
        "safety_light_curtain.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/7d/Lichtschnittsensor.jpg",
    ),
    (
        "safety_relay_module.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/6/6f/ANT_Nachrichtentechnik_DBT-03_-_SDS_Relais_S2-5V-0028.jpg",
    ),
    (
        "io_interposing_relay.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/b/bc/DMB51CM24.JPG",
    ),
    (
        "io_stack_light.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/32/Signals%C3%A4ule_an_einer_grossen_selbstfahrenden_Baumaschine_%28rot_gelb_gr%C3%BCn%29.jpg",
    ),
    ("io_servo_motor.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d2/Servomotor_01.jpg"),
    (
        "io_servo_drive.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ingenia_i127-01_Servo_Amplifier.jpg",
    ),
    ("io_stepper_motor.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/83/Nema_17_Stepper_Motor.jpg"),
    ("io_vfd.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7e/Variable-Frequency-Inverter.jpg"),
    (
        "solenoid_valve_coil.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Solenoid_coil_of_a_pneumatic_valve.jpg",
    ),
    ("rotary_encoder.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/cf/Rotary_encoder.jpg"),
    ("dol_motor_starter.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/01/Dol_starter.jpg"),
    # Module 6 — HMI
    ("hmi_screen.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/18/Siemens_Simatic_Multi_Panel.JPG"),
]


def url_for_images_src(src: str) -> str | None:
    """Map ``images/<file>`` to Commons URL, or None if not in manifest."""
    s = (src or "").strip()
    if not s.startswith("images/"):
        return None
    base = s.split("/", 1)[1]
    for name, url in COMMONS_IMAGES:
        if name == base:
            return url
    return None
