fn replace_number_words(input: String, number: i32) -> String {
    let word = match number {
        1 => "one",
        2 => "two",
        3 => "three",
        4 => "four",
        5 => "five",
        6 => "six",
        7 => "seven",
        8 => "eight",
        9 => "nine",
        _ => panic!("Number not in range"),
    };

    return input.replace(word, format!("{}{}{}", word, number, word).as_str());
}

pub fn part1(input: &str) -> String {
    let split = input.lines();
    let new_lines = split.map(|line| {
        if line.is_empty() {
            return "".to_owned();
        }

        let mut first = None;
        let mut last = None;
        for letter in line.chars() {
            if letter.is_ascii_digit() {
                first = first.or(Some(letter));
                last = Some(letter);
            }
        }
        format!("{}{}", first.unwrap(), last.unwrap())
    });

    format!(
        "{}",
        new_lines.fold(0, |a, b| a + b.parse::<i32>().unwrap())
    )
}

pub fn part2(input: &str) -> String {
    let split = input.lines().map(|line| -> String {
        let mut local_line = line.to_owned();
        for i in 1..10 {
            local_line = replace_number_words(local_line, i);
        }
        local_line
    });
    let new_lines = split.map(|line| {
        if line.is_empty() {
            return "".to_owned();
        }

        let mut first = None;
        let mut last = None;
        for letter in line.chars() {
            if letter.is_ascii_digit() {
                first = first.or(Some(letter));
                last = Some(letter);
            }
        }
        format!("{}{}", first.unwrap(), last.unwrap())
    });

    format!(
        "{}",
        new_lines.fold(0, |a, b| a + b.parse::<i32>().unwrap())
    )
}
