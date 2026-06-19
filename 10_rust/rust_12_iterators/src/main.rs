fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // loop with iter
    for n in numbers.iter() {
        print!("{n} ");
    }
    println!();

    // map + filter + collect
    let evens: Vec<i32> = numbers
        .iter()
        .filter(|&&n| n % 2 == 0)
        .map(|&n| n * 2)
        .collect();
    println!("{:?}", evens);

    // sum
    let sum: i32 = numbers.iter().sum();
    println!("sum: {sum}");
}
