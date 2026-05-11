# Image attributions

## Slide deck — primary assets (`js/data.js`)

**Default:** `LocalCabinetImages`, `LocalModule2DeviceImages`, and `LocalSafetyControllerImages` reference **Wikimedia Commons filenames** under `images/`. Fetch them once:

```bash
npm run download-images
# or: python3 scripts/download_slide_images.py
```

**Web app (HTML):** Prefer local `images/*.jpg` (from `npm run download-images`). If a file is missing, the same Commons photo is requested from `upload.wikimedia.org` via `js/commonsImageUrls.js` (see `renderSlideImageHtml` in `js/app.js`). Diagram PNGs in `images/` are not used as slide substitutes in the web app.

**PowerPoint embeds:** `npm run generate-offline` (see `scripts/generate_offline_ooxml.py`) tries each Commons URL from `scripts/commons_images.py` when a file is missing under `images/`, saves it there, and embeds it in the `.pptx`. If the download fails (offline or blocked), export falls back to the bundled diagrams (`ps_*.png`, `inputs_*.png`, `outputs_*.png`, etc.) — see `SLIDE_IMAGE_FALLBACK` in `scripts/generate_offline_ooxml.py`.

| Topic | Commons files (after download) | Diagram fallbacks |
|-------|-------------------------------|-------------------|
| Module 1 — cabinet | `cabinet_plc_cpu.jpg`, `cabinet_power_supply_24v.jpg`, `cabinet_industrial_ethernet.jpg` | `ps_*.png` |
| Module 2 — I/O | `io_*.jpg`, `safety_*.jpg`, `safety_relay_module.jpg`, `io_interposing_relay.jpg`, `solenoid_*.jpg`, `rotary_encoder.jpg`, `dol_motor_starter.jpg` | `inputs_*.png`, `outputs_*.png`, `area_scanner.png` |
| Module 6 — HMI | `hmi_screen.jpg` (from [Siemens Simatic Multi Panel.JPG](https://commons.wikimedia.org/wiki/File:Siemens_Simatic_Multi_Panel.JPG)); if missing, `image6.jpeg` via fallback |
| Module 9 — safety controllers | `safety_plc_rack_example.jpg` ([S7300.JPG](https://commons.wikimedia.org/wiki/File:S7300.JPG)); illustrative Siemens S7‑300 rack | `ps_cpu_module.png` |

---

## Wikimedia Commons (download script)

### Module 1

| Local file | Commons file | Author / credit | License |
|------------|----------------|-----------------|--------|
| `cabinet_plc_cpu.jpg` | [Simatic S7-1200.JPG](https://commons.wikimedia.org/wiki/File:Simatic_S7-1200.JPG) | UlrichAAB | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) / GFDL |
| `cabinet_power_supply_24v.jpg` | [24V DC power supply din mount 2.5A.jpg](https://commons.wikimedia.org/wiki/File:24V_DC_power_supply_din_mount_2.5A.jpg) | Mithilrkadam | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `cabinet_industrial_ethernet.jpg` | [Siemens ESM TP80.JPG](https://commons.wikimedia.org/wiki/File:Siemens_ESM_TP80.JPG) | Mixabest | Public domain (per Commons) |

### Module 2

| Local file | Commons file | Author / credit | License |
|------------|----------------|-----------------|--------|
| `io_inductive_proximity.jpg` | [Inductive proximity sensor.jpg](https://commons.wikimedia.org/wiki/File:Inductive_proximity_sensor.jpg) | Ekbsensor | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `io_limit_switch_roller.jpg` | [Mini Microswitch - SPDT (Roller Lever) (12781884965).jpg](https://commons.wikimedia.org/wiki/File:Mini_Microswitch_-_SPDT_(Roller_Lever)_(12781884965).jpg) | SparkFun Electronics | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| `io_operator_panel_pushbuttons.JPG` | [00-bma-automation-operator-panel-with-pushbuttons.JPG](https://commons.wikimedia.org/wiki/File:00-bma-automation-operator-panel-with-pushbuttons.JPG) | Elmschrat | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `io_emergency_stop.jpg` | [Emergency stop button.jpg](https://commons.wikimedia.org/wiki/File:Emergency_stop_button.jpg) | Cjp24 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `io_photoelectric.jpg` | [Photoelectric sensor.jpg](https://commons.wikimedia.org/wiki/File:Photoelectric_sensor.jpg) | Honmingjun | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `safety_laser_scanner_3d.jpg` | [Sick laserscanner.jpg](https://commons.wikimedia.org/wiki/File:Sick_laserscanner.jpg) | Björn Heller | [CC BY-SA 3.0 Germany](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en) |
| `safety_light_curtain.jpg` | [Lichtschnittsensor.jpg](https://commons.wikimedia.org/wiki/File:Lichtschnittsensor.jpg) (light-section sensor photo) | K.Willms | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `safety_relay_module.jpg` | [ANT Nachrichtentechnik DBT-03 - SDS Relais S2-5V-0028.jpg](https://commons.wikimedia.org/wiki/File:ANT_Nachrichtentechnik_DBT-03_-_SDS_Relais_S2-5V-0028.jpg) | Raimond Spekking | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `io_interposing_relay.jpg` | [DMB51CM24.JPG](https://commons.wikimedia.org/wiki/File:DMB51CM24.JPG) (pulse relay, DIN rail) | Dmitry G | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) / GFDL |
| `io_stack_light.jpg` | [Signalsäule … (rot gelb grün).jpg](https://commons.wikimedia.org/wiki/File:Signals%C3%A4ule_an_einer_grossen_selbstfahrenden_Baumaschine_(rot_gelb_gr%C3%BCn).jpg) | User:Mattes | Public domain (self-declared on Commons) |
| `io_servo_motor.jpg` | [Servomotor 01.jpg](https://commons.wikimedia.org/wiki/File:Servomotor_01.jpg) | José Luis Gálvez (Digigalos) | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/) |
| `io_servo_drive.jpg` | [Ingenia i127-01 Servo Amplifier.jpg](https://commons.wikimedia.org/wiki/File:Ingenia_i127-01_Servo_Amplifier.jpg) | Gemaperezsegura | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `io_stepper_motor.jpg` | [Nema 17 Stepper Motor.jpg](https://commons.wikimedia.org/wiki/File:Nema_17_Stepper_Motor.jpg) | oomlout | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `io_vfd.jpg` | [Variable-Frequency-Inverter.jpg](https://commons.wikimedia.org/wiki/File:Variable-Frequency-Inverter.jpg) | Projuktiponno | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `solenoid_valve_coil.jpg` | [Solenoid coil of a pneumatic valve.jpg](https://commons.wikimedia.org/wiki/File:Solenoid_coil_of_a_pneumatic_valve.jpg) | Sarah Adrita | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `rotary_encoder.jpg` | [Rotary encoder.jpg](https://commons.wikimedia.org/wiki/File:Rotary_encoder.jpg) | Joao Paulo Chagas | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `dol_motor_starter.jpg` | [Dol starter.jpg](https://commons.wikimedia.org/wiki/File:Dol_starter.jpg) | Jubayer al tawsib | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

### Module 6 — HMI

| Local file | Commons file | Author / credit | License |
|------------|----------------|-----------------|--------|
| `hmi_screen.jpg` | [Siemens Simatic Multi Panel.JPG](https://commons.wikimedia.org/wiki/File:Siemens_Simatic_Multi_Panel.JPG) | Alf van Beem | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

### Module 9 — Safety controllers (illustrative rack)

| Local file | Commons file | Author / credit | License |
|------------|----------------|-----------------|--------|
| `safety_plc_rack_example.jpg` | [S7300.JPG](https://commons.wikimedia.org/wiki/File:S7300.JPG) (Siemens Simatic S7‑300) | Ulli1105 / Palatinatian (Commons history) | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/deed.en) |

When redistributing or publishing this training package, keep this file with the images and comply with each license (attribution and share-alike where required).
