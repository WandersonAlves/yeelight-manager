use napi_derive::napi;
use screenshots::Screen;
use std::{fs, time::Instant};

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

#[napi]
pub fn get_dominant_color(x: i32, y: i32, width: u32, height: u32) -> Vec<String> {
  let start = Instant::now();
  let screens = Screen::all().unwrap();
  let screenshot: screenshots::Image = screens[0].capture_area(x, y, width, height).unwrap();
  let image_buffer = screenshot.buffer();

  let dynamic_image = image::load_from_memory(image_buffer).unwrap();
  let colors = dominant_color::get_colors(&dynamic_image.to_rgba8(), false);

  debug!(fs::write(format!("target/{}.jpg", screens[0].display_info.id), image_buffer).unwrap());

  let arr:Vec<String> = rgb_vec_hex(&colors);

  debug!(format!("Elapsed time: {:?}", start.elapsed()));
  return arr;
}