use napi_derive::napi;
use screenshots::Screen;
use signal_hook::low_level::exit;
use std::{fs, time::{Instant, Duration}, thread::sleep};

static mut SHOULD_CLOSE: bool = false;

macro_rules! debug {
    ($($e:expr),+) => {
        {
            #[cfg(debug_assertions)]
            {
                dbg!($($e),+)
            }
            #[cfg(not(debug_assertions))]
            {
                ($($e),+)
            }
        }
    };
}

fn rgb_vec_hex(rgb: &[u8]) -> Vec<String> {
    rgb.chunks(3)
        .map(|chunk| {
            let hex_chars: Vec<String> = chunk
                .iter()
                .map(|&byte| format!("{:02X}", byte))
                .collect();
            format!("{}", hex_chars.join(""))
        })
        .collect()
}

fn rgb_vec_hsl(rgb: &[u8]) -> Vec<String> {
    let mut hsl_vec = Vec::new();

    for chunk in rgb.chunks(3) {
        let r = chunk[0] as f32 / 255.0;
        let g = chunk[1] as f32 / 255.0;
        let b = chunk[2] as f32 / 255.0;

        let max = r.max(g).max(b);
        let min = r.min(g).min(b);
        let delta = max - min;

        let mut h: f32;
        let mut s: f32;
        let l = (max + min) / 2.0;

        if delta == 0.0 {
            h = 0.0;
            s = 0.0;
        } else {
            if max == r {
                h = (g - b) / delta;
            } else if max == g {
                h = 2.0 + (b - r) / delta;
            } else {
                h = 4.0 + (r - g) / delta;
            }

            h *= 60.0;

            if h < 0.0 {
                h += 360.0;
            }

            s = delta / (1.0 - f32::abs(2.0 * l - 1.0));
        }

        hsl_vec.push(format!("hsl({}, {}%, {}%)", h, s * 100.0, l * 100.0));
    }

    hsl_vec
}

#[napi]
pub fn get_dominant_color_callback<T: Fn(Vec<String>) -> Result<napi::JsNull, napi::Error>>(x: i32, y: i32, width: u32, height: u32, interval: u32, callback: T) {
  loop {
    unsafe {
      debug!(println!("Should close? {}", SHOULD_CLOSE));
      if SHOULD_CLOSE {
        exit(0);
      }
    }
    let result = get_dominant_color(x, y, width, height);
    callback(result).unwrap();
    sleep(Duration::from_millis(u64::from(interval)));
  }
}

#[napi]
pub fn finish_loop() {
  unsafe {
    SHOULD_CLOSE = true;
    exit(0);
  }
}

#[napi]
pub fn get_dominant_color(x: i32, y: i32, width: u32, height: u32) -> Vec<String> {
  let colors = handle_dominant_color(x, y, width, height);
  let result:Vec<String> = rgb_vec_hex(&colors);
  return result;
}

#[napi]
pub fn get_dominant_color_hsl(x: i32, y: i32, width: u32, height: u32) -> Vec<String> {
  let colors = handle_dominant_color(x, y, width, height);
  let result:Vec<String> = rgb_vec_hsl(&colors);
  return result;
}

fn handle_dominant_color (x: i32, y: i32, width: u32, height: u32) -> Vec<u8> {
  let screens = Screen::all().unwrap();
  let screenshot: screenshots::Image = screens[0].capture_area(x, y, width, height).unwrap();
  let image_buffer = screenshot.buffer();

  let dynamic_image = image::load_from_memory(image_buffer).unwrap();
  let colors = dominant_color::get_colors(&dynamic_image.to_rgba8(), true);

  debug!(fs::write(format!("target/{}.jpg", screens[0].display_info.id), image_buffer).unwrap());
  return colors;
}