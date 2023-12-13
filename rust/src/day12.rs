pub fn part1(input: &str) -> String {
    let lines = input.lines().filter(|line| line.to_owned() != "");
    let mut result = 0;

    for line in lines {
        let values = line.split_once(" ").unwrap();
        result += calc_line(values);
    }
    result.to_string()
}

fn calc_line((spring_str, value_str): (&str, &str)) -> u32 {
    let question_marks: u32 = spring_str.matches('?').count() as u32;
    let hashtags: u32 = spring_str.matches('#').count() as u32;

    let values = value_str
        .split(',')
        .map(|value| value.parse::<u32>().unwrap())
        .collect::<Vec<u32>>();

    let mut result: u32 = 0;
    let base: i64 = 2;

    let combinations = base.pow(question_marks);

    'combinationLoop: for i in 0..combinations {
        let mut questions = 0;
        let mut count = 0;
        let mut tmp_values = values.iter().copied();
        let binary = format!("{:b}", i);
        if binary.matches('1').count() != (tmp_values.sum::<u32>() - hashtags).try_into().unwrap() {
            continue;
        }

        tmp_values = values.iter().copied();

        for mut char in spring_str.chars() {
            if char == '?' {
                questions += 1;
                char = if i >> (question_marks - questions) & 1 != 0 {
                    '#'
                } else {
                    '.'
                };
            }

            match char {
                '#' => {
                    count += 1;
                }
                '.' => {
                    if count != 0 && count != tmp_values.next().unwrap_or(0) {
                        continue 'combinationLoop;
                    }
                    count = 0;
                }
                _ => {}
            }
        }

        if count != 0 && count != tmp_values.next().unwrap_or(0) {
            continue;
        }

        result += 1;
    }
    result
}

pub fn part2(input: &str) -> String {
    let lines = input.lines().filter(|it| it.to_owned() != "");

    let mut result = 0;

    for line in lines {
        let (spring_str, values_str) = line.split_once(' ').unwrap();
        let mut spring5 = Vec::new();
        let mut values5 = Vec::new();
        for _ in 0..4 {
            spring5.push(spring_str);
            values5.push(values_str);
        }
        result += calc_line((&spring5.join("?"), &values5.join(",")));
    }
    result.to_string()
}
