

fn main () {
    let a: i32 = 10;
    let b: i32 = 20;
    let result = mul_generic(a, b);
    println!("Result: {}", result);
    let c: f64 = 10.2;
    let d: f64 = 20.0;
    let result = mul_generic(c, d);
    println!("Result: {}", result);


    let v: Vec<i32> = vec![1, 2, 3, 4, 5];
    let first = first_element(v);
    println!("First element: {}", first);
    let v: Vec<f64> = vec![1.0, 2.0, 3.0, 4.0, 5.0];
    let first = first_element(v);
    println!("First element: {}", first);
    let v: Vec<String> = vec![String::from("Hello"), String::from("World")];
    let first = first_element(v);
    println!("First element: {}", first);
}

fn mul_generic<T: std::ops::Mul<Output = T>>(a: T, b: T) -> T {
    a * b
}

fn first_element<T>(v: Vec<T>) -> T {
    v.into_iter().next().unwrap()
}