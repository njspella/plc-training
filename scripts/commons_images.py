"""
Single source of truth: Wikimedia Commons URLs for slide hardware photos.

Used by scripts/download_slide_images.py and scripts/generate_offline_ooxml.py
(export embeds photos by fetching these URLs when images/ files are missing).
"""
from __future__ import annotations

import os
import shutil
import subprocess
import urllib.error
import urllib.request

_COMMONS_UA = "plc-training/1.0 (educational; +https://commons.wikimedia.org/)"


def _env_for_direct() -> dict[str, str]:
    """Copy of env without proxy vars (use with curl when WIKIMEDIA_DIRECT=1)."""
    e = dict(os.environ)
    for k in (
        "HTTP_PROXY",
        "HTTPS_PROXY",
        "ALL_PROXY",
        "http_proxy",
        "https_proxy",
        "all_proxy",
    ):
        e.pop(k, None)
    return e


def _urlopen_commons(url: str, timeout: int, *, direct: bool):
    req = urllib.request.Request(url, headers={"User-Agent": _COMMONS_UA})
    if direct:
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        return opener.open(req, timeout=timeout)
    return urllib.request.urlopen(req, timeout=timeout)


def fetch_commons_bytes(url: str) -> bytes | None:
    """Download bytes from upload.wikimedia.org: try proxy then direct (proxy often breaks CONNECT)."""
    for direct in (False, True):
        try:
            with _urlopen_commons(url, 45, direct=direct) as resp:
                data = resp.read()
            if data:
                return data
        except (urllib.error.URLError, OSError, TimeoutError):
            pass
    curl = shutil.which("curl")
    if not curl:
        return None
    for direct in (False, True):
        cmd = [
            curl,
            "-fsSL",
            "-L",
            "-A",
            _COMMONS_UA,
            "--connect-timeout",
            "15",
            "--max-time",
            "90",
            "--retry",
            "1",
            url,
        ]
        if direct:
            cmd[1:1] = ["--noproxy", "*"]
            env = _env_for_direct()
        else:
            env = _env_for_direct() if os.environ.get("WIKIMEDIA_DIRECT") else os.environ
        try:
            r = subprocess.run(cmd, capture_output=True, env=env, timeout=100)
            if r.returncode == 0 and r.stdout:
                return r.stdout
        except (OSError, subprocess.TimeoutExpired):
            pass
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
    # Module 9 — safety controllers (modular PLC rack illustrates typical F-CPU / safety I/O form factor)
    ("safety_plc_rack_example.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1f/S7300.JPG"),
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
