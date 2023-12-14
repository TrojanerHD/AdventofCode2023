use std::collections::{HashMap, VecDeque};

pub fn part1(input: &str) -> String {
    let lines = input.lines().filter(|line| !line.is_empty());
    let mut result = 0;

    for line in lines {
        let (spring_str, values_str) = line.split_once(' ').unwrap();
        let mut cache: HashMap<(char, String, Vec<u8>), u64> = HashMap::new();
        let tmp_result = rec(
            &mut cache,
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

fn cache_or_retrieve(
    cache: &mut HashMap<(char, String, Vec<u8>), u64>,
    prev: char,
    left: &str,
    values: Vec<u8>,
) -> u64 {
    let solution_opt = cache.get(&(prev, left.to_owned(), values.clone()));
    if let Some(solution) = solution_opt {
        return *solution;
    }

    let res = rec(cache, prev, left, values.clone());
    cache.insert((prev, left.to_owned(), values), res);
    res
}

fn rec(
    cache: &mut HashMap<(char, String, Vec<u8>), u64>,
    prev: char,
    left: &str,
    values: Vec<u8>,
) -> u64 {
    if values.is_empty() || (values.len() == 1 && values[0] == 0) {
        return if !left.contains('#') { 1 } else { 0 };
    }
    let mut chars = left.chars();
    let Some(next) = chars.next() else { return 0 };
    let rest = chars.collect::<String>();
    if values[0] == 0 {
        match next {
            '#' => {
                return 0;
            }
            _ => {
                let mut new_values = VecDeque::from(values);
                new_values.pop_front();
                return cache_or_retrieve(cache, '.', &rest, Vec::from(new_values));
            }
        }
    }
    if prev == '#' && next == '.' {
        return 0;
    }

    match next {
        '.' => cache_or_retrieve(cache, next, &rest, values),
        '#' => cache_or_retrieve(
            cache,
            next,
            &rest,
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
                return cache_or_retrieve(cache, '.', &rest, Vec::from(new_values));
            }

            let mut result = 0;

            if prev != '#' {
                result = cache_or_retrieve(cache, '.', &rest, values.clone());
            }

            result
                + cache_or_retrieve(
                    cache,
                    '#',
                    &rest,
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
        let mut cache: HashMap<(char, String, Vec<u8>), u64> = HashMap::new();
        let tmp_result = rec(
            &mut cache,
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
