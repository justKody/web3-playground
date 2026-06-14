fn main() {
    let x = String::from("Hello");
    println!("x: {}", x);
    let y = x;
    println!("y: {}", y);

    let mut my_string: String = String::from("Hello");

    my_string = takes_ownership(my_string);
    println!("my_string: {}", my_string);
}


fn takes_ownership(s: String) -> String {
    println!("s: {}", s);

    return s;
}