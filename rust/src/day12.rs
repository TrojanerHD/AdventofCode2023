use std::collections::VecDeque;

pub fn part1(input: &str) -> String {
    let lines = input.lines().filter(|line| !line.is_empty());
    let mut result = 0;

    for line in lines {
        let (spring_str, values_str) = line.split_once(' ').unwrap();
        let tmp_result = rec(
            '.',
            spring_str,
            values_str
                .split(',')
                .map(|it| it.parse::<u8>().unwrap())
                .collect::<Vec<u8>>(),
        );
        result += tmp_result;
    }
    result.to_string()
}

fn rec(prev: char, left: &str, values: Vec<u8>) -> u32 {
    if values.is_empty() || (values.len() == 1 && values[0] == 0) {
        return if !left.contains('#') { 1 } else { 0 };
    }
    let mut chars = left.chars();
    let Some(next) = chars.next() else { return 0 };
    let rest = &chars.collect::<String>();
    if values[0] == 0 {
        match next {
            '#' => {
                return 0;
            }
            _ => {
                let mut new_values = VecDeque::from(values);
                new_values.pop_front();
                return rec('.', rest, Vec::from(new_values));
            }
        }
    }
    if prev == '#' && next == '.' {
        return 0;
    }

    match next {
        '.' => rec(next, rest, values),
        '#' => rec(
            next,
            rest,
            values
                .into_iter()
                .enumerate()
                .map(|(i, it)| if i == 0 { it - 1 } else { it })
                .collect(),
        ),
        '?' => {
            if values[0] == 0 {
                let mut new_values = VecDeque::from(values);
                new_values.pop_front();
                return rec('.', rest, Vec::from(new_values));
            }

            let mut result = 0;

            if prev != '#' {
                result = rec('.', rest, values.clone());
            }

            result
                + rec(
                    '#',
                    rest,
                    values
                        .into_iter()
                        .enumerate()
                        .map(|(i, it)| if i == 0 { it - 1 } else { it })
                        .collect(),
                )
        }

        _ => panic!("Unknown symbol {}", next),
    }
}

pub fn part2(input: &str) -> String {
    let lines = input.lines().filter(|it| !it.is_empty());

    let mut result = 0;

    for line in lines {
        let (spring_str, values_str) = line.split_once(' ').unwrap();
        let mut spring5 = Vec::new();
        let mut values5 = Vec::new();
        for _ in 0..5 {
            spring5.push(spring_str);
            values5.push(values_str);
        }
        let tmp_result = rec(
            '.',
            &spring5.join("?"),
            values5
                .join(",")
                .split(',')
                .map(|it| it.parse::<u8>().unwrap())
                .collect::<Vec<u8>>(),
        );
        result += tmp_result;
    }
    result.to_string()
}
