use napi_derive::napi;
use screenshots::Screen;
use std::{fs, time::{Instant, Duration}, thread::sleep};

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

fn rgb_vec_hex(rgb: [u8; 3]) -> Vec<String> {
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

#[napi]
pub fn get_dominant_color_callback<T: Fn(Vec<String>) -> Result<napi::JsNull, napi::Error>>(x: i32, y: i32, width: u32, height: u32, interval: u32, callback: T) {
  let mut prev_color: (u8, u8, u8) = (0,0,0);
  let mut curr_color: (u8, u8, u8);
  loop {
    let colors = handle_dominant_color(x, y, width, height);
    curr_color = colors;
    let factor = calculate_factor(prev_color, curr_color);
    let interpolated_color = interpolate_color(curr_color, prev_color, factor);
    let result:Vec<String> = rgb_vec_hex([interpolated_color.0, interpolated_color.1, interpolated_color.2]);
    callback(result).unwrap();
    prev_color = curr_color;
    sleep(Duration::from_millis(u64::from(interval)));
  }
}

fn handle_dominant_color (x: i32, y: i32, width: u32, height: u32) -> (u8, u8, u8) {
  let screens = Screen::all().unwrap();
  let screenshot: screenshots::Image = screens[0].capture_area(x, y, width, height).unwrap();
  let image_buffer = screenshot.buffer();

  let dynamic_image = image::load_from_memory(image_buffer).unwrap();
  let colors = dominant_color::get_colors(&dynamic_image.to_rgba8(), true);

  debug!(fs::write(format!("target/{}.jpg", screens[0].display_info.id), image_buffer).unwrap());
  return (colors[0], colors[1], colors[2]);
}

fn interpolate_color(color1: (u8, u8, u8), color2: (u8, u8, u8), factor: f32) -> (u8, u8, u8) {
    let r = (color1.0 as f32 * (1.0 - factor) + color2.0 as f32 * factor) as u8;
    let g = (color1.1 as f32 * (1.0 - factor) + color2.1 as f32 * factor) as u8;
    let b = (color1.2 as f32 * (1.0 - factor) + color2.2 as f32 * factor) as u8;
    (r, g, b)
}

fn calculate_factor(previous_color: (u8, u8, u8), current_color: (u8, u8, u8)) -> f32 {
    let r_diff = (current_color.0 as f32 - previous_color.0 as f32).abs();
    let g_diff = (current_color.1 as f32 - previous_color.1 as f32).abs();
    let b_diff = (current_color.2 as f32 - previous_color.2 as f32).abs();

    // Calculate the maximum difference between RGB channels
    let max_diff = r_diff.max(g_diff).max(b_diff);

    // Calculate the factor based on the maximum difference
    if max_diff == 0.0 {
        0.0
    } else {
        1.0 - (max_diff / 255.0)
    }
}