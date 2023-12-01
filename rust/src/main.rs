use std::{
    fs::{self, File},
    io::Read,
    path::Path,
    time::Instant,
};

use anyhow::{bail, Context, Result};

include!(concat!(env!("OUT_DIR"), "/runner.rs"));

fn main() -> Result<()> {
    let day = if let Some(arg) = std::env::args().nth(1) {
        arg.trim().parse()?
    } else {
        let day = runner::current_day();
        if day == 0 {
            bail!("no solution files found");
        }
        day
    };

    if !(1..=25).contains(&day) {
        bail!("day {day} is not a valid advent of code day");
    }
    let input = setup(day)?;
    println!("Running day {day} part 1:");
    let start = Instant::now();
    let result = runner::run_part1(day, &input);
    println!("took {:?}", start.elapsed());
    println!("output: {result}");

    println!();

    println!("Running day {day} part 2:");
    let start = Instant::now();
    let result = runner::run_part2(day, &input);
    println!("took {:?}", start.elapsed());
    println!("output: {result}");
    Ok(())
}

fn setup(day: u32) -> Result<String> {
    let input_dir = Path::new("input");
    fs::create_dir_all(input_dir)?;
    let input_file = input_dir.join(format!("day{day}.txt"));
    let mut input = String::new();
    match File::open(&input_file) {
        Ok(mut f) => {
            f.read_to_string(&mut input)?;
        }
        Err(_) => {
            let token = fs::read_to_string(".token.txt")
                .context("session token file '.token.txt' not found")?;
            input = ureq::get(&format!("https://adventofcode.com/2023/day/{day}/input"))
                .set("Cookie", &format!("session={}", token.trim()))
                .call()?
                .into_string()?;
            fs::write(input_file, &input)?;
        }
    };
    Ok(input)
}
