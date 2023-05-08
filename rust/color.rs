use napi_derive::napi;
use screenshots::{Screen, Image};
use std::{fs, time::Instant};
use color_thief::ColorFormat;

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

#[napi]
pub fn get_dominant_color(x: i32, y: i32, width: u32, height: u32) -> Vec<[u8;3]> {
  let start = Instant::now();
  let screens = Screen::all().unwrap();
  let image: Image = screens[0].capture_area(x, y, width, height).unwrap();

  let buffer = image.buffer();
  let colors = color_thief::get_palette(&buffer, ColorFormat::Rgba, 4, 2).unwrap();

  debug!(fs::write(format!("target/{}.jpg", screens[0].display_info.id), buffer).unwrap());

  let mut arr:Vec<[u8;3]> = vec![];
  for (index, color) in colors.iter().enumerate() {
    arr.insert(index, [color.r, color.g, color.b])
  }

  debug!(format!("Elapsed time: {:?}", start.elapsed()));
  return arr;
}
