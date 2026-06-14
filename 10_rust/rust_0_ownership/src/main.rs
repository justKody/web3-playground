fn main() {
    println!("Hello, world!"); // it is a macro and not a function


    let x: i32 = 1;

    println!("{}------{}", x, x);

    let is_male: bool = true;   

    if !is_male {
        println!("Wap")
    } 


    // ownerships

    let mut s: String = String::from("Smarth");
    let len = get_len(&s);
    println!("The length of the string is {}", len);

    change_string(&mut s);
    println!("The string is now {}", s);

    let first_char = get_first_char(&s);
    println!("The first character of the string is {}", first_char);


}

fn get_len(str: &String) -> usize {
    return str.len()
}

fn get_first_char(str: &String) -> char {
    return str.chars().next().unwrap()
}

fn change_string(str: &mut String) {
    str.push_str(" World");
}
