use std::{error::Error, time::Instant};

include!(concat!(env!("OUT_DIR"), "/runner.rs"));

fn main() -> Result<(), Box<dyn Error>> {
    let day = if let Some(arg) = std::env::args().nth(1) {
        Some(arg.trim().parse()?)
    } else {
        None
    };
    println!("Running part 1:");
    let start = Instant::now();
    runner::run_part1(day);
    println!("took {:?}", start.elapsed());

    println!("Running part 2:");
    let start = Instant::now();
    runner::run_part2(day);
    println!("took {:?}", start.elapsed());
    Ok(())
}
