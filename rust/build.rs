use std::env;
use std::error::Error;
use std::fmt::Write;

fn main() -> Result<(), Box<dyn Error>> {
    let mut days = Vec::new();
    let mut current_day = 0;
    for file in std::fs::read_dir("src")? {
        let name = file?
            .file_name()
            .into_string()
            .map_err(|_| "filename is not utf-8")?
            .trim_end_matches(".rs")
            .to_owned();
        let day_num = if let Some(num) = name.strip_prefix("day") {
            let day_num = num.parse::<u32>()?;
            days.push((day_num, name));
            day_num
        } else {
            continue;
        };
        current_day = current_day.max(day_num);
    }
    let out = generate_code(days, current_day);
    let out_file = env::var("OUT_DIR")? + "/runner.rs";
    std::fs::write(out_file, out)?;
    Ok(())
}

fn generate_code(days: Vec<(u32, String)>, current_day: u32) -> String {
    let mut out = String::new();
    let src = env::var("CARGO_MANIFEST_DIR").unwrap() + "/src";
    for (_, name) in &days {
        writeln!(out, r#"#[path = r"{src}/{name}.rs"] pub mod {name};"#).unwrap();
    }
    writeln!(
        out,
        "
mod runner {{
    pub fn current_day() -> u32 {{
        {current_day}
    }}"
    )
    .unwrap();
    for part in ["part1", "part2"] {
        writeln!(
            out,
            "
    pub fn run_{part}(day: u32, input: &str) -> String {{
        match day {{"
        )
        .unwrap();
        for (day, name) in &days {
            writeln!(
                out,
                "
            {day} => crate::{name}::{part}(input),"
            )
            .unwrap();
        }
        writeln!(
            out,
            "
            _ => unimplemented!(\"day {{day}} not implemented\"),
        }}
    }}"
        )
        .unwrap();
    }
    writeln!(out, "}}").unwrap();
    out
}
